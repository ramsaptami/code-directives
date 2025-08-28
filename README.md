# Code Directives SDK

> **🚨 REPOSITORY DIRECTIVE: This package lives at `git@github.com:ramsaptami/code-directives.git`**  
> **All commits and changes MUST be made to the dedicated repository, not to tessellate!**

Automated best practices enforcement for development projects.

## Installation

```bash
# Global installation
npm install -g @ramsaptami/code-directives

# Project-level installation
npm install --save-dev @ramsaptami/code-directives
```

## Repository Information

- **Primary Repository**: `git@github.com:ramsaptami/code-directives.git`
- **Package Name**: `@ramsaptami/code-directives`
- **Development**: Always commit changes to the dedicated repository
- **Usage**: Install as dependency in other projects

## Features

- **Project Initialization**: Create new projects with best practices built-in
- **Code Validation**: Automated checking of code quality, security, and performance
- **Audit Reports**: Generate compliance reports in multiple formats
- **CI/CD Integration**: GitHub Actions workflows for automated enforcement
- **Documentation Generation**: Auto-generate project documentation

## Quick Start

```bash
# Initialize a new project
bp init my-project --template web-app

# Validate existing project
bp validate --fix

# Generate audit report
bp audit --output report.json
```

## Configuration

Projects use `.bp-config.yml` to customize standards and automation settings.

For detailed usage and API documentation, see [docs/](docs/).
