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
