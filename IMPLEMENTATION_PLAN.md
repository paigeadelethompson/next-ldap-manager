# LDAP Manager

A web-based LDAP management console for administering multiple LDAP-backed services through a single interface.

## Architecture Overview

```
┌─────────────────┐         GraphQL         ┌──────────────────┐
│   Frontend      │ ◄─────────────────────► │   Backend API    │
│  (Next.js/React)│   Queries & Mutations   │  (Apollo Server) │
└─────────────────┘                         └────────┬─────────┘
                                                     │
                                                     │ ldapts
                                                     ▼
                                            ┌──────────────────┐
                                            │     LDAP         │
                                            │  (Multiple        │
                                            │   Backends)      │
                                            └──────────────────┘
```

## Core Principles

### Explicit Over Generic

Each supported service has:
- **Explicit TypeScript types** - Strict interfaces for all data structures
- **Explicit GraphQL operations** - Service-specific queries and mutations
- **Explicit LDAP attribute mappings** - Hardcoded schema knowledge in resolvers
- **Explicit React forms** - Manual form implementations with specific validation
- **Explicit UI components** - Custom-built, not imported

No runtime schema interpretation or dynamic code generation.

### Service-Driven Design

The application is organized by service, not by LDAP schema. Each service defines:
- Its own data model
- Its own GraphQL API surface
- Its own form components
- Its own validation rules

---

## Supported Services

| Service | Purpose | Key Entities |
|---------|---------|--------------|
| **Asterisk** | SIP PBX management | SIP accounts, IAX accounts, dialplans, voicemail |
| **FreeRADIUS** | Network access authentication | Profiles, NAS clients, attributes |
| **Kerberos (krb5)** | Kerberos realm management | Realms, principals, policies |
| **Netcrave** | Certificate authority | Templates, issued certificates, ICAP services |
| **OpenDKIM** | Email signing | Selectors, domains, signing keys, policies |
| **OpenLDAP** | Generic LDAP entries | Users, groups, OUs, generic entries |
| **PowerDNS** | DNS zone management | Zones, records (A/AAAA/CNAME/MX/TXT/NS/PTR/SRV/CAA) |
| **Sendmail** | Mail routing | Aliases, maps, classes |

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Custom CSS (no framework)
- **Fonts**: IBM Plex Sans (ui), IBM Plex Mono (code)
- **Normalize**: normalize.css for baseline consistency
- **GraphQL Client**: `graphql` package

### Backend
- **Runtime**: Node.js with Apollo Server
- **GraphQL Library**: `@apollo/server`
- **LDAP Library**: `ldapts`

### LDAP Integration
Direct communication via ldapts:
- Bind operations (simple auth)
- TLS/SSL support
- Search, Add, Modify, Delete operations

---

## Project Structure

```
/home/sq/LDAPManager/
├── schemas/                      # LDAP schema documentation (reference only)
│   ├── asterisk/
│   ├── freeradius/
│   ├── krb5/
│   ├── netcrave/
│   ├── opendkim/
│   ├── openldap/
│   ├── powerdns/
│   └── sendmail/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard/home
│   │   ├── api/
│   │   │   └── graphql/
│   │   │       └── route.ts      # Apollo Server entry point
│   │   └── [service]/
│   │       ├── page.tsx          # Service list view
│   │       └── new/page.tsx      # Create entry form
│   │       └── [dn]/page.tsx     # Edit entry view
│   ├── components/
│   │   ├── ui/                   # Shared UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── FormField.tsx
│   │   │   └── Loading.tsx
│   │   └── services/             # Service-specific components
│   │       ├── asterisk/
│   │       ├── freeradius/
│   │       └── ...
│   ├── lib/
│   │   ├── ldap/
│   │   │   ├── client.ts         # LDAP abstraction layer
│   │   │   └── ldif.ts           # LDIF parsing/serialization
│   │   ├── graphql/              # Service-specific GraphQL
│   │   │   ├── index.ts          # Schema stitching
│   │   │   ├── asterisk.ts       # All: schema + queries + mutations + resolvers
│   │   │   ├── freeradius.ts
│   │   │   └── ...
│   │   └── types/                # TypeScript definitions
│   │       ├── index.ts          # Common types
│   │       ├── asterisk.ts
│   │       └── ...
│   └── hooks/
│       ├── useLdap.ts            # LDAP operation hooks
│       ├── useQuery.ts           # GraphQL query hook wrapper
│       └── useMutation.ts        # GraphQL mutation hook wrapper
├── styles/
│   ├── globals.css               # Global styles, CSS variables
│   └── theme.ts                  # Color palette and typography constants
├── .env.example
├── package.json
├── tsconfig.json
└── IMPLEMENTATION_PLAN.md
```

