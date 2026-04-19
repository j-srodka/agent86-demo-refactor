# agent86-demo-refactor

Demo target TypeScript monorepo for exercising Agent86 cross-file rename recovery.

Upstream project: [github.com/j-srodka/agent86](https://github.com/j-srodka/agent86)

## What this repo is for

This repository is a **small, realistic-looking** workspace used in demos and recordings. It is **not** a standalone product: it exists so an editor agent can trigger a **`lang.ts.cross_file_rename_broad_match`** rejection on a broad `authenticate` rename, then recover by narrowing search with **`path_prefix`** so only the intended **`UserService.authenticate`** call sites remain.

## Scenarios covered

| Version | Scenario |
| ------- | -------- |
| v1 | `cross_file_rename_broad_match` only (broad rename → narrow → succeed) |

## How to reproduce the demo

Use a running Agent86 MCP server with **`root_path`** set to an absolute path of a clone of **this** repository.

1. Clone this repository and check out `main` (or the latest merged default branch).

   ```bash
   git clone https://github.com/j-srodka/agent86-demo-refactor.git
   cd agent86-demo-refactor
   pnpm install
   pnpm run build
   ```

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

7. Expect **`lang.ts.cross_file_rename_broad_match`** with **`evidence.found`** greater than **10** (this workspace aims for roughly **15–20** matches; if **`found`** is **10** or below, do not treat the scenario as validated).

8. Narrow matches using **`path_prefix`** so **utils** and **testing** packages are excluded while **service** call sites and the **app** entry remain in scope. Because **`packages/app`** is not under **`packages/services/`**, run **`search_units`** twice and merge **`unit_refs`** (or use a host that unions results):

   - **`path_prefix`:** `"packages/services/"` — covers **`user`**, **`order`**, **`payment`**, **`notification`** (three **`.authenticate`** call sites on **`UserService`** plus the **method** definition under **`user`**).
   - **`path_prefix`:** `"packages/app/"` — covers the **fourth** **`UserService.authenticate`** call site in the application entry package.

   Use the same **`kind` / `name` / `enclosing_class`** filters as in step 5 when your adapter implements them for **`method`** search. If your server advertises **`kind: "reference"`** for **`search_units`**, you may use **`reference`** + **`path_prefix`** instead; the reference **`imported_from`** filter is **not** part of this demo.

9. Build a new **`rename_symbol`** batch using **only** the narrowed **`unit_refs`**, **`apply_batch`** again, and expect **success** with **four** renamed **`UserService.authenticate`** sites (three under **`packages/services/`** and one under **`packages/app/`**).

## Repro determinism

Toolchain versions are pinned in **`package.json`** and **`pnpm-lock.yaml`**. Prettier enforces **LF** line endings. Before recording, run:

```bash
./scripts/verify-determinism.sh
```

Three consecutive **`tsc -b`** runs must produce byte-identical **`dist/`** trees. See **`docs/determinism.md`**.
