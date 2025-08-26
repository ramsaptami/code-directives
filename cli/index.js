#!/usr/bin/env node

// Best Practices SDK CLI Entry Point
const { Command } = require('commander');
const chalk = require('chalk');
const program = new Command();

// CLI version and description
program
  .name('bp')
  .description('Best Practices SDK - Automate code quality and development workflows')
  .version('1.0.0');

// Initialize new project command
program
  .command('init <project-name>')
  .description('Initialize a new project with best practices')
  .option('-t, --template <type>', 'Project template (web-app, api, library)', 'web-app')
  .option('--no-github', 'Skip GitHub repository creation')
  .option('--no-ci', 'Skip CI/CD setup')
  .action((projectName, options) => {
    console.log(chalk.blue('🚀 Initializing Best Practices SDK project...'));
    console.log(chalk.gray(`Project: ${projectName}`));
    console.log(chalk.gray(`Template: ${options.template}`));
    
    // Import and run initialization
    require('./bp-init')(projectName, options);
  });

// Validate project command  
program
  .command('validate')
  .description('Validate project against best practices standards')
  .option('-p, --path <path>', 'Project path to validate', './')
  .option('--fix', 'Automatically fix issues where possible')
  .option('--report', 'Generate validation report')
  .action((options) => {
    console.log(chalk.blue('🔍 Running validation checks...'));
    
    // Import and run validation
    require('./bp-validate')(options);
  });

// Audit project command
program
  .command('audit')
  .description('Generate comprehensive compliance audit report')
  .option('-o, --output <file>', 'Output file for audit report', 'audit-report.json')
  .action((options) => {
    console.log(chalk.blue('📊 Generating audit report...'));
    
    // Import and run audit
    require('./bp-audit')(options);
  });

// Setup CI command
program
  .command('setup-ci')
  .description('Setup CI/CD pipeline with GitHub Actions')
  .option('--platform <platform>', 'CI platform (github-actions, gitlab-ci)', 'github-actions')
  .action((options) => {
    console.log(chalk.blue('⚙️ Setting up CI/CD pipeline...'));
    
    // Import and run CI setup
    require('./bp-ci-setup')(options);
  });

// Error handling for unknown commands
program.on('command:*', () => {
  console.error(chalk.red('Invalid command: %s\nSee --help for a list of available commands.'), program.args.join(' '));
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}