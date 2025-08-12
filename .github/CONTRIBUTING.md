# Contributing to URL Builder App

Thank you for your interest in contributing! This guide will help you get started with development and contribution workflows.

## 🚀 Quick Start for Developers

### Prerequisites

- **Node.js**: `>=22.18.0` (we recommend using [mise](https://mise.jdx.dev/) for version management)
- **Zendesk CLI**: `@zendesk/zcli@^1.0.0-beta.51`
- **Zendesk Instance**: Access to a Zendesk instance for testing

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ibotta/url_builder_app.git
   cd url_builder_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Set up Zendesk CLI** (first time only)
   ```bash
   zcli auth:login
   # Follow prompts to authenticate with your Zendesk instance
   ```

## 🔄 Development Workflow

### Local Development with Live Reload

For the best development experience, use two terminal windows:

**Terminal 1 - Build watcher:**
```bash
npm run watch
```

**Terminal 2 - Local server:**
```bash
zcli apps:server dist
```

**Testing your changes:**
1. Navigate to any ticket in your Zendesk instance
2. Add `?zcli_apps=true` to the URL
3. Your local app will load instead of any installed version
4. Changes to CSS, JS, and HTML are automatically reloaded
5. For JSON configuration changes, restart the `zcli apps:server` command

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚢 Deployment

### Building and Packaging

```bash
# Build the app for production
npm run build

# Validate the built app
zcli apps:validate dist

# Package into a ZIP file
zcli apps:package dist
# Creates: dist/tmp/app-<timestamp>.zip
```

### First-Time Deployment

```bash
# Deploy to your Zendesk instance
zcli apps:create dist
```

### Updating Existing App

```bash
# Update an already deployed app
zcli apps:update dist
```

## 🐛 Reporting Issues

### Before Submitting

- **Search existing issues** in [GitHub Issues](https://github.com/ibotta/url_builder_app/issues)
- **Check if it's actually a bug** by testing in a clean environment

### Bug Report Template

When creating a bug report, include:

```markdown
**Environment:**
- Zendesk instance URL: 
- Browser: 
- App version: 

**Expected Behavior:**
A clear description of what you expected to happen.

**Actual Behavior:**
A clear description of what actually happened.

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Configuration:**
```json
[your URI templates configuration]
```

**Screenshots:**
If applicable, add screenshots to help explain the problem.
```

## 🔧 Pull Request Process

### Before Submitting

1. **Fork the repository** and create a feature branch
2. **Write or update tests** for your changes
3. **Run the test suite** and ensure all tests pass
4. **Test your changes** in a real Zendesk environment
5. **Update documentation** if needed

### Pull Request Guidelines

- **Target the correct repository**: `ibotta/url_builder_app` (not `zendesklabs/url_builder_app`)
- **Write clear commit messages** following conventional commit format
- **Include a detailed description** of what your changes do
- **Reference any related issues** using `Fixes #123` or `Closes #123`
- **Add screenshots** for UI changes

### Example PR Description

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally with `zcli apps:server`
- [ ] All tests pass (`npm test`)
- [ ] Tested in real Zendesk environment

## Screenshots
[If applicable]

Fixes #123
```

## 🏗️ Architecture Overview

### Project Structure

```
src/
├── javascripts/
│   ├── lib/           # Utilities and helpers
│   ├── locations/     # Location-specific code
│   └── modules/       # Core app modules
├── styles/            # CSS styles
├── templates/         # HTML templates
├── translations/      # i18n files
└── images/           # App assets

spec/                 # Test files
webpack/              # Build configuration
```

### Key Files

- **`src/javascripts/modules/app.js`** - Main application logic
- **`src/javascripts/modules/context.js`** - Data processing and template building
- **`src/templates/`** - HTML template functions
- **`src/translations/en.json`** - App metadata and translations

## 📚 Resources

### Zendesk Development

- [Zendesk CLI Documentation](https://developer.zendesk.com/documentation/apps/getting-started/using-zcli/)
- [Zendesk Apps Framework](https://developer.zendesk.com/documentation/apps/)
- [Zendesk API Reference](https://developer.zendesk.com/api-reference/)

### Development Tools

- [Node.js](https://nodejs.org/en/download)
- [mise](https://mise.jdx.dev/) - Runtime version manager
- [Jest](https://jestjs.io/) - Testing framework
- [Webpack](https://webpack.js.org/) - Module bundler

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](code_of_conduct.md). Please read it before contributing.

## ❓ Questions?

- **General questions**: Open a [Discussion](https://github.com/ibotta/url_builder_app/discussions)
- **Bug reports**: Create an [Issue](https://github.com/ibotta/url_builder_app/issues)
- **Feature requests**: Start with a Discussion, then create an Issue if there's positive feedback