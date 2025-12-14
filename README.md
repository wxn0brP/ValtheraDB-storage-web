# ValtheraDB Web Storage

This plugin provides web storage (localStorage/sessionStorage) operations for ValtheraDB.

## Installation

```bash
npm install @wxn0brp/db-storage-web
```

## Usage

```typescript
import { createWebStorageValthera } from "@wxn0brp/db-storage-web";

// Similar to createMemoryValthera, but persists data in web storage
const db = createWebStorageValthera("my-db", {
  users: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Mieszko" }
  ]
});
```