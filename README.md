# Sticky Notes API

## Development setup

1. Install dependencies with `npm install`.
2. Generate a local development configuration with `npm run setup:dev`.
3. Make sure MongoDB is running. If it is not using the default local URL, update `DB_URI` in `.env.development`.
4. Start the server with `npm run start:dev`.

The setup command creates a random `JWT_SECRET` in `.env.development`. That file is local and ignored by Git; do not commit it.
