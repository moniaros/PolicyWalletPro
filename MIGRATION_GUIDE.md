# PolicyWallet Migration Guide

## Complete Step-by-Step Migration to New Replit Account

### **BEFORE MIGRATION: Create Backup**

```bash
chmod +x backup-export.sh
./backup-export.sh
```

This creates a backup directory with:
- ✅ All source code
- ✅ Database dump
- ✅ Environment variables
- ✅ Translation files
- ✅ Restoration instructions

Download the `backup-[timestamp].tar.gz` file to your local machine.

---

## **PHASE 1: TRANSFER VIA REPLIT TEAM WORKSPACE**

### Step 1.1: Move Current App to Team Workspace
1. Log into your **current Replit account**
2. Open the **PolicyWallet** project
3. Click **Settings** (gear icon, top right)
4. Find **Organization** section
5. Click **"Transfer to a team"**
6. Choose **"Create new team"** or select existing team
7. Confirm the transfer
   - ✅ URLs remain active
   - ✅ Database stays connected
   - ✅ All code/secrets transfer

### Step 1.2: Invite New User to Team
1. In team workspace, click **Members** (left sidebar)
2. Click **"Invite member"**
3. Enter email of the **new Replit account owner**
4. Set role to **"Admin"**
5. New user accepts invite via email link
6. Click **"Join team"** in their Replit account

### Step 1.3: Transfer Ownership
1. In team workspace, select **PolicyWallet** project
2. Click **Settings** → **Organization**
3. Click **"Change owner"**
4. Select the **new team member**
5. Confirm transfer
   - The new user is now the owner in team workspace

### Step 1.4: Move to New Owner's Personal Account
1. **New owner** logs into their Replit account
2. Navigate to the **team workspace** → **PolicyWallet**
3. Click **Settings** → **Organization**
4. Click **"Transfer to personal workspace"**
5. Confirm transfer
   - ✅ App is now in new account's personal workspace
   - ✅ All code/database/secrets remain intact

---

## **PHASE 2: VERIFY EVERYTHING WORKS**

### Step 2.1: Verify in New Account
```bash
# Should start with no errors
npm run dev
```

Check:
- [ ] Frontend loads at http://localhost:5000
- [ ] No dependency errors
- [ ] No database connection errors

### Step 2.2: Verify Database
```bash
# In browser console or backend logs
# Should see PostgreSQL connected
```

Check:
- [ ] Login/signup works
- [ ] Database queries execute
- [ ] Policies load from database

### Step 2.3: Verify Secrets & Environment
1. In new account, click **Secrets** (lock icon)
2. Verify all present:
   - ✅ DATABASE_URL
   - ✅ PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT
3. If missing, copy from old account

### Step 2.4: Verify Translations
1. Load dashboard
2. Switch language Greek ↔ English
3. Check:
   - [ ] All text is translated (no English mixed in Greek, or vice versa)
   - [ ] Special characters (€, ü, etc.) render correctly

---

## **PHASE 3: CLEANUP & FINALIZATION**

### Step 3.1: Old Account Cleanup
1. In **original Replit account**, keep team workspace OR delete if no longer needed
2. Note: Original deployment URL may still resolve (can be disabled in settings)

### Step 3.2: Update Custom Domain (if applicable)
If you have a custom domain:
1. In **new Replit account**, open deployed project
2. Get the new **deployment URL**
3. Update DNS records to point to new URL
4. Test: Visit custom domain to verify

### Step 3.3: Test Full User Flow
1. Open new account's live app
2. Test complete flow:
   - [ ] Visit landing (login page)
   - [ ] Create new account
   - [ ] Complete onboarding
   - [ ] Access dashboard
   - [ ] Upload policy
   - [ ] Check translations
   - [ ] Contact agent links work

---

## **PHASE 4: DATABASE RESTORATION (If Direct Transfer Failed)**

If the database didn't transfer automatically:

### Option A: From Backup File
```bash
# Extract backup
tar -xzf backup-YYYYMMDD-HHMMSS.tar.gz
cd backup-YYYYMMDD-HHMMSS

# Restore database
PGPASSWORD=$PGPASSWORD pg_restore \
  -h $PGHOST \
  -U $PGUSER \
  -d $PGDATABASE \
  database/policywallet-db.dump
```

### Option B: Copy Database Using Replit UI
1. In original account, open **Database** panel
2. Export data
3. In new account, open **Database** panel
4. Import data

---

## **TROUBLESHOOTING**

### Problem: "Database connection failed"
**Solution:**
1. Check DATABASE_URL is set in Secrets
2. Verify PGHOST, PGUSER, PGPASSWORD match
3. Test connection:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

### Problem: "npm install fails"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Translations not showing"
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server (npm run dev)
3. Verify `client/src/lib/locales/` exists with en.json and el.json

### Problem: "Old account still has deployment"
**Solution:**
1. In old account, open Settings
2. Click **Deployment** → **Unpublish** (if you want to disable it)
3. OR leave it for fallback access

---

## **ROLLBACK PLAN (If Something Goes Wrong)**

If you need to rollback:

### Option 1: Use Replit Checkpoints
1. In new account, click **History** (left sidebar)
2. Find checkpoint before migration
3. Click **Restore** → **Restore snapshot**
4. Your account reverts to that state

### Option 2: Restore from Backup File
```bash
# Extract backup
tar -xzf backup-YYYYMMDD-HHMMSS.tar.gz

# Copy source back
cp -r backup-YYYYMMDD-HHMMSS/source/* .

# Restore database
./backup-export.sh  # (follow restore instructions in manifest)
```

---

## **CHECKLIST: COMPLETE MIGRATION**

### Before Migration
- [ ] Run `./backup-export.sh`
- [ ] Download backup archive
- [ ] Save DATABASE_URL somewhere safe

### Transfer Phase
- [ ] Create team workspace
- [ ] Add new user to team
- [ ] Transfer ownership in team
- [ ] Move to new user's personal account

### Verification Phase
- [ ] npm run dev works
- [ ] Database connected
- [ ] Secrets populated
- [ ] Translations working
- [ ] Full user flow tested

### Finalization
- [ ] Old account cleaned up
- [ ] Custom domain updated (if applicable)
- [ ] Live app tested end-to-end
- [ ] Team workspace deleted (if not needed)

---

## **SUPPORT**

If migration fails:
1. Check Replit status page for outages
2. Use Replit checkpoints to rollback
3. Contact Replit support with error messages
4. Alternative: Restore from backup file to new account manually

---

**Migration Date:** ________________
**Old Account:** ________________
**New Account:** ________________
**Status:** ✅ Complete / ⏳ In Progress / ❌ Needs Attention
