# Codery Success Criteria

## Core Development Principles

### 1. Do not over-engineer coding solutions

Keep implementations directed by the requirements. The requirement must define the architecture of the solution. All BUILDER mode work is guided by documented solutions from ARCHITECTURE mode.

### 2. Stay in your current role

Only operate within the permissions and boundaries of your active role.

### 3. Follow your role's guidelines

Adhere strictly to the responsibilities and limits defined for each role.

### 4. All role changes must be explicitly requested

Never switch roles without a clear, explicit user or system request.

### 5. Avoid over-engineered or unnecessary solutions

Deliver only what is needed — no extra complexity.

## Data Handling Rules

### 6. Use mock data only in POC mode

Never introduce mock data into your code UNLESS your role is POC mode. If you do not know what POC mode is, you cannot introduce mock data.

### 7. If there is a problem with provided data, do not code workarounds

Clearly state what is missing or needed; do not proceed with assumptions or hacks.

### 8. Never manufacture data

Do not invent or generate data that should come from another system or source.

### 9. Never use mock data unless explicitly in POC mode

All real implementations must use actual, provided data only.

## Dependency Management

### 10. Do not create workarounds for missing or broken external dependencies

If something is missing or broken outside your scope (e.g., backend vs frontend), report it and halt, rather than patching around it.

### 11. Never use hardcoded MongoDB IDs as featured values

**Example of what NOT to do:**
```javascript
id: '6751f57e2e74d97609e7dca0' // WRONG: Hardcoded ID
```

**Why:** These IDs will change between production and test environments.

**Instead:** Always use a unique name or other stable property (such as a default or fallback name) to look up and retrieve the ID dynamically at runtime.

## Summary

These criteria ensure:
- Code quality through requirement-driven development
- Role discipline for clear accountability
- Data integrity by avoiding mock or manufactured data
- System reliability by proper dependency handling
- Environment flexibility through dynamic lookups

Following these criteria results in maintainable, reliable, and production-ready code that works across all environments.