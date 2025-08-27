---
description: Start a new feature branch
argumentHints:
  - name: feature-name
    description: Name of the feature branch
---

Create and switch to a new feature branch:

```bash
git checkout -b feature/$ARGUMENTS && echo "Created and switched to feature/$ARGUMENTS branch"
```