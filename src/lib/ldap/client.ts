import { Client, Change } from "ldapts";
import { LdapConfig, EntryFilter } from "@/lib/types";

type LdapScope = "base" | "onelevel" | "subtree";

// ldapts uses different scope naming
function mapScope(scope: LdapScope): "base" | "children" | "one" | "sub" {
  const mapping: Record<LdapScope, "base" | "children" | "one" | "sub"> = {
    base: "base",
    onelevel: "one",
    subtree: "sub",
  };
  return mapping[scope];
}

interface SearchResult<T = Record<string, unknown>> {
  dn: string;
  attributes: T;
}

export class LDAPClient {
  private client: Client | null = null;
  private config: LdapConfig;

  constructor(config: LdapConfig) {
    this.config = config;
  }

  private async connect(): Promise<Client> {
    if (this.client) {
      try {
        // Attempt a simple operation to check connection
        await this.client.search(this.config.bindDN, {
          filter: "(objectClass=*)",
          scope: "base",
        });
        return this.client;
      } catch {
        this.client = null;
      }
    }

    const tlsOptions: { rejectUnauthorized?: boolean } = {
      rejectUnauthorized: this.config.tlsRejectUnauthorized,
    };

    this.client = new Client({
      url: this.config.url,
      tlsOptions,
    });

    await this.client.bind(this.config.bindDN, this.config.bindPassword);

    return this.client;
  }

  async search<T = Record<string, unknown>>(
    filter: EntryFilter,
  ): Promise<SearchResult<T>[]> {
    const client = await this.connect();

    try {
      const entries = await client.search(filter.baseDN, {
        filter: filter.filter,
        scope: mapScope((filter.scope as LdapScope) || "subtree"),
        attributes: filter.attributes || ["*"],
      });

      return entries as unknown as SearchResult<T>[];
    } catch (error) {
      console.error("LDAP search error:", error);
      throw new Error(
        `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async searchOne<T = Record<string, unknown>>(
    filter: EntryFilter,
  ): Promise<SearchResult<T> | null> {
    const results = await this.search<T>(filter);
    return results.length > 0 ? results[0] : null;
  }

  async add(dn: string, attributes: Record<string, unknown>): Promise<void> {
    const client = await this.connect();

    try {
      // Convert attributes to ldapts format
      const formattedAttrs: Record<string, string | string[]> = {};
      for (const [key, value] of Object.entries(attributes)) {
        if (Array.isArray(value)) {
          formattedAttrs[key] = value.map((v) => String(v));
        } else if (value !== undefined && value !== null) {
          formattedAttrs[key] = String(value);
        }
      }
      await client.add(dn, formattedAttrs);
    } catch (error) {
      console.error("LDAP add error:", error);
      throw new Error(
        `Add failed for DN ${dn}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async modify(
    dn: string,
    changes: {
      attribute: string;
      values: unknown[];
      operation: "add" | "replace" | "delete";
    }[],
  ): Promise<void> {
    const client = await this.connect();

    try {
      // ldapts Change interface requires specific structure
      // Using type assertion since we're constructing the object correctly
      const ldapChanges = changes.map((change) => ({
        operation: change.operation,
        modification: { [change.attribute]: change.values as string[] },
      })) as unknown as Change[];

      await client.modify(dn, ldapChanges);
    } catch (error) {
      console.error("LDAP modify error:", error);
      throw new Error(
        `Modify failed for DN ${dn}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async delete(dn: string): Promise<void> {
    const client = await this.connect();

    try {
      await client.del(dn);
    } catch (error) {
      console.error("LDAP delete error:", error);
      throw new Error(
        `Delete failed for DN ${dn}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const client = await this.connect();
      return true;
    } catch (error) {
      console.error("LDAP connection test failed:", error);
      return false;
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      try {
        await this.client.unbind();
      } catch (error) {
        console.error("Error closing LDAP connection:", error);
      }
      this.client = null;
    }
  }
}

// Client pool for managing multiple connections
class ClientPool {
  private clients: Map<string, LDAPClient> = new Map();

  getClient(config: LdapConfig): LDAPClient {
    const key = config.url;
    let client = this.clients.get(key);

    if (!client) {
      client = new LDAPClient(config);
      this.clients.set(key, client);
    }

    return client;
  }

  async clear(): Promise<void> {
    for (const client of this.clients.values()) {
      await client.close();
    }
    this.clients.clear();
  }
}

export const ldapClientPool = new ClientPool();
