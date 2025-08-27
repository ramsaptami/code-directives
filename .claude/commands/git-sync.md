---
description: Pull, merge, and push changes in one command
---

Sync with remote repository - pull latest changes, stage all files, and prepare for commit:

```bash
git pull && git add . && git status && echo "Ready to commit and push? Press Enter to continue or Ctrl+C to cancel" && read && git commit -m "sync: automated sync via Claude Code" && git push
```