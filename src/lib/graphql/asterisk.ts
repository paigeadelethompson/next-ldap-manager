// Asterisk GraphQL schema, queries, mutations, and resolvers

export const typeDefs = `
  # Asterisk Types
  type AsteriskSipAccount {
    dn: String!
    accountid: String!
    secret: String
    context: String
    host: String
    nat: String
    type: String
    allow: String
    disallow: String
    dtmfmode: String
    canreinvite: String
    callgroup: String
    pickupgroup: String
    mailbox: String
    callerid: String
    trustrdn: String
    rmip: String
    regseconds: Int
    ipaddr: String
    cpeflags: String
  }

  type AsteriskIaxAccount {
    dn: String!
    accountid: String!
    secret: String
    context: String
    host: String
    trunks: Boolean
    transfer: String
    password: String
    callgroup: String
    pickupgroup: String
    mailboxes: String
  }

  type AsteriskDialplan {
    dn: String!
    context: String!
    exten: String!
    priority: Int!
    appname: String!
    appdata: String
  }

  type AsteriskVoicemail {
    dn: String!
    uniqueid: String!
    password: String
    fullname: String
    email: String
    pager: String
    attach: String
    tz: String
    dialout: String
    context: String
    exten: String
    emergency_context: String
  }

  extend type Query {
    # SIP Accounts
    asteriskSipAccounts(context: String, filter: String): [AsteriskSipAccount]!
    asteriskSipAccount(dn: String!): AsteriskSipAccount

    # IAX Accounts
    asteriskIaxAccounts(context: String, filter: String): [AsteriskIaxAccount]!
    asteriskIaxAccount(dn: String!): AsteriskIaxAccount

    # Dialplan
    asteriskDialplans(context: String, exten: String): [AsteriskDialplan]!
    asteriskDialplan(dn: String!): AsteriskDialplan

    # Voicemail
    asteriskVoicemails(context: String, filter: String): [AsteriskVoicemail]!
    asteriskVoicemail(uniqueid: String!): AsteriskVoicemail
  }

  extend type Mutation {
    # SIP Account operations
    createAsteriskSipAccount(input: CreateSipAccountInput!): AsteriskSipAccount!
    updateAsteriskSipAccount(dn: String!, input: UpdateSipAccountInput!): AsteriskSipAccount!
    deleteAsteriskSipAccount(dn: String!): Boolean!

    # IAX Account operations
    createAsteriskIaxAccount(input: CreateIaxAccountInput!): AsteriskIaxAccount!
    updateAsteriskIaxAccount(dn: String!, input: UpdateIaxAccountInput!): AsteriskIaxAccount!
    deleteAsteriskIaxAccount(dn: String!): Boolean!

    # Dialplan operations
    createAsteriskDialplan(input: CreateDialplanInput!): AsteriskDialplan!
    updateAsteriskDialplan(dn: String!, input: UpdateDialplanInput!): AsteriskDialplan!
    deleteAsteriskDialplan(dn: String!): Boolean!

    # Voicemail operations
    createAsteriskVoicemail(input: CreateVoicemailInput!): AsteriskVoicemail!
    updateAsteriskVoicemail(uniqueid: String!, input: UpdateVoicemailInput!): AsteriskVoicemail!
    deleteAsteriskVoicemail(uniqueid: String!): Boolean!
  }

  input CreateSipAccountInput {
    accountid: String!
    secret: String
    context: String
    host: String
    nat: String
    type: String
    allow: String
    disallow: String
    dtmfmode: String
    canreinvite: String
    callgroup: String
    pickupgroup: String
    mailboxes: String
    callerid: String
  }

  input UpdateSipAccountInput {
    secret: String
    context: String
    host: String
    nat: String
    type: String
    allow: String
    disallow: String
    dtmfmode: String
    canreinvite: String
    callgroup: String
    pickupgroup: String
    mailboxes: String
    callerid: String
  }

  input CreateIaxAccountInput {
    accountid: String!
    secret: String
    context: String
    host: String
    trunks: Boolean
    transfer: String
    password: String
    callgroup: String
    pickupgroup: String
    mailboxes: String
  }

  input UpdateIaxAccountInput {
    secret: String
    context: String
    host: String
    trunks: Boolean
    transfer: String
    password: String
    callgroup: String
    pickupgroup: String
    mailboxes: String
  }

  input CreateDialplanInput {
    context: String!
    exten: String!
    priority: Int!
    appname: String!
    appdata: String
  }

  input UpdateDialplanInput {
    priority: Int
    appname: String
    appdata: String
  }

  input CreateVoicemailInput {
    uniqueid: String!
    password: String
    fullname: String
    email: String
    pager: String
    attach: String
    tz: String
    dialout: String
    context: String
    exten: String
    emergency_context: String
  }

  input UpdateVoicemailInput {
    password: String
    fullname: String
    email: String
    pager: String
    attach: String
    tz: String
    dialout: String
    context: String
    exten: String
    emergency_context: String
  }
`;

export const queries = {};

export const mutations = {};

export const resolvers = {};

// Asterisk GraphQL queries and mutations for client-side use

export const CREATE_ASTERISK_SIP_ACCOUNT_MUTATION = `
  mutation CreateAsteriskSipAccount($input: CreateSipAccountInput!) {
    createAsteriskSipAccount(input: $input) {
      dn
      accountid
      secret
      context
      host
      nat
      type
      allow
      disallow
      dtmfmode
      canreinvite
      callgroup
      pickupgroup
      mailbox
      callerid
      trustrdn
      rmip
      regseconds
      ipaddr
      cpeflags
    }
  }
`;

