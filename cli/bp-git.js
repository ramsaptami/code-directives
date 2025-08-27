#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

const program = new Command();

// Execute shell command with error handling
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    return result;
  } catch (error) {
    console.error(chalk.red(`Error executing: ${command}`));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

// Check if we're in a git repository
function checkGitRepo() {
  try {
    execCommand('git rev-parse --git-dir', { silent: true });
    return true;
  } catch {
    console.error(chalk.red('Not a git repository. Please run this command from a git repository.'));
    return false;
  }
}

// Get current branch name
function getCurrentBranch() {
  try {
    return execCommand('git branch --show-current', { silent: true }).trim();
  } catch {
    return null;
  }
}

// Check if branch exists locally
function branchExists(branchName) {
  try {
    execCommand(`git show-ref --verify --quiet refs/heads/${branchName}`, { silent: true });
    return true;
  } catch {
    return false;
  }
}

// Check if there are uncommitted changes
function hasUncommittedChanges() {
  try {
    const result = execCommand('git status --porcelain', { silent: true });
    return result.trim().length > 0;
  } catch {
    return false;
  }
}

// Feature workflow command
program
  .command('feature')
  .description('Start a new feature branch workflow')
  .argument('<feature-name>', 'Name of the feature')
  .option('-m, --message <message>', 'Initial commit message')
  .option('--no-push', 'Don\'t push the branch to remote')
  .action(async (featureName, options) => {
    if (!checkGitRepo()) return;

    const branchName = `feature/${featureName}`;
    console.log(chalk.blue(`Starting feature workflow: ${branchName}`));

    // Check if feature branch already exists
    if (branchExists(branchName)) {
      const { proceed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: `Branch ${branchName} already exists. Switch to it?`,
        default: true
      }]);
      
      if (proceed) {
        execCommand(`git checkout ${branchName}`);
        console.log(chalk.green(`Switched to existing branch: ${branchName}`));
      }
      return;
    }

    // Ensure we're on develop branch and it's up to date
    console.log(chalk.yellow('Ensuring develop branch is up to date...'));
    execCommand('git checkout develop');
    execCommand('git pull origin develop');

    // Create and checkout new feature branch
    console.log(chalk.yellow(`Creating feature branch: ${branchName}`));
    execCommand(`git checkout -b ${branchName}`);

    // If initial commit message provided, create initial commit
    if (options.message) {
      console.log(chalk.yellow('Creating initial commit...'));
      execCommand('git commit --allow-empty -m "feat: ' + options.message + '"');
    }

    // Push branch to remote unless --no-push specified
    if (options.push !== false) {
      console.log(chalk.yellow('Pushing branch to remote...'));
      execCommand(`git push -u origin ${branchName}`);
    }

    console.log(chalk.green(`✅ Feature branch ${branchName} is ready!`));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.cyan('  1. Make your changes'));
    console.log(chalk.cyan('  2. Run: bp git commit "your changes"'));
    console.log(chalk.cyan('  3. Run: bp git pr'));
  });

// Commit and push workflow
program
  .command('commit')
  .description('Commit changes and push to current branch')
  .argument('<message>', 'Commit message')
  .option('-t, --type <type>', 'Commit type (feat, fix, docs, etc.)', 'feat')
  .option('--no-push', 'Don\'t push after committing')
  .option('--no-validate', 'Skip validation before committing')
  .action(async (message, options) => {
    if (!checkGitRepo()) return;

    const currentBranch = getCurrentBranch();
    if (!currentBranch) {
      console.error(chalk.red('Could not determine current branch'));
      return;
    }

    // Check if there are changes to commit
    if (!hasUncommittedChanges()) {
      console.log(chalk.yellow('No changes to commit'));
      return;
    }

    // Run validation unless skipped
    if (options.validate !== false) {
      console.log(chalk.yellow('Running pre-commit validation...'));
      try {
        execCommand('npm run lint');
        execCommand('npm test');
      } catch (error) {
        console.error(chalk.red('Validation failed. Use --no-validate to skip.'));
        return;
      }
    }

    // Format commit message with type
    const commitMessage = message.startsWith(`${options.type}:`) ? 
      message : 
      `${options.type}: ${message}`;

    console.log(chalk.yellow('Committing changes...'));
    execCommand('git add .');
    execCommand(`git commit -m "${commitMessage}"`);

    // Push unless --no-push specified
    if (options.push !== false) {
      console.log(chalk.yellow('Pushing to remote...'));
      execCommand(`git push origin ${currentBranch}`);
    }

    console.log(chalk.green(`✅ Committed and pushed: ${commitMessage}`));
  });

