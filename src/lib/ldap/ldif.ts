// LDIF parsing and serialization utilities

export interface LDIFEntry {
  dn: string;
  attributes: Record<string, string | string[]>;
}

export function parseLDIF(ldif: string): LDIFEntry[] {
  const entries: LDIFEntry[] = [];
  let currentEntry: Partial<LDIFEntry> = {};
  let currentAttribute: string | null = null;

  const lines = ldif.split('\n');

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line.trim() || line.startsWith('#')) {
      continue;
    }

    // Handle line continuation (spaces at start)
    if (line.startsWith(' ') && currentAttribute) {
      const continuedValue = line.trim();
      const currentValue = currentEntry.attributes?.[currentAttribute];

      if (Array.isArray(currentValue)) {
        currentValue[currentValue.length - 1] += continuedValue;
      } else if (currentValue) {
        currentEntry.attributes![currentAttribute] = [currentValue, continuedValue];
      }
      continue;
    }

    // Parse attribute: value
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const attribute = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Handle base64 encoded values (::)
      if (line[colonIndex + 1] === ':') {
        try {
          value = atob(value);
        } catch {
          // Ignore decode errors
        }
      }

      if (!currentEntry.attributes) {
        currentEntry.attributes = {};
      }

      currentAttribute = attribute;

      // Handle multi-valued attributes
      if (currentEntry.attributes[attribute]) {
        const existing = currentEntry.attributes[attribute];
        if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          currentEntry.attributes[attribute] = [existing, value];
        }
      } else {
        currentEntry.attributes[attribute] = value;
      }
    }

    // Check for entry separator (single -)
    if (line === '-') {
      if (currentEntry.dn && currentEntry.attributes) {
        entries.push(currentEntry as LDIFEntry);
      }
      currentEntry = {};
      currentAttribute = null;
    }
  }

  // Add the last entry
  if (currentEntry.dn && currentEntry.attributes) {
    entries.push(currentEntry as LDIFEntry);
  }

  return entries;
}

export function serializeLDIF(entries: LDIFEntry[]): string {
  return entries.map(serializeEntry).join('\n---\n');
}

function serializeEntry(entry: LDIFEntry): string {
  const lines = [`dn: ${entry.dn}`];

  for (const [attribute, values] of Object.entries(entry.attributes)) {
    const attributeValues = Array.isArray(values) ? values : [values];

    for (const value of attributeValues) {
      // Check if value needs base64 encoding
      if (/[^ -~]/.test(value)) {
        lines.push(`${attribute}:: ${btoa(value)}`);
      } else {
        lines.push(`${attribute}: ${value}`);
      }
    }
  }

  return lines.join('\n');
}
