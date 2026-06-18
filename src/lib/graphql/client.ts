// GraphQL client for making API calls

interface GraphqlRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
}

export async function graphqlRequest<T = any>(options: GraphqlRequestOptions): Promise<T> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: options.query,
      variables: options.variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors[0].message);
  }

  return data.data;
}

// GraphQL query and mutation strings

export const CREATE_USER_MUTATION = `
  mutation CreateOpenLdapUser($input: CreateUserInput!) {
    createOpenLdapUser(input: $input) {
      dn
      cn
      uid
      mail
      givenName
      sn
      telephoneNumber
      title
      ou
    }
  }
`;

export const CREATE_GROUP_MUTATION = `
  mutation CreateOpenLdapGroup($input: CreateGroupInput!) {
    createOpenLdapGroup(input: $input) {
      dn
      cn
      gidNumber
      memberUid
      description
    }
  }
`;

export const CREATE_OU_MUTATION = `
  mutation CreateOpenLdapOu($input: CreateOuInput!) {
    createOpenLdapOu(input: $input) {
      dn
      ou
      description
    }
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation UpdateOpenLdapUser($dn: String!, $input: UpdateUserInput!) {
    updateOpenLdapUser(dn: $dn, input: $input) {
      dn
      cn
      uid
      mail
      givenName
      sn
      telephoneNumber
      title
      ou
    }
  }
`;

export const DELETE_USER_MUTATION = `
  mutation DeleteOpenLdapUser($dn: String!) {
    deleteOpenLdapUser(dn: $dn)
  }
`;

export const FETCH_USERS_QUERY = `
  query OpenLdapUsers($baseDN: String, $filter: String) {
    openLdapUsers(baseDN: $baseDN, filter: $filter) {
      dn
      cn
      uid
      mail
      givenName
      sn
      telephoneNumber
      title
      ou
    }
  }
`;

export const FETCH_GROUPS_QUERY = `
  query OpenLdapGroups($baseDN: String, $filter: String) {
    openLdapGroups(baseDN: $baseDN, filter: $filter) {
      dn
      cn
      gidNumber
      memberUid
      description
    }
  }
`;

export const FETCH_OUS_QUERY = `
  query OpenLdapOus($baseDN: String, $filter: String) {
    openLdapOus(baseDN: $baseDN, filter: $filter) {
      dn
      ou
      description
    }
  }
`;
