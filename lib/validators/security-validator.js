const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

class SecurityValidator {
  constructor(config = {}) {
    this.config = {
      scanSecrets: true,
      vulnerabilityScan: true,
      allowedSecretPatterns: [],
      ...config.security
    };

    // Common patterns for secrets and sensitive data
    this.secretPatterns = [
      {
        name: 'API Key',
        pattern: /[A-Za-z0-9]{32,}/g,
        description: 'Potential API key or token'
      },
      {
        name: 'Password',
        pattern: /password\s*[:=]\s*['"][^'"]+['"]/gi,
        description: 'Hardcoded password'
      },
      {
        name: 'Private Key',
        pattern: /-----BEGIN (RSA )?PRIVATE KEY-----/g,
        description: 'Private key detected'
      },
      {
        name: 'AWS Access Key',
        pattern: /AKIA[0-9A-Z]{16}/g,
        description: 'AWS Access Key ID'
      },
      {
        name: 'AWS Secret Key',
        pattern: /[A-Za-z0-9/+=]{40}/g,
        description: 'AWS Secret Access Key'
      },
      {
        name: 'JWT Token',
        pattern: /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g,
        description: 'JSON Web Token'
      },
      {
        name: 'Database URL',
        pattern: /(mongodb|mysql|postgresql):\/\/[^\s]+/gi,
        description: 'Database connection string'
      }
    ];
  }

  // Main validation method
  async validate(projectPath, options = {}) {
    const results = {
      score: 100,
      issues: [],
      fixed: [],
      metrics: {
        filesScanned: 0,
        secretsFound: 0,
        vulnerabilities: 0,
        dependencyIssues: 0
      }
    };

    try {
      if (this.config.scanSecrets) {
        const secretResults = await this._scanSecrets(projectPath);
        results.issues.push(...secretResults.issues);
        results.metrics.secretsFound = secretResults.secretsFound;
        results.metrics.filesScanned = secretResults.filesScanned;
      }

      if (this.config.vulnerabilityScan) {
        const vulnResults = await this._scanVulnerabilities(projectPath);
        results.issues.push(...vulnResults.issues);
        results.metrics.vulnerabilities = vulnResults.vulnerabilities;
        results.metrics.dependencyIssues = vulnResults.dependencyIssues;
      }

      // Calculate security score
      results.score = this._calculateSecurityScore(results.metrics);

      return results;
    } catch (error) {
      return {
        score: 0,
        issues: [`Security validation failed: ${error.message}`],
        fixed: [],
        error
      };
    }
  }

  // Scan for hardcoded secrets and sensitive data
  async _scanSecrets(projectPath) {
    const results = {
      issues: [],
      secretsFound: 0,
      filesScanned: 0
    };

    // Find all files to scan (excluding common non-code files)
    const files = await this._findFilesToScan(projectPath);
    results.filesScanned = files.length;

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const fileIssues = this._scanFileForSecrets(file, content);
        results.issues.push(...fileIssues);
        results.secretsFound += fileIssues.length;
      } catch (error) {
        // Skip files that can't be read as text
        continue;
      }
    }

    return results;
  }

  // Scan individual file for secrets
  _scanFileForSecrets(filePath, content) {
    const issues = [];
    const lines = content.split('\n');

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;

      // Skip comments and test files
      if (this._isCommentLine(line) || this._isTestFile(filePath)) {
        continue;
      }

      // Check each secret pattern
      for (const secretPattern of this.secretPatterns) {
        const matches = line.match(secretPattern.pattern);
        if (matches) {
          // Check if this is an allowed pattern
          if (this._isAllowedSecret(line)) {
            continue;
          }

          issues.push({
            file: filePath,
            line: lineNumber,
            type: 'hardcoded-secret',
            severity: 'high',
            message: `${secretPattern.description}: ${matches[0].substring(0, 20)}...`,
            rule: 'no-hardcoded-secrets',
            secretType: secretPattern.name
          });
        }
      }
    }

    return issues;
  }

  // Scan for dependency vulnerabilities
  async _scanVulnerabilities(projectPath) {
    const results = {
      issues: [],
      vulnerabilities: 0,
      dependencyIssues: 0
    };

    // Check if package.json exists
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!(await fs.pathExists(packageJsonPath))) {
      return results;
    }

    try {
      // Run npm audit to check for vulnerabilities
      const auditOutput = execSync('npm audit --json --audit-level=moderate', {
        cwd: projectPath,
        encoding: 'utf8'
      });

      const auditData = JSON.parse(auditOutput);
      
      if (auditData.vulnerabilities) {
        for (const [packageName, vulnData] of Object.entries(auditData.vulnerabilities)) {
          results.vulnerabilities++;
          
          results.issues.push({
            file: packageJsonPath,
            line: 1,
            type: 'vulnerability',
            severity: vulnData.severity,
            message: `Vulnerability in ${packageName}: ${vulnData.title}`,
            rule: 'no-vulnerable-dependencies',
            packageName,
            via: vulnData.via
          });
        }
      }

    } catch (error) {
      // If npm audit fails, try to parse the error for vulnerability info
      if (error.stdout) {
        try {
          const auditData = JSON.parse(error.stdout);
          if (auditData.vulnerabilities) {
            results.vulnerabilities = Object.keys(auditData.vulnerabilities).length;
            results.dependencyIssues = results.vulnerabilities;
          }
        } catch (parseError) {
          // Ignore parsing errors
        }
      }
    }

    return results;
  }

  // Find files to scan for secrets
  async _findFilesToScan(projectPath) {
    const patterns = [
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
      '**/*.json',
      '**/*.yaml',
      '**/*.yml',
      '**/*.env*',
      '**/*.config.js',
      '**/.*rc'
    ];

    const ignore = [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.git/**',
      '**/*.min.js'
    ];

    let files = [];
    for (const pattern of patterns) {
      const found = glob.sync(path.join(projectPath, pattern), { ignore });
      files.push(...found);
    }

    return files;
  }

  // Check if line is a comment
  _isCommentLine(line) {
    const trimmed = line.trim();
    return trimmed.startsWith('//') || 
           trimmed.startsWith('/*') || 
           trimmed.startsWith('*') ||
           trimmed.startsWith('#');
  }

  // Check if file is a test file
  _isTestFile(filePath) {
    const fileName = path.basename(filePath);
    return fileName.includes('.test.') || 
           fileName.includes('.spec.') ||
           filePath.includes('/test/') ||
           filePath.includes('/tests/') ||
           filePath.includes('__tests__');
  }

  // Check if secret pattern is allowed
  _isAllowedSecret(line) {
    const trimmed = line.trim().toLowerCase();
    
    // Common allowed patterns
    const allowedPatterns = [
      'example',
      'placeholder',
      'dummy',
      'test',
      'sample',
      'your-api-key-here',
      'xxx',
      '123',
      'changeme',
      ...this.config.allowedSecretPatterns
    ];

    return allowedPatterns.some(pattern => 
      trimmed.includes(pattern.toLowerCase())
    );
  }

  // Calculate security score based on findings
  _calculateSecurityScore(metrics) {
    let score = 100;

    // Deduct points for secrets found
    score -= metrics.secretsFound * 15; // 15 points per secret

    // Deduct points for vulnerabilities
    score -= metrics.vulnerabilities * 10; // 10 points per vulnerability

    // Ensure score doesn't go below 0
    return Math.max(0, score);
  }
}

module.exports = SecurityValidator;