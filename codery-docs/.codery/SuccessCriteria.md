# Success Criteria

## Development Principles

1. **No over-engineering**: Requirements drive architecture
2. **Role discipline**: Stay within active role boundaries  
3. **Explicit transitions**: Never switch roles without request
4. **Minimal complexity**: Deliver only what's needed

## Data Rules

5. **Mock data = POC only**: Never use mock data outside POC mode
6. **No workarounds**: Report missing data, don't hack around it
7. **No manufactured data**: Use only actual provided data

## Dependencies

8. **No patching**: Report broken dependencies, don't workaround
9. **No hardcoded IDs**: Use names/properties for dynamic lookups

```javascript
// WRONG: id: '6751f57e2e74d97609e7dca0'
// RIGHT: Look up ID by unique name at runtime
```

These ensure requirement-driven, reliable, environment-flexible code.