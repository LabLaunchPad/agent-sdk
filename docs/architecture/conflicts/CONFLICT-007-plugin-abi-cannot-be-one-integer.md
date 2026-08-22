# CONFLICT-007 — One `plugin_abi` integer cannot version eight plugin classes

**Tags:** `ABI-AFFECTING` `BLOCKING`
**Affected ADR:** ADR-004 (Plugin Architecture), ADR-080 (Versioning), ADR-044 (Plugin Lifecycle)

## Current Decision

ADR-004 defines eight plugin classes:

```
PURE  WASM  NATIVE  REMOTE  MCP  HTTP  A2A  EMBEDDED
```

ADR-080 requires that the plugin ABI use "an explicit compatibility version", given as
`plugin_abi: 1`.

## Observed Design

These eight classes share almost nothing at the binary or transport level:

- **WASM** — the Component Model and WIT interface types
- **NATIVE** — either a C ABI (`extern "C"` with `repr(C)` types) or a subprocess protocol
- **REMOTE / HTTP / MCP / A2A** — wire protocols with independent versioning already
- **PURE / EMBEDDED** — in-process Rust calls with no stable binary boundary at all

## Contradiction

A single integer cannot version eight independent contracts. Incrementing `plugin_abi` because
the WASM Component Model changed would invalidate every MCP plugin, which is unaffected;
declining to increment it leaves WASM plugins unversioned. The ADR requires one number to mean
eight things.

There is a **second and more serious problem** that ADR-004 does not address at all: dynamically
loading a NATIVE Rust plugin via `dlopen` is **unsound**. Rust has no stable ABI. A plugin
compiled with a different rustc version — or the same version with different flags — has
undefined memory layout for every non-`repr(C)` type. There is no diagnostic; it manifests as
memory corruption. Since ADR-004 names NATIVE as a first-class class without constraining it,
the natural implementation is unsafe by default.

## Security / Reliability / Compatibility Impact

**Security — high.** `dlopen` of Rust types is a memory-safety hole in a project whose core
crates otherwise `forbid(unsafe_code)`. A malicious or merely mismatched plugin achieves
arbitrary memory access.

**Reliability — high.** Layout mismatches produce silent corruption rather than clean failures.

**Compatibility — maximal for the manifest.** The manifest schema is the plugin ecosystem's
contract. Changing it after third-party plugins exist is the most expensive migration in the
system.

## Affected Schemas

- The plugin manifest (capabilities, permissions, limits, version, provenance, ABI fields)
- The capability request/response schema shared by all plugin classes

## Affected APIs / ABIs

- Every plugin class's transport binding
- The manifest's version field(s) — one integer versus several

## Affected Tests

- `plugin_with_incompatible_abi_is_rejected`
- `manifest_missing_required_permission_is_rejected`
- `native_plugin_loading_rejects_unsound_configurations`

## Downstream Dependencies

Phase 6 (plugin ecosystem) is built entirely on this. ADR-044's lifecycle
(discover → install → verify → grant → load → execute → monitor → update → rollback) and ADR-045's
registry both key off the manifest.

## Evidence

- **FACT** — Rust provides no stable ABI. The `repr(Rust)` layout is explicitly unspecified and
  may differ between compilations. <https://doc.rust-lang.org/reference/type-layout.html>
- **FACT** — The WASM Component Model versions interfaces through WIT, independently of any host
  numbering scheme. <https://component-model.bytecodealliance.org/>
- **FACT** — MCP carries its own protocol version negotiation.
  <https://modelcontextprotocol.io/specification>
- **FACT** — AgentScope treats MCP as an adapter into an internal tool abstraction rather than as
  its internal architecture, wrapping MCP results into its own response type.
  <https://doc.agentscope.io/tutorial/task_mcp.html>
- **INFERENCE** — The AgentScope evidence supports ADR-005's adapter posture generally, and by
  extension supports versioning the *internal* contract (manifest + capability request/response)
  separately from each external transport.

## Recommended Resolution

Narrow what `plugin_abi` versions, and constrain NATIVE. Proposed, not locked — see
[`../../adr/amendments/AMD-007-plugin-abi-scope.md`](../../adr/amendments/AMD-007-plugin-abi-scope.md).

1. **`plugin_abi: 1` versions exactly two things:** the manifest schema, and the capability
   request/response/error contract. These are genuinely common to all eight classes because they
   are *our* internal contract.
2. **Per-class transport bindings are separately versioned documents.** WASM binds via WIT; MCP
   negotiates its own version; HTTP/REMOTE/A2A version their own wire formats. The manifest
   records which binding a plugin uses and that binding's version, in its own field.
3. **NATIVE is constrained now, because it is manifest-affecting:** a NATIVE plugin is either a
   **subprocess communicating over IPC**, or a strict `extern "C"` boundary exchanging only
   `repr(C)` types. **`dlopen` of Rust types is prohibited.** This must be decided before the
   manifest schema is written, since it determines what fields a NATIVE plugin declares.

M0 defines only the manifest schema and the capability contract. No plugin class is implemented.

## Alternatives Considered

- **A separate ABI integer per class** (`wasm_abi`, `native_abi`, …). Rejected: most classes have
  an externally-owned version already; duplicating it invites drift between our number and theirs.
- **Collapse the eight classes.** Rejected: they are genuinely different, and the locked ADR
  enumerates them.
- **Allow `dlopen` with a rustc-version check.** Rejected: version equality is necessary but not
  sufficient (flags, features and codegen options also affect layout), and a check that is
  *nearly* right on a memory-safety boundary is worse than a prohibition.

## Migration Required

**Yes, and it is the most expensive kind, if deferred.** Once third-party plugins ship against a
manifest, changing it breaks an ecosystem rather than a codebase.

## Blocks Implementation

**Yes** for the manifest schema. The rest of the plugin system is Phase 6 and is not blocked, but
M0's capability crate defines the manifest type.