---

## API Design

### GraphQL Organization

Each service lives in a single file:

```typescript
// lib/graphql/powerdns.ts
export const typeDefs = `typeDefs...`;

export const queries = {
  getZones: /* GraphQL */,
  getZone: /* GraphQL */,
};

export const mutations = {
  createZone: /* GraphQL */,
  deleteZone: /* GraphQL */,
};

export const resolvers = {
  Query: { getZones, getZone },
  Mutation: { createZone, deleteZone },
};
```

No separate `queries.ts`, `mutations.ts`, or `resolvers.ts` files.

### Input/Output Patterns

**Create input types** use partial properties with defaultable values.
**Update input types** use partial properties for patches.
**Query return types** are full domain objects.

```typescript
// Example pattern
input ZoneInput {
  name: String!
  soa: String
  ttl: Int
}

input ZoneUpdateInput {
  name: String
  soa: String
  ttl: Int
}
```

---

## Authentication & Authorization

### Connection Configuration
Environment variables for LDAP connection:
```env
LDAP_URL=ldaps://ldap.example.com
LDAP_BIND_DN=cn=admin,dc=example,dc=com
LDAP_BIND_PASSWORD=
LDAP_TLS_REJECT_UNAUTHORIZED=true
```

### Client-Side Auth
Future enhancement: JWT or session-based auth on the frontend.

---

## Development Workflow

### Setup
```bash
npm install
cp .env.example .env
# Edit .env with LDAP credentials
npm run dev
```

### Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |

---

## UI Design Standards

### Typography
- **Body**: IBM Plex Sans (400, 500, 600 weights)
- **Monospace**: IBM Plex Mono (400, 700 weights)
- **Font sizes**: 12px, 14px, 16px, 18px, 24px

### Components
- **Buttons**: Primary (blue), Secondary (gray), Danger (red)
- **Forms**: Labels above inputs, inline validation messages
- **Tables**: Striped rows, sortable columns, pagination
- **Modals**: Backdrop blur, centered content, clear close actions

### Accessibility
- Semantic HTML5
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus indicators visible

---

## Testing Strategy

### Unit Tests
- LDAP client operations (mocked)
- GraphQL resolvers (mocked LDAP)
- Form validation logic

### Integration Tests
- End-to-end workflows per service:
  - Create entry → View entry → Modify entry → Delete entry

### Manual Testing Checklist
Each service should be tested with:
1. Listing existing entries
2. Creating a new entry
3. Editing an existing entry
4. Deleting an entry
5. Searching/filtering entries

---

## Implementation Priority

Phase 1 (Core): **COMPLETED**
1. LDAP client layer (`lib/ldap/client.ts`)
2. Common UI components (`components/ui/`)
3. OpenLDAP service (most generic)
4. GraphQL API setup

Phase 2 (Services):
5. Asterisk
6. FreeRADIUS
7. PowerDNS
8. Kerberos
9. OpenDKIM
10. Sendmail
11. Netcrave

Phase 3 (Polish):
12. Error handling improvements
13. Performance optimization
14. Documentation

---

## Architectural Rules

| Rule | Description |
|------|-------------|
| **No schema parsing** | Schemas are reference only; no runtime parsing |
| **No dynamic forms** | All forms implemented explicitly |
| **Service ownership** | Each service owns its GraphQL and UI |
| **One GraphQL file per service** | Schema + queries + mutations + resolvers together |
| **No UI frameworks** | Custom CSS only, no Tailwind/Material/Bootstrap |
| **Direct LDAP access** | No ORM or repository pattern |
| **Explicit types** | All TypeScript interfaces defined manually |

---

## References

- [ldapts Documentation](https://ldapts.dev/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/server/)
- [Next.js App Router](https://nextjs.org/docs/app)
- LDAP schema files in `schemas/` directory (documentation only)
