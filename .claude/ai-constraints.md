# AI Development Constraints

## What I Need to Know (Minimal)

### Project Structure
```
cli/     - Command tools
lib/     - Core SDK code  
docs/    - Human documentation
tests/   - Test files
```

### Key Commands
- `npm test` - Run tests (80% coverage required)
- `npm run lint` - ESLint with auto-fix
- `npm run audit` - Security audit
- `bp validate` - Check compliance

### Non-Negotiable Constraints
- 80% test coverage minimum
- No hardcoded secrets/keys
- Bundle size: 500KB max
- API response: 500ms max
- Use existing dependencies only

### What I DON'T Need
- Verbose examples (I understand patterns)
- Excessive comments (code should be self-documenting)
- Step-by-step tutorials (I can infer from structure)
- Multiple documentation sources (one source of truth)

### Configuration
Projects use `.bp-config.yml` - keep it minimal, core settings only.

### Trust Factors
- I understand code conventions from existing files
- I follow security best practices by default
- I can write clean, maintainable code without excessive guidance
- Focus on telling me constraints, not how to code