# aura-app

## Dashboard chat

The Jotform agent embed is loaded on the dashboard. To enable authenticated user
identification, set `JOTFORM_AGENT_SECRET` to the agent's secret key in the
frontend server environment (for local development, use `.env.local` here).
Do not use a `NEXT_PUBLIC_` prefix; the secret must remain server-side. Without
this setting, the embed still loads but users are not identified to the agent.