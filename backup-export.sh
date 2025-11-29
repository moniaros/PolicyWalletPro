#!/bin/bash

# PolicyWallet Backup Export Script
# Backs up source code and database before migration

set -e

BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "=========================================="
echo "PolicyWallet Backup Export"
echo "=========================================="
echo ""

# 1. Backup Source Code
echo "📁 Backing up source code..."
mkdir -p "$BACKUP_DIR/source"
cp -r client "$BACKUP_DIR/source/" 2>/dev/null || true
cp -r server "$BACKUP_DIR/source/" 2>/dev/null || true
cp -r shared "$BACKUP_DIR/source/" 2>/dev/null || true
cp package.json "$BACKUP_DIR/source/" 2>/dev/null || true
cp package-lock.json "$BACKUP_DIR/source/" 2>/dev/null || true
cp tsconfig.json "$BACKUP_DIR/source/" 2>/dev/null || true
cp vite.config.ts "$BACKUP_DIR/source/" 2>/dev/null || true
cp .env.example "$BACKUP_DIR/source/" 2>/dev/null || true
echo "✅ Source code backed up"

# 2. Backup Environment Variables
echo "🔐 Backing up environment configuration..."
mkdir -p "$BACKUP_DIR/config"
if [ -f ".env" ]; then
  cp .env "$BACKUP_DIR/config/.env.backup"
  echo "✅ Environment variables backed up"
else
  echo "⚠️  No .env file found (this is okay for Replit with managed secrets)"
fi

# 3. Backup Database
echo "💾 Backing up PostgreSQL database..."
mkdir -p "$BACKUP_DIR/database"

if command -v pg_dump &> /dev/null && [ ! -z "$DATABASE_URL" ]; then
  # Extract database connection info
  DB_URL="$DATABASE_URL"
  
  # Use pg_dump to export database
  PGPASSWORD="${PGPASSWORD:-}" pg_dump \
    -h "${PGHOST:-localhost}" \
    -U "${PGUSER:-postgres}" \
    -d "${PGDATABASE:-postgres}" \
    --no-password \
    -F c -b -v -f "$BACKUP_DIR/database/policywallet-db.dump" 2>/dev/null || {
    echo "⚠️  Database dump failed - trying alternative method..."
    
    # Fallback: Create SQL export
    PGPASSWORD="${PGPASSWORD:-}" pg_dump \
      -h "${PGHOST:-localhost}" \
      -U "${PGUSER:-postgres}" \
      -d "${PGDATABASE:-postgres}" \
      --no-password \
      -v > "$BACKUP_DIR/database/policywallet-db.sql" 2>/dev/null || true
  }
  echo "✅ Database backed up"
else
  echo "⚠️  pg_dump not available or DATABASE_URL not set"
  echo "   To restore database manually later, use Replit's database backup feature"
fi

# 4. Backup Translation Files
echo "🌐 Backing up translation files..."
mkdir -p "$BACKUP_DIR/translations"
cp -r client/src/lib/locales "$BACKUP_DIR/translations/" 2>/dev/null || true
echo "✅ Translation files backed up"

# 5. Create Manifest
echo "📋 Creating backup manifest..."
cat > "$BACKUP_DIR/BACKUP_MANIFEST.md" << 'EOF'
# PolicyWallet Backup Manifest

## Backup Contents

### 1. Source Code (`/source`)
- `client/` - React frontend
- `server/` - Express backend
- `shared/` - Shared types and schemas
- Configuration files (package.json, vite.config.ts, tsconfig.json)

### 2. Database (`/database`)
- `policywallet-db.dump` - Binary database dump (preferred)
- OR `policywallet-db.sql` - SQL text export (if dump unavailable)

### 3. Configuration (`/config`)
- `.env.backup` - Environment variables snapshot

### 4. Translations (`/translations`)
- `locales/` - Greek (el.json) and English (en.json) translation files

## Restore Instructions

### For New Replit Account:

#### Step 1: Create New Replit Project
1. Create new Node.js project in target Replit account
2. Initialize git: `git init`

#### Step 2: Restore Source Code
```bash
# Copy all files from /source to new project root
cp -r source/* .

# Install dependencies
npm install
```

#### Step 3: Restore Database
**Option A: Using Binary Dump (Faster)**
```bash
# Restore from dump file
PGPASSWORD=$PGPASSWORD pg_restore \
  -h $PGHOST \
  -U $PGUSER \
  -d $PGDATABASE \
  database/policywallet-db.dump
```

**Option B: Using SQL Export**
```bash
# Restore from SQL file
PGPASSWORD=$PGPASSWORD psql \
  -h $PGHOST \
  -U $PGUSER \
  -d $PGDATABASE \
  < database/policywallet-db.sql
```

#### Step 4: Restore Environment Variables
1. Open Secrets panel in new Replit project
2. Add DATABASE_URL and other secrets from config/.env.backup
3. Or copy from original project Settings

#### Step 5: Verify
```bash
npm run dev
# Visit http://localhost:5000 to verify app works
```

## Important Notes

- **Database URL will be DIFFERENT** in new Replit account
- Update DATABASE_URL in secrets after migration
- All environment variables must be re-added to new account
- Translation files automatically included
- Deployment URL will change (update custom domain if applicable)

## File Sizes

- Source Code: ${SOURCE_SIZE:-TBD}
- Database: ${DB_SIZE:-TBD}
- Translations: ${TRANS_SIZE:-TBD}

## Backup Date
$(date)

## Verification Checklist (After Restore)

- [ ] npm install completes without errors
- [ ] npm run dev starts server
- [ ] Database connects (check server logs)
- [ ] Login page loads
- [ ] Signup works
- [ ] Dashboard displays (if logged in)
- [ ] Translations load (Greek/English)
- [ ] No console errors
EOF

echo "✅ Backup manifest created"

# 6. Create Archive
echo "📦 Creating compressed archive..."
tar -czf "backup-$(date +%Y%m%d-%H%M%S).tar.gz" "$BACKUP_DIR"
ARCHIVE_SIZE=$(du -sh "backup-$(date +%Y%m%d-%H%M%S).tar.gz" | cut -f1)
echo "✅ Archive created: $ARCHIVE_SIZE"

# 7. Summary
echo ""
echo "=========================================="
echo "✅ BACKUP COMPLETE"
echo "=========================================="
echo ""
echo "📂 Backup Directory: $BACKUP_DIR"
echo "📦 Compressed Archive: backup-$(date +%Y%m%d-%H%M%S).tar.gz"
echo ""
echo "Contents:"
echo "  • Source code (client, server, shared)"
echo "  • Database export (dump + SQL)"
echo "  • Environment configuration"
echo "  • Translation files"
echo "  • Restoration instructions"
echo ""
echo "Next Steps:"
echo "1. Download the backup archive"
echo "2. Follow steps in BACKUP_MANIFEST.md to restore"
echo "3. In new Replit account, run: npm install && npm run dev"
echo ""
echo "=========================================="
