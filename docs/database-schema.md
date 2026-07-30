# Database Schema — Mini Inventory & Sales Dashboard

## Project Overview

This document defines the complete database design for the **Mini Inventory & Sales Dashboard**. It includes schema definitions, SQL statements, business rules, validation logic, and performance guidelines for **PostgreSQL + Prisma ORM**.

### Purpose

The system supports:

- Inventory management
- Sales tracking
- Role-based access control (RBAC)
- Stock movement auditing
- Activity logging
- Analytics and reporting

---

## Design Principles

### Normalization
- No duplicated data
- Referential integrity using foreign keys
- Clear table relationships

### Auditability
- Every stock change is logged
- Important actions are recorded

### Scalability
- UUID primary keys
- Indexed lookup fields
- Enum validation

### Compatibility
- PostgreSQL
- Prisma ORM
- Supabase

---

## Schema Overview

### Tables

- users
- products
- sales
- stock_movements
- activity_logs

### Enums

- Role → ADMIN, STAFF
- StockChangeType → RESTOCK, SALE, ADJUSTMENT

### Relationships

```text
users (1) ────< sales >──── (1) products
users (1) ────< stock_movements >──── (1) products
users (1) ────< activity_logs

products (1) ────< sales
products (1) ────< stock_movements
```

---

# SQL Schema

## users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN','STAFF')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | No | Primary key |
| name | TEXT | No | User name |
| email | TEXT | No | Unique login email |
| password_hash | TEXT | No | Password hash |
| role | TEXT | No | ADMIN or STAFF |
| created_at | TIMESTAMP | No | Created timestamp |
| updated_at | TIMESTAMP | No | Updated timestamp |

**Business Rules**

- Email must be unique.
- Passwords are hashed.
- Only ADMIN manages roles.

---

## products

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category TEXT,
    price NUMERIC(10,2) NOT NULL,
    quantity INTEGER DEFAULT 0,
    supplier TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | No | Product ID |
| name | TEXT | No | Product name |
| sku | TEXT | No | Unique SKU |
| category | TEXT | Yes | Category |
| price | NUMERIC(10,2) | No | Unit price |
| quantity | INTEGER | No | Stock |
| supplier | TEXT | Yes | Supplier |

**Business Rules**

- SKU unique.
- Price ≥ 0.
- Quantity cannot become negative.

---

## sales

```sql
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    user_id UUID REFERENCES users(id),
    quantity INTEGER NOT NULL,
    sale_price NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Business Rules**

- Sale quantity ≤ available stock.
- total_amount = quantity × sale_price.
- Sale creates stock movement.

---

## stock_movements

```sql
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    user_id UUID REFERENCES users(id),
    change_type TEXT NOT NULL CHECK (change_type IN ('RESTOCK','SALE','ADJUSTMENT')),
    quantity_change INTEGER NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Business Rules**

- RESTOCK → positive quantity.
- SALE → negative quantity.
- ADJUSTMENT → positive or negative.

---

## activity_logs

```sql
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Business Rules**

- Product updates create logs.
- Stock movements create logs.

---

# Common Queries

```sql
SELECT * FROM products WHERE quantity < 5;
```

```sql
SELECT product_id,SUM(quantity) total_sold
FROM sales
GROUP BY product_id
ORDER BY total_sold DESC;
```

```sql
SELECT SUM(total_amount)
FROM sales
WHERE sale_date::date=CURRENT_DATE;
```

```sql
SELECT SUM(price*quantity) inventory_value
FROM products;
```

```sql
SELECT *
FROM activity_logs
ORDER BY created_at DESC
LIMIT 20;
```

---

# Index Inventory

| Table | Column | Index | Purpose |
|---|---|---|---|
| users | email | UNIQUE | Login |
| products | sku | UNIQUE | Product lookup |
| products | name | BTREE | Search |
| sales | sale_date | BTREE | Analytics |
| sales | product_id | BTREE | History |
| stock_movements | product_id | BTREE | Inventory |

---

# Performance Targets

| Query | Target |
|---|---:|
| Product lookup | <5 ms |
| Inventory value | <30 ms |
| Sales summary | <50 ms |
| Best-selling products | <100 ms |
| Activity logs | <20 ms |

---

# Validation Rules

## Backend

- quantity ≥ 0
- sale_price ≥ 0
- total_amount = quantity × sale_price
- role ∈ {ADMIN, STAFF}
- change_type ∈ {RESTOCK, SALE, ADJUSTMENT}

## Database

- CHECK constraints
- Foreign keys
- UNIQUE indexes

---

# Migration History

| Version | Description | Date |
|---|---|---|
| 1.0 | Initial schema | 2026-07-30 |

Future changes are managed using **Prisma Migrate**.

---

# Versioning

- **Schema Version:** 1.0
- **Status:** Active
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Migration Tool:** Prisma Migrate
