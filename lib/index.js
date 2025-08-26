// Best Practices SDK - Main Entry Point

const CodeValidator = require('./validators/code-validator');
const SecurityValidator = require('./validators/security-validator');
const PerformanceValidator = require('./validators/performance-validator');
const ClaudeIntegration = require('./integrations/claude-integration');
const CiIntegration = require('./integrations/ci-integration');

class BestPracticesSDK {
  constructor(config = {}) {
    this.config = config;
    
    // Initialize validators
    this.codeValidator = new CodeValidator(config);
    this.securityValidator = new SecurityValidator(config);
    this.performanceValidator = new PerformanceValidator(config);
    
    // Initialize integrations
    this.claudeIntegration = new ClaudeIntegration(config);
    this.ciIntegration = new CiIntegration(config);
  }

  // Initialize new project with best practices
  async init(options) {
    const { projectName, template = 'web-app', autoSetupCI = true } = options;
    
    console.log(`Initializing project: ${projectName}`);
    console.log(`Using template: ${template}`);
    
    try {
      // Create project structure
      await this._createProjectStructure(projectName, template);
      
      // Setup GitHub repository if requested
      if (options.github !== false) {
        await this._setupGitHubRepo(projectName);
      }
      
      // Setup CI/CD if requested
      if (autoSetupCI) {
        await this.ciIntegration.setupPipeline();
      }
      
      return {
        success: true,
        message: `Project ${projectName} initialized successfully`,
        path: `./${projectName}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to initialize project: ${error.message}`,
        error
      };
    }
  }

  // Validate project against standards
  async validate(options) {
    const { path = './', standards = ['code', 'security', 'performance'], autoFix = false } = options;
    
    console.log(`Validating project at: ${path}`);
    
    const results = {
      passed: true,
      issues: [],
      fixed: [],
      scores: {}
    };

    try {
      // Run code validation if requested
      if (standards.includes('code')) {
        const codeResults = await this.codeValidator.validate(path, { autoFix });
        results.scores.code = codeResults.score;
        if (codeResults.issues.length > 0) {
          results.passed = false;
          results.issues.push(...codeResults.issues);
        }
        if (codeResults.fixed.length > 0) {
          results.fixed.push(...codeResults.fixed);
        }
      }

      // Run security validation if requested
      if (standards.includes('security')) {
        const securityResults = await this.securityValidator.validate(path, { autoFix });
        results.scores.security = securityResults.score;
        if (securityResults.issues.length > 0) {
          results.passed = false;
          results.issues.push(...securityResults.issues);
        }
      }

      // Run performance validation if requested
      if (standards.includes('performance')) {
        const perfResults = await this.performanceValidator.validate(path, { autoFix });
        results.scores.performance = perfResults.score;
        if (perfResults.issues.length > 0) {
          results.passed = false;
          results.issues.push(...perfResults.issues);
        }
      }

      // Calculate overall score
      const scoreValues = Object.values(results.scores);
      results.overallScore = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;

      return results;
    } catch (error) {
      return {
        passed: false,
        error: error.message,
        issues: [`Validation failed: ${error.message}`]
      };
    }
  }

  // Generate documentation with diagrams
  async generateDocs(options) {
    const { source = './src', output = './docs', includeDiagrams = true } = options;
    
    console.log(`Generating documentation from ${source} to ${output}`);
    
    try {
      // Create docs directory if it doesn't exist
      const fs = require('fs-extra');
      await fs.ensureDir(output);
      
      // Generate API documentation
      await this._generateApiDocs(source, output);
      
      // Generate diagrams if requested
      if (includeDiagrams) {
        await this._generateDiagrams(source, output);
      }
      
      return {
        success: true,
        message: `Documentation generated successfully at ${output}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate documentation: ${error.message}`,
        error
      };
    }
  }

  // Private helper methods
  async _createProjectStructure(projectName, template) {
    const fs = require('fs-extra');
    const path = require('path');
    
    // Create project directory
    const projectPath = `./${projectName}`;
    await fs.ensureDir(projectPath);
    
    // Copy template files
    const templatePath = path.join(__dirname, '../templates', template);
    if (await fs.pathExists(templatePath)) {
      await fs.copy(templatePath, projectPath);
    }
    
    // Create standard files
    await this._createStandardFiles(projectPath);
  }

  async _createStandardFiles(projectPath) {
    const fs = require('fs-extra');
    const path = require('path');
    
    // Create README.md
    const readmeContent = `# ${path.basename(projectPath)}
    
Project created with Best Practices SDK

## Getting Started
npm install
npm start

## Standards Enforced
- In-line comments for all important code
- Maximum 50 lines per function  
- 80% test coverage minimum
- Security scanning enabled
- Performance monitoring active
`;
    
    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
    
    // Create .bp-config.yml
    const configContent = `version: "1.0.0"
project:
  name: "${path.basename(projectPath)}"
  type: "web-app"

standards:
  code:
    enforceComments: true
    maxFunctionLines: 50
    testCoverage: 80
  
  security:
    scanSecrets: true
    vulnerabilityScan: true
  
  performance:
    bundleSize: "500KB"
    loadTime: "2s"

automation:
  github:
    autoPR: true
    claudeReview: true
    autoMerge: true
`;
    
    await fs.writeFile(path.join(projectPath, '.bp-config.yml'), configContent);
  }

  async _setupGitHubRepo(projectName) {
    // This would integrate with GitHub API to create repository
    console.log(`Setting up GitHub repository for ${projectName}`);
    // Implementation would go here
  }

  async _generateApiDocs(source, output) {
    // Generate API documentation from source code
    console.log(`Generating API docs from ${source}`);
    // Implementation would go here
  }

  async _generateDiagrams(source, output) {
    // Generate Mermaid diagrams based on code structure
    console.log(`Generating diagrams for ${source}`);
    // Implementation would go here
  }
}

module.exports = BestPracticesSDK;