export const UPDATE_ASTERISK_SIP_ACCOUNT_MUTATION = `
  mutation UpdateAsteriskSipAccount($dn: String!, $input: UpdateSipAccountInput!) {
    updateAsteriskSipAccount(dn: $dn, input: $input) {
      dn
      accountid
      secret
      context
      host
      nat
      type
      allow
      disallow
      dtmfmode
      canreinvite
      callgroup
      pickupgroup
      mailbox
      callerid
      trustrdn
      rmip
      regseconds
      ipaddr
      cpeflags
    }
  }
`;

export const DELETE_ASTERISK_SIP_ACCOUNT_MUTATION = `
  mutation DeleteAsteriskSipAccount($dn: String!) {
    deleteAsteriskSipAccount(dn: $dn)
  }
`;

export const CREATE_ASTERISK_IAX_ACCOUNT_MUTATION = `
  mutation CreateAsteriskIaxAccount($input: CreateIaxAccountInput!) {
    createAsteriskIaxAccount(input: $input) {
      dn
      accountid
      secret
      context
      host
      trunks
      transfer
      password
      callgroup
      pickupgroup
      mailboxes
    }
  }
`;

export const UPDATE_ASTERISK_IAX_ACCOUNT_MUTATION = `
  mutation UpdateAsteriskIaxAccount($dn: String!, $input: UpdateIaxAccountInput!) {
    updateAsteriskIaxAccount(dn: $dn, input: $input) {
      dn
      accountid
      secret
      context
      host
      trunks
      transfer
      password
      callgroup
      pickupgroup
      mailboxes
    }
  }
`;

export const DELETE_ASTERISK_IAX_ACCOUNT_MUTATION = `
  mutation DeleteAsteriskIaxAccount($dn: String!) {
    deleteAsteriskIaxAccount(dn: $dn)
  }
`;

export const CREATE_ASTERISK_DIALPLAN_MUTATION = `
  mutation CreateAsteriskDialplan($input: CreateDialplanInput!) {
    createAsteriskDialplan(input: $input) {
      dn
      context
      exten
      priority
      appname
      appdata
    }
  }
`;

export const UPDATE_ASTERISK_DIALPLAN_MUTATION = `
  mutation UpdateAsteriskDialplan($dn: String!, $input: UpdateDialplanInput!) {
    updateAsteriskDialplan(dn: $dn, input: $input) {
      dn
      context
      exten
      priority
      appname
      appdata
    }
  }
`;

export const DELETE_ASTERISK_DIALPLAN_MUTATION = `
  mutation DeleteAsteriskDialplan($dn: String!) {
    deleteAsteriskDialplan(dn: $dn)
  }
`;

export const CREATE_ASTERISK_VOICEMAIL_MUTATION = `
  mutation CreateAsteriskVoicemail($input: CreateVoicemailInput!) {
    createAsteriskVoicemail(input: $input) {
      dn
      uniqueid
      password
      fullname
      email
      pager
      attach
      tz
      dialout
      context
      exten
      emergency_context
    }
  }
`;

export const UPDATE_ASTERISK_VOICEMAIL_MUTATION = `
  mutation UpdateAsteriskVoicemail($uniqueid: String!, $input: UpdateVoicemailInput!) {
    updateAsteriskVoicemail(uniqueid: $uniqueid, input: $input) {
      dn
      uniqueid
      password
      fullname
      email
      pager
      attach
      tz
      dialout
      context
      exten
      emergency_context
    }
  }
`;

export const DELETE_ASTERISK_VOICEMAIL_MUTATION = `
  mutation DeleteAsteriskVoicemail($uniqueid: String!) {
    deleteAsteriskVoicemail(uniqueid: $uniqueid)
  }
`;

export const FETCH_ASTERISK_SIP_ACCOUNTS_QUERY = `
  query AsteriskSipAccounts($context: String, $filter: String) {
    asteriskSipAccounts(context: $context, filter: $filter) {
      dn
      accountid
      secret
      context
      host
      nat
      type
      allow
      disallow
      dtmfmode
      canreinvite
      callgroup
      pickupgroup
      mailbox
      callerid
      trustrdn
      rmip
      regseconds
      ipaddr
      cpeflags
    }
  }
`;

export const FETCH_ASTERISK_IAX_ACCOUNTS_QUERY = `
  query AsteriskIaxAccounts($context: String, $filter: String) {
    asteriskIaxAccounts(context: $context, filter: $filter) {
      dn
      accountid
      secret
      context
      host
      trunks
      transfer
      password
      callgroup
      pickupgroup
      mailboxes
    }
  }
`;

export const FETCH_ASTERISK_DIALPLANS_QUERY = `
  query AsteriskDialplans($context: String, $exten: String) {
    asteriskDialplans(context: $context, exten: $exten) {
      dn
      context
      exten
      priority
      appname
      appdata
    }
  }
`;

export const FETCH_ASTERISK_VOICEMAILS_QUERY = `
  query AsteriskVoicemails($context: String, $filter: String) {
    asteriskVoicemails(context: $context, filter: $filter) {
      dn
      uniqueid
      password
      fullname
      email
      pager
      attach
      tz
      dialout
      context
      exten
      emergency_context
    }
  }
`;
