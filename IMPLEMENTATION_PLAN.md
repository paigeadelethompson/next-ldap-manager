# LDAP Manager

A web-based LDAP management console for administering multiple LDAP-backed services through a single interface.

This application provides explicit CRUD management for:

* Asterisk
* FreeRADIUS
* Kerberos (krb5)
* Netcrave
* OpenDKIM
* OpenLDAP
* PowerDNS
* Sendmail

The project is intentionally service-driven rather than schema-driven.

---

# Design Goals

## Explicit Over Generic

This application is not intended to be a generic LDAP browser.

Each supported service has:

* Explicit TypeScript types
* Explicit GraphQL operations
* Explicit LDAP attribute mappings
* Explicit React forms
* Explicit validation rules

No runtime schema interpretation is performed.

---

## No Schema Parsing

LDAP schema files are documentation only.

The application does not:

* Parse schema files
* Generate forms from objectClasses
* Generate GraphQL from schemas
* Dynamically discover LDAP structures

The schema definitions exist only as implementation references.

### Not Included

* schema.ts
* schema-parser.ts
* objectclass-parser.ts
* attribute-parser.ts
* dynamic-form.tsx
* form-generator.ts

These concepts are intentionally excluded.

---

## Minimal File Complexity

GraphQL functionality is organized by service.

Instead of:

graphql/
├── queries.ts
├── mutations.ts
├── resolvers.ts
└── type-defs.ts

Each service is implemented as a single file:

graphql/
├── asterisk.ts
├── freeradius.ts
├── krb5.ts
├── netcrave.ts
├── opendkim.ts
├── openldap.ts
├── powerdns.ts
└── sendmail.ts

Each file contains:

* GraphQL schema
* Queries
* Mutations
* Resolvers

in one location.

---

# Supported Services

## Asterisk

Management of:

* SIP accounts
* IAX accounts
* Dialplans
* Voicemail
* Configuration entries

Operations:

* Create account
* Update account
* Delete account
* Search accounts
* Manage extensions
* Manage voicemail

---

## FreeRADIUS

Management of:

* Authentication profiles
* Reply attributes
* Check attributes
* NAS clients

Operations:

* Create profile
* Update profile
* Delete profile
* Create NAS client
* Manage authentication policies

---

## Kerberos

Management of:

* Realms
* Principals
* Ticket policies
* Password policies

Operations:

* Create principal
* Modify principal
* Delete principal
* Manage policy assignments

---

## Netcrave

Management of:

* Certificate templates
* Issued certificates
* ICAP services

Operations:

* Create certificate records
* Update certificate metadata
* Manage ICAP services

---

## OpenDKIM

Management of:

* Selectors
* Domains
* Signing keys
* Policies

Operations:

* Create selector
* Rotate keys
* Manage signing rules

---

## OpenLDAP

Management of:

* Users
* Groups
* Organizational units
* Generic LDAP entries

Operations:

* Create entries
* Modify entries
* Delete entries
* Search entries

---

## PowerDNS

Management of:

* Domains
* Zones
* Records
* Metadata

Supported record types:

* A
* AAAA
* CNAME
* MX
* TXT
* NS
* PTR
* SRV
* CAA

Operations:

* Create zones
* Create records
* Update records
* Delete records

---

## Sendmail

Management of:

* Aliases
* Maps
* Classes
* MTA configuration

Operations:

* Create aliases
* Modify aliases
* Delete aliases
* Manage map entries

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Custom CSS
* IBM Plex Sans
* IBM Plex Mono
* normalize.css

- https://www.npmjs.com/package/@ibm/plex-mono
- www.npmjs.com/package/@fontsource/ibm-plex-sans
- https://www.npmjs.com/package/normalize.css
- https://www.npmjs.com/package/graphql
- https://www.npmjs.com/package/next

### UI Philosophy

No third-party component frameworks.

Not used:

* Tailwind CSS
* Material UI
* Chakra UI
* Bootstrap
* Ant Design
* Mantine

All UI components are implemented locally.

---

## Backend

