---
description: Create pull request for current branch
argumentHints:
  - name: title
    description: PR title
---

Create a pull request for the current branch:

```bash
gh pr create --title "$ARGUMENTS" --body "Created via Claude Code" --head $(git branch --show-current) --base main
```