#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

cleanup() {
  rm -rf .determinism-run
}
trap cleanup EXIT

run_build() {
  find packages -type d -name dist -exec rm -rf {} + 2>/dev/null || true
  pnpm exec tsc -b
}

snapshot_tree() {
  local dest="$1"
  mkdir -p "$dest"
  while IFS= read -r -d '' f; do
    rel="${f#"$ROOT"/}"
    local out="$dest/$rel"
    mkdir -p "$(dirname "$out")"
    cp "$f" "$out"
  done < <(find packages -path '*/dist/*' -type f -print0 | sort -z)
}

for i in 1 2 3; do
  run_build
  snapshot_tree ".determinism-run/run$i"
done

diff -r .determinism-run/run1 .determinism-run/run2
diff -r .determinism-run/run2 .determinism-run/run3

echo "OK: three consecutive builds produced byte-identical dist trees."
