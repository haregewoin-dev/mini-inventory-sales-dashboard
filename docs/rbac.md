# Role-Based Access Control (RBAC) — Mini Inventory & Sales Dashboard

##  Overview

This document defines the complete authentication and authorization model for the **Mini Inventory & Sales Dashboard**. It outlines user identity handling, role definitions, access matrix, business constraints, and route protection mechanisms for **Supabase Auth + Next.js Middleware + Prisma ORM**.

### Purpose

The security model ensures:

- Secure access and identity verification
- Clear separation of responsibilities
- Least privilege enforcement
- Stock and audit rule compliance
- API route and server action protection
- System integrity across multi-user workflows

---

## Design Principles

### Identity & Authentication
- Token-based identity verification via JWT
- Password hashing and secure storage via Supabase Auth
- Stateless session management validated at API frontiers

### Principle of Least Privilege
- Default deny policy across all routes
- Distinct boundary between operational tasks and administrative overrides

### Defense in Depth
- Edge middleware route guards
- Server-side payload and role validation
- Row-Level Security (RLS) in the database layer

### Auditability & Traceability
- User-attributed actions across sales, inventory, and management logs
- Immutable activity log generation

---

## Architecture Overview

### Roles

- `ADMIN`
- `STAFF`

### Security Boundary

```text
[ Client Request ]
       │
       ▼
[ Supabase Auth JWT ]
       │
       ▼
[ Middleware / API Route Validation ]
       │
       ▼
[ Prisma ORM / Database RLS ]