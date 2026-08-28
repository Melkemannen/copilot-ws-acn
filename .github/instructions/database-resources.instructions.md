---
applyTo: "backend/src/main/resources/**/*.sql"
---

## Database resource conventions
- Preserve compatibility with the schema and entity mappings.
- Use explicit column names in INSERT statements.
- Keep seed IDs stable because orders refer to products by ID.
- Avoid destructive statements unless the task explicitly requires them.