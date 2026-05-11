# Security Policy

## Supported versions

| Version | Supported              |
|---------|------------------------|
| 0.x     | Yes (early development) |

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Instead, report them privately via one of the following:

- **GitHub private vulnerability reporting**: Go to the [Security](https://github.com/chiba233/yume-dsl-codemirror/security/advisories/new) tab and click "Report a vulnerability".
- **Email**: Send details to the repository maintainer (see GitHub profile).

### What to include

1. Description of the vulnerability
2. Steps to reproduce
3. Affected version
4. Impact assessment (if known)

### What to expect

- Acknowledgment within **48 hours**
- Status update within **7 days**
- A fix or mitigation plan for confirmed vulnerabilities

## Scope

This policy covers `yume-dsl-codemirror`. It does **not** cover:

- Vulnerabilities in custom renderers or completion data supplied by applications
- Untrusted HTML returned by application code
- Denial of service via extremely large documents without application-level limits

## Known security considerations

- **Completion content**: Completion labels and info are provided by the application. Do not put untrusted HTML into
  custom completion UI without sanitizing it.
- **Highlight decorations**: Token content is not injected as HTML by this package; CodeMirror decorations only add
  style attributes.
- **Large inputs**: Tokenization currently sees the full document so multiline spans stay correct. Apply input size
  limits in untrusted environments.
