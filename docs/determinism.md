# Build determinism

This repository pins TypeScript, Prettier, and ESLint versions so that
formatting and compilation stay stable across machines.

## Three-identical-runs check

`scripts/verify-determinism.sh` performs three consecutive clean builds:

1. Delete every `dist/` directory under `packages/`.
2. Run `pnpm exec tsc -b` from the repository root (project references
   preserve dependency order).
3. Copy the full `packages/**/dist/**` file tree into a per-run folder.
4. `diff -r` the three snapshots; they must be identical.

If any step changes emitted JavaScript or declaration order, the diff fails.
Use this script before recording demos or publishing benchmark artifacts.

## Canonical bytes

Source files are normalized to LF line endings via Prettier (`endOfLine: lf`),
matching the Agent86 adapter policy of hashing canonical LF bytes.
