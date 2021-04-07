# Setup

## Environment variables

to setup the project for development we need a couple of environment variables. Add a .env file to the base of the project in the .env file
add the following lines

### Plaid

Get your Plaid API keys from the dashboard: https://dashboard.plaid.com/account/keys

```
PLAID_CLIENT_ID=<insert_client_id>
PLAID_SECRET=<insert_secret>
PLAID_ENV=<insert_env>
```

- Use 'sandbox' to test with fake credentials in Plaid's Sandbox
- Use 'development' to test with real credentials while developing
- Use 'production' to go live with real users

```
PLAID_ENV=<insert_env>
```

PLAID_PRODUCTS is a comma-separated list of products to use when
initializing Link, e.g. PLAID_PRODUCTS=auth,transactions.
see https://plaid.com/docs/api/tokens/link-token-create-request-products for a complete list

```
PLAID_PRODUCTS=<insert_products>
```

### Database

Prisma will use this database link to generate a client and make migrations

```
DATABASE_URL=<database_url>
```

### Authentication

Authentication is handle via JWT this is the secret token and algorithmn that will be used to sign the token

```
APP_SECRET=<insert_app_secret>
DEFAULT_ALG=HS256
```
