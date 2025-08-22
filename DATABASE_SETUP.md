# Database Configuration Guide

## Current Setup

Your project now supports both local development database and remote Cloudflare D1 database in production.

## Environment Configuration

### For Local Development (current default)
In your `.env` file:
```
DATABASE_MODE=development
```

### For Production/Remote D1 Database
In your `.env` file:
```
DATABASE_MODE=production
```

## How It Works

1. **Development Mode (`DATABASE_MODE=development`)**:
   - Uses local SQLite database file from `.wrangler/state/v3/d1/`
   - Falls back to in-memory database if local file not found
   - Perfect for local development and testing

2. **Production Mode (`DATABASE_MODE=production`)**:
   - Uses remote Cloudflare D1 database
   - Requires proper D1 binding configuration in `wrangler.jsonc`
   - Automatically used when deployed to Cloudflare Pages

## Switching to Remote Database

### Step 1: Update Environment Variable
Change in your `.env` file:
```
DATABASE_MODE=production
```

### Step 2: Ensure D1 Database is Set Up
Your `wrangler.jsonc` already has the D1 configuration:
```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "cleanrecord-db",
    "database_id": "89ddfb9e-002b-4ea1-9bbc-8656b569a582",
    "migrations_dir": "drizzle/migrations"
  }
]
```

### Step 3: Apply Migrations to Remote Database
```bash
npx wrangler d1 migrations apply cleanrecord-db
```

### Step 4: Test the Application
```bash
npm run dev
```

## Troubleshooting

If you get database binding errors when using `DATABASE_MODE=production`:

1. **Check if database exists**:
   ```bash
   npx wrangler d1 list
   ```

2. **Verify database ID**:
   ```bash
   npx wrangler d1 info cleanrecord-db
   ```

3. **Apply migrations**:
   ```bash
   npx wrangler d1 migrations apply cleanrecord-db
   ```

4. **Test database connectivity**:
   ```bash
   npx wrangler d1 execute cleanrecord-db --command="SELECT name FROM sqlite_master WHERE type='table';"
   ```

## Deployment

When deploying to Cloudflare Pages, the system will automatically use the remote D1 database regardless of the `DATABASE_MODE` setting, as the binding will be available in the Cloudflare runtime environment.

## Current Database Status

- ✅ Local development database: Available
- ✅ Remote D1 database: Configured
- ✅ Automatic environment detection: Working
- ✅ Migrations support: Available

You can now switch between local and remote database simply by changing the `DATABASE_MODE` environment variable!
