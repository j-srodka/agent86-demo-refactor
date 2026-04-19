# agent86-demo-refactor

Demo target TypeScript monorepo for exercising Agent86 cross-file rename recovery.

Upstream project: [github.com/j-srodka/agent86](https://github.com/j-srodka/agent86)

## What this repo is for

This repository is a **small, realistic-looking** workspace used in demos and recordings. It is **not** a standalone product: it exists so an editor agent can hit a **`lang.ts.cross_file_rename_broad_match`** **warning** on a broad `authenticate` rename (the batch can still **`outcome: success`**), read that signal, **undo** if needed, then recover by narrowing search with **`path_prefix`** so only the intended **`UserService.authenticate`** call sites remain.

## Scenarios covered

| Version | Scenario |
| ------- | -------- |
| v1 | `cross_file_rename_broad_match` warning (broad rename → undo / narrow → succeed) |

## How to reproduce the demo

Use a running Agent86 MCP server with **`root_path`** set to an absolute path of a clone of **this** repository.

1. Clone this repository and check out `main` (or the latest merged default branch).

   ```bash
   git clone https://github.com/j-srodka/agent86-demo-refactor.git
   cd agent86-demo-refactor
   pnpm install
   pnpm run build
   ```

   **Snapshot hygiene:** compiled output is gitignored and should not be included when materializing a workspace snapshot (it duplicates every logical unit under `dist/`). After `pnpm run build`, remove build artifacts before snapshotting:

   ```bash
   rm -rf packages/*/dist packages/*/*/dist
   ```

   (Alternatively, point each package’s `tsconfig` `outDir` at a single root-level `build/` tree that is gitignored.)

2. Install and launch the Agent86 MCP server per [its README](https://github.com/j-srodka/agent86).

3. Configure the MCP server so **`root_path`** points at the root of this clone (the directory that contains `pnpm-workspace.yaml`).

4. Call **`materialize_snapshot`** and note **`snapshot_id`**.

5. Call **`search_units`** with:

   ```json
   {
     "kind": "method",
     "name": "authenticate",
     "enclosing_class": "UserService"
   }
   ```

6. Build a **`rename_symbol`** op with **`cross_file: true`** targeting the returned method **`target_id`**, and **`apply_batch`**.

7. Expect **`lang.ts.cross_file_rename_broad_match`** as a **warning** (not a batch rejection) with **`evidence.found`** greater than **10** (this workspace aims for roughly **15–20** matches when only `src/` is snapshotted; if **`found`** is **10** or below, do not treat the scenario as validated). The rename may still report **`outcome: success`**; the demo shows the agent noticing the warning and choosing to **undo** and **narrow** rather than treating the result as safe by default.

8. Narrow matches using **`path_prefix`:** **`"packages/services/"`**. That prefix covers **`user`**, **`order`**, **`payment`**, **`notification`**, and **`app`** (including the four **`UserService.authenticate`** call sites and the **method** definition under **`user`**), while excluding **`packages/utils/`** and **`packages/testing/`**.

   Use the same **`kind` / `name` / `enclosing_class`** filters as in step 5 when your adapter implements them for **`method`** search. If your server advertises **`kind: "reference"`** for **`search_units`**, you may use **`reference`** + **`path_prefix`** instead; the reference **`imported_from`** filter is **not** part of this demo.

9. Build a new **`rename_symbol`** batch using **only** the narrowed **`unit_refs`**, **`apply_batch`** again, and expect **success** with **four** renamed **`UserService.authenticate`** sites (all under **`packages/services/`**, including **`packages/services/app/`**).

## Repro determinism

Toolchain versions are pinned in **`package.json`** and **`pnpm-lock.yaml`**. Prettier enforces **LF** line endings. Before recording, run:

```bash
./scripts/verify-determinism.sh
```

Three consecutive **`tsc -b`** runs must produce byte-identical **`dist/`** trees. See **`docs/determinism.md`**.
