# Data access layer

The only place that talks to Supabase. UI and domain code import from here,
never from the Supabase client directly.

- `mock/` — temporary fixtures used by the shell until real tables exist.
- `*.functions.ts` — server functions for reads/writes (added later).
