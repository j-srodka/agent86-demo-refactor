# Security

This repository is a **demonstration and fixture** for Agent86 rename scenarios. It is **not** a production service or security reference implementation.

## Not real cryptography or authentication

- **`packages/utils/crypto`** — Webhook-style helpers are **intentionally incomplete** (for example, checking signature string shape only, not verifying HMAC). **Do not** copy this code into production.
- **`packages/utils/auth`** — Bearer parsing accepts tokens **without** cryptographic verification of JWTs. **Do not** use as a real auth boundary.

## Secrets and credentials

Hard-coded or placeholder values in services (for example smoke checks in `packages/services/app`) are **non-production** fixtures for the demo workspace only.

## Production stack

For the Agent86 reference implementation and MCP server, see [github.com/j-srodka/agent86](https://github.com/j-srodka/agent86).
