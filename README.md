# OpenPave Skill Marketplace

The official skill marketplace for [PAVE](https://github.com/cnrai/openpave) - Personal AI Virtual Environment.

## Browse Skills

| Skill | Description | Category | Install |
|-------|-------------|----------|---------|
| [gmail](https://github.com/cnrai/openpave-gmail) | Read and manage Gmail messages | Communication | `pave install gmail` |
| [dropbox](https://github.com/cnrai/openpave-dropbox) | Access Dropbox files and Paper docs | Storage | `pave install dropbox` |
| [exa](https://github.com/cnrai/openpave-exa) | AI-powered web search | Search | `pave install exa` |

## Quick Start

```bash
# Install PAVE CLI
npm install -g @openpave/pave

# Search for skills
pave search email
pave search --all

# Install a skill
pave install gmail
pave install dropbox

# Run skill commands
pave run gmail list --max 5
pave run dropbox ls --summary
```

## Installing Skills

### From Marketplace (Recommended)

```bash
pave install <skill-name>
```

The CLI will automatically fetch the skill from the marketplace registry and clone it from GitHub.

### From GitHub

```bash
pave install owner/repo
pave install https://github.com/owner/repo
```

### From Local Path

```bash
pave install ./my-skill
pave install /path/to/skill
```

## Publishing Skills

Want to add your skill to the marketplace? Follow these steps:

### 1. Create Your Skill

Create a repository with the following structure:

```
my-skill/
├── skill.yaml      # Required: Skill manifest
├── index.js        # Required: Main entrypoint
├── README.md       # Recommended: Documentation
└── LICENSE         # Recommended: MIT or compatible
```

### 2. Skill Manifest (skill.yaml)

```yaml
name: my-skill
version: 1.0.0
description: Short description of your skill
entrypoint: index.js
pattern: sandbox

author:
  name: Your Name
  url: https://github.com/yourusername

license: MIT
repository: yourusername/openpave-my-skill

commands:
  - name: hello
    description: Say hello
    options:
      - --name <name>

category: other
keywords:
  - example
  - hello
```

### 3. Validate Your Skill

```bash
pave publish ./my-skill
```

This will validate your skill and show any errors to fix.

### 4. Submit a PR

1. Fork this repository
2. Add your skill entry to `registry.yaml`
3. Submit a Pull Request

Example entry:

```yaml
  my-skill:
    name: my-skill
    version: 1.0.0
    description: Short description of your skill
    author: yourusername
    repository: yourusername/openpave-my-skill
    category: other
    icon: "🔧"
    keywords:
      - example
    published: 2026-02-22T00:00:00Z
```

## Categories

| Category | Description |
|----------|-------------|
| `communication` | Email, messaging, notifications |
| `storage` | File storage, cloud drives |
| `search` | Web search, research tools |
| `productivity` | Calendar, tasks, notes |
| `development` | Code, git, CI/CD tools |
| `other` | Everything else |

## Requirements

Skills must meet these requirements to be listed:

- [ ] Valid `skill.yaml` with all required fields
- [ ] Public GitHub repository
- [ ] Working installation: `pave install owner/repo`
- [ ] At least one documented command
- [ ] No malicious code or security issues
- [ ] MIT or compatible open source license (recommended)

## API

The registry is available as a YAML file:

```
https://raw.githubusercontent.com/cnrai/openpave-marketplace/main/registry.yaml
```

### Endpoints

| URL | Description |
|-----|-------------|
| `/registry.yaml` | Full skill registry |
| `/skills/<name>.yaml` | Individual skill metadata (cached) |

### Cache

The PAVE CLI caches the registry locally for 1 hour:

```
~/.pave/cache/registry.yaml
```

To force refresh:

```bash
pave search --all --force
```

## Contributing

We welcome contributions! Please:

1. Test your skill locally before submitting
2. Follow the skill manifest format
3. Provide clear documentation
4. Be responsive to review feedback

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- [PAVE Documentation](https://github.com/cnrai/openpave)
- [Skill Development Guide](https://github.com/cnrai/openpave/blob/main/src/packages/pave/MARKETPLACE.md)
- [Report Issues](https://github.com/cnrai/openpave-marketplace/issues)
