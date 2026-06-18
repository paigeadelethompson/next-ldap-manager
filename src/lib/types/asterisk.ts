// Asterisk LDAP types

export interface AsteriskSipAccount {
  dn: string;
  accountid: string;
  secret?: string;
  context?: string;
  host?: string;
  nat?: string;
  type?: string;
  allow?: string;
  disallow?: string;
  dtmfmode?: string;
  canreinvite?: string;
  callgroup?: string;
  pickupgroup?: string;
  mailbox?: string;
  callerid?: string;
  trustrdn?: string;
  rmip?: string;
  regseconds?: number;
  ipaddr?: string;
  cpeflags?: string;
}

export interface AsteriskIaxAccount {
  dn: string;
  accountid: string;
  secret?: string;
  context?: string;
  host?: string;
  trunks?: boolean;
  transfer?: string;
  password?: string;
  callgroup?: string;
  pickupgroup?: string;
  mailboxes?: string;
}

export interface AsteriskDialplan {
  dn: string;
  context: string;
  exten: string;
  priority: number;
  appname: string;
  appdata?: string;
}

export interface AsteriskVoicemail {
  dn: string;
  uniqueid: string;
  password?: string;
  fullname?: string;
  email?: string;
  pager?: string;
  attach?: string;
  tz?: string;
  dialout?: string;
  context?: string;
  exten?: string;
  emergency_context?: string;
}

// Input types for SIP Account operations
export interface CreateSipAccountInput {
  accountid: string;
  secret?: string;
  context?: string;
  host?: string;
  nat?: string;
  type?: string;
  allow?: string;
  disallow?: string;
  dtmfmode?: string;
  canreinvite?: string;
  callgroup?: string;
  pickupgroup?: string;
  mailboxes?: string;
  callerid?: string;
}

export interface UpdateSipAccountInput {
  secret?: string;
  context?: string;
  host?: string;
  nat?: string;
  type?: string;
  allow?: string;
  disallow?: string;
  dtmfmode?: string;
  canreinvite?: string;
  callgroup?: string;
  pickupgroup?: string;
  mailboxes?: string;
  callerid?: string;
}

// Input types for IAX Account operations
export interface CreateIaxAccountInput {
  accountid: string;
  secret?: string;
  context?: string;
  host?: string;
  trunks?: boolean;
  transfer?: string;
  password?: string;
  callgroup?: string;
  pickupgroup?: string;
  mailboxes?: string;
}

export interface UpdateIaxAccountInput {
  secret?: string;
  context?: string;
  host?: string;
  trunks?: boolean;
  transfer?: string;
  password?: string;
  callgroup?: string;
  pickupgroup?: string;
  mailboxes?: string;
}

// Input types for Dialplan operations
export interface CreateDialplanInput {
  context: string;
  exten: string;
  priority: number;
  appname: string;
  appdata?: string;
}

export interface UpdateDialplanInput {
  priority?: number;
  appname?: string;
  appdata?: string;
}

// Input types for Voicemail operations
export interface CreateVoicemailInput {
  uniqueid: string;
  password?: string;
  fullname?: string;
  email?: string;
  pager?: string;
  attach?: string;
  tz?: string;
  dialout?: string;
  context?: string;
  exten?: string;
  emergency_context?: string;
}

export interface UpdateVoicemailInput {
  password?: string;
  fullname?: string;
  email?: string;
  pager?: string;
  attach?: string;
  tz?: string;
  dialout?: string;
  context?: string;
  exten?: string;
  emergency_context?: string;
}
