# LDAP Manager

A Next.js application for managing multiple LDAP-based services including OpenLDAP, PowerDNS, FreeRADIUS, Asterisk, Kerberos, Netcrave, OpenDKIM, and Sendmail.

## Configuration

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `LDAP_URL` | LDAP server URL (e.g., `ldaps://ldap.example.com:389`) |
| `LDAP_BIND_DN` | Bind DN for authentication (e.g., `cn=admin,dc=example,dc=com`) |
| `LDAP_BIND_PASSWORD` | Password for the bind user |
| `LDAP_BASE_DN` | Base DN for LDAP searches (e.g., `dc=example,dc=com`) |
| `LDAP_TLS_REJECT_UNAUTHORIZED` | Set to `false` to allow self-signed certificates (default: `true`) |

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server at `http://localhost:3000` |
| `npm run build` | Build the production application |
| `npm start` | Start the production server (requires running `build` first) |
| `npm run lint` | Run ESLint to check for code issues |

## Services

- **OpenLDAP** - Manage users, groups, and organizational units
- **PowerDNS** - Manage DNS zones and records
- **FreeRADIUS** - Manage NAS clients and user attributes
- **Asterisk** - Manage SIP/IAX accounts, extensions, and voicemail
- **Kerberos** - Manage realms, principals, and policies
- **Netcrave** - Manage certificates, templates, and ICAP services
- **OpenDKIM** - Manage domains, selectors, and signing policies
- **Sendmail** - Manage aliases, maps, and classes
