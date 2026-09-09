# Domain layer

Pure, framework-free TypeScript. No React, no Supabase, no I/O.

Modules receive plain inputs (history, skill state, equipment, readiness) and
return plain outputs (plans, adjustments, diagnostics). This keeps the future
adaptive engine deterministic and testable.

| Module            | Responsibility (planned)                                   |
| ----------------- | ---------------------------------------------------------- |
| `training-engine` | Assemble a session from state, constraints and periodization |
| `progression`     | Decide load/volume/difficulty steps from performance history |
| `substitutions`   | Swap exercises based on equipment and environment            |
| `weak-points`     | Detect limiting qualities from performance patterns          |
| `coverage`        | Track movement-pattern and skill coverage over time          |
| `readiness`       | Convert recovery/sleep/soreness signals into a session cap   |

None of these are implemented yet — files are placeholders with contracts only.
