# Code Directives SDK

Automated best practices enforcement for development projects.

## Installation

```bash
# Global installation
npm install -g @company/code-directives

# Project-level installation
npm install --save-dev @company/code-directives
```

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
