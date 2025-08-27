# Development Commands

## npm Scripts
- `npm test` - Run tests (80% coverage required)
- `npm run lint` - ESLint with auto-fix
- `npm run audit` - Security audit

## CLI Commands
- `bp init <name>` - Create project
- `bp validate` - Check compliance  
- `bp audit` - Generate report
- `bp docs` - Generate documentation

## Git Workflow (Terminal)
- `bp-git flow <feature> <message>` - Complete workflow
- `bp-git feature <name>` - Start feature branch
- `bp-git commit <message>` - Commit and push
- `bp-git pr` - Create pull request
- `bp-git sync` - Sync with develop

## IDE Integration
- VS Code: Use Command Palette → "Tasks: Run Task" → Select git task
- Claude Code: Slash commands configured in `.claude/commands/`

## Testing
- Framework: Jest
- Tests: `tests/unit/` and `tests/integration/`
- Coverage: 80% minimum all metrics