// Pull request workflow
program
  .command('pr')
  .description('Create pull request and trigger automated workflow')
  .option('-t, --title <title>', 'PR title')
  .option('-d, --description <description>', 'PR description')
  .option('--draft', 'Create as draft PR')
  .action(async (options) => {
    if (!checkGitRepo()) return;

    const currentBranch = getCurrentBranch();
    if (!currentBranch || currentBranch === 'main' || currentBranch === 'develop') {
      console.error(chalk.red('Please run this from a feature branch'));
      return;
    }

    // Check if GitHub CLI is available
    try {
      execCommand('gh --version', { silent: true });
    } catch {
      console.error(chalk.red('GitHub CLI (gh) is not installed. Please install it first.'));
      console.log(chalk.cyan('Install: https://cli.github.com/'));
      return;
    }

    // Ensure branch is pushed
    console.log(chalk.yellow('Ensuring branch is up to date...'));
    execCommand(`git push origin ${currentBranch}`);

    // Prepare PR details
    const title = options.title || `${currentBranch.replace('feature/', '').replace('-', ' ')}`;
    const description = options.description || `
## Summary
Changes from ${currentBranch}

## Changes
- [List your changes here]

## Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes

🤖 Generated with Code Directives SDK
`;

    // Create PR
    const draftFlag = options.draft ? '--draft' : '';
    const prCommand = `gh pr create --title "${title}" --body "${description}" --base develop ${draftFlag}`;
    
    console.log(chalk.yellow('Creating pull request...'));
    execCommand(prCommand);

    console.log(chalk.green('✅ Pull request created!'));
    console.log(chalk.cyan('Automated workflow will now:'));
    console.log(chalk.cyan('  1. Run validation checks'));
    console.log(chalk.cyan('  2. Request Claude review'));
    console.log(chalk.cyan('  3. Auto-merge if all checks pass'));
  });

// Complete workflow (feature + commit + PR)
program
  .command('flow')
  .description('Complete git flow: create feature, commit, and PR in one command')
  .argument('<feature-name>', 'Name of the feature')
  .argument('<commit-message>', 'Initial commit message')
  .option('-t, --type <type>', 'Commit type (feat, fix, docs, etc.)', 'feat')
  .option('--draft', 'Create as draft PR')
  .action(async (featureName, commitMessage, options) => {
    if (!checkGitRepo()) return;

    const branchName = `feature/${featureName}`;
    
    console.log(chalk.blue(`🚀 Starting complete git flow for: ${branchName}`));
    console.log(chalk.cyan('This will: create branch → commit changes → create PR'));

    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with complete workflow?',
      default: true
    }]);

    if (!confirm) {
      console.log(chalk.yellow('Workflow cancelled'));
      return;
    }

    try {
      // 1. Create feature branch
      console.log(chalk.yellow('\n📝 Step 1: Creating feature branch...'));
      execCommand('git checkout develop');
      execCommand('git pull origin develop');
      
      if (!branchExists(branchName)) {
        execCommand(`git checkout -b ${branchName}`);
        execCommand(`git push -u origin ${branchName}`);
      } else {
        execCommand(`git checkout ${branchName}`);
      }

      // 2. Commit changes (if any exist)
      console.log(chalk.yellow('\n💾 Step 2: Committing changes...'));
      if (hasUncommittedChanges()) {
        const fullCommitMessage = commitMessage.startsWith(`${options.type}:`) ? 
          commitMessage : 
          `${options.type}: ${commitMessage}`;
        
        execCommand('npm run lint');
        execCommand('npm test');
        execCommand('git add .');
        execCommand(`git commit -m "${fullCommitMessage}"`);
        execCommand(`git push origin ${branchName}`);
      } else {
        // Create empty commit to start the branch
        execCommand(`git commit --allow-empty -m "${options.type}: ${commitMessage}"`);
        execCommand(`git push origin ${branchName}`);
      }

      // 3. Create PR
      console.log(chalk.yellow('\n🔄 Step 3: Creating pull request...'));
      const title = featureName.replace('-', ' ');
      const description = `
## Summary
${commitMessage}

## Changes
- Initial implementation of ${featureName}

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated

🤖 Generated with Code Directives SDK
`;

      const draftFlag = options.draft ? '--draft' : '';
      execCommand(`gh pr create --title "${title}" --body "${description}" --base develop ${draftFlag}`);

      console.log(chalk.green('\n✅ Complete git workflow finished!'));
      console.log(chalk.cyan('🎉 Your feature is now ready for automated review and merge!'));
      
    } catch (error) {
      console.error(chalk.red('\n❌ Workflow failed:'), error.message);
      console.log(chalk.yellow('You may need to fix issues manually and continue.'));
    }
  });

// Sync workflow (pull latest changes)
program
  .command('sync')
  .description('Sync current branch with latest develop changes')
  .action(() => {
    if (!checkGitRepo()) return;

    const currentBranch = getCurrentBranch();
    
    console.log(chalk.yellow('Syncing with develop branch...'));
    execCommand('git fetch origin');
    execCommand('git checkout develop');
    execCommand('git pull origin develop');
    
    if (currentBranch && currentBranch !== 'develop') {
      execCommand(`git checkout ${currentBranch}`);
      execCommand(`git merge develop`);
      console.log(chalk.green(`✅ Synced ${currentBranch} with latest develop`));
    } else {
      console.log(chalk.green('✅ Develop branch synced'));
    }
  });

program
  .name('bp-git')
  .description('Git workflow automation for Code Directives')
  .version('1.0.0');

program.parse();