---
description: Commit changes with conventional format
argumentHints:
  - name: type
    description: Commit type (feat, fix, docs, etc.)
  - name: message
    description: Commit message
---

Add, commit and push changes with conventional commit format:

```bash
git add . && git commit -m "$1: $2" && git push
```