* GraphQL
* Apollo Server
* ldapts

---

## LDAP

The application communicates directly with LDAP through ldapts.

Supported operations:

* Bind
* Search
* Add
* Modify
* Delete

---

# Project Structure

src/

app/
├── api/
│   └── graphql/
│       └── route.ts
├── layout.tsx
├── page.tsx
├── asterisk/
├── freeradius/
├── krb5/
├── netcrave/
├── opendkim/
├── openldap/
├── powerdns/
└── sendmail/

components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Table.tsx
│   └── Modal.tsx
│
└── services/
├── asterisk/
├── freeradius/
├── krb5/
├── netcrave/
├── opendkim/
├── openldap/
├── powerdns/
└── sendmail/

lib/
├── ldap/
│   ├── client.ts
│   └── ldif.ts
│
├── graphql/
│   ├── index.ts
│   ├── asterisk.ts
│   ├── freeradius.ts
│   ├── krb5.ts
│   ├── netcrave.ts
│   ├── opendkim.ts
│   ├── openldap.ts
│   ├── powerdns.ts
│   └── sendmail.ts
│
└── types/
├── index.ts
├── asterisk.ts
├── freeradius.ts
├── krb5.ts
├── netcrave.ts
├── opendkim.ts
├── openldap.ts
├── powerdns.ts
└── sendmail.ts

hooks/
├── useLdap.ts
├── useQuery.ts
└── useMutation.ts

styles/
├── globals.css
└── theme.ts

---

# LDAP Client Design

A single LDAP abstraction layer exists:

lib/ldap/client.ts

Responsibilities:

* Connection management
* TLS support
* Bind operations
* Search operations
* Add operations
* Modify operations
* Delete operations

The LDAP client does not contain service-specific logic.

Service-specific attribute mapping occurs inside GraphQL resolvers.

---

# GraphQL Design

Each service owns its GraphQL implementation.

Example:

lib/graphql/powerdns.ts

Contains:

* Type definitions
* Query definitions
* Mutation definitions
* Resolver implementation

No additional files are created.

---

# Authentication

LDAP bind credentials are required.

Configuration is provided through environment variables.

Example:

LDAP_URL=ldaps://ldap.example.com
LDAP_BIND_DN=cn=admin,dc=example,dc=com
LDAP_BIND_PASSWORD=password

---

# Environment Variables

Required:

LDAP_URL=
LDAP_BIND_DN=
LDAP_BIND_PASSWORD=

Optional:

LDAP_TLS_REJECT_UNAUTHORIZED=false

---

# UI Design Standards

Typography:

* IBM Plex Sans
* IBM Plex Mono

Styling:

* Custom CSS only
* CSS modules optional
* normalize.css included

Accessibility:

* Semantic HTML
* Keyboard navigation
* Proper labels
* ARIA attributes where necessary

---

# Development

Install dependencies:

npm install

Run development server:

npm run dev

Run production build:

npm run build

Start production server:

npm start

---

# Testing

## LDAP Client

Verify:

* Bind
* Search
* Add
* Modify
* Delete

## GraphQL

Verify:

* Queries
* Mutations
* Error handling

## Components

Verify:

* Rendering
* Validation
* User interaction

## End-to-End

Verify complete workflows:

* Create entry
* View entry
* Modify entry
* Delete entry

for every supported service.

---

# Architectural Rules

The following rules are mandatory.

## Rule 1

No schema parsing.

Schemas are documentation only.

---

## Rule 2

No dynamic form generation.

All forms are implemented explicitly.

---

## Rule 3

No generic LDAP UI.

Each service owns its own UI.

---

## Rule 4

No GraphQL file explosion.

One GraphQL file per service.

---

## Rule 5

No third-party UI libraries.

Only React and custom CSS.

---

## Rule 6

No ORM patterns.

Resolvers interact directly with the LDAP client.

---

## Rule 7

No repository pattern.

The LDAP client is the only data-access abstraction.

---

# License

Internal project.


# Notes

- Frontend must use grapql to communicate with backend and not use ldap directly; backend uses ldap 

