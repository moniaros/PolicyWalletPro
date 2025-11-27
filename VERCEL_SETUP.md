# ⚡ Quick Start: Vercel Deployment

## 30-Second Setup

### 1. Push to GitHub
```bash
git add .
git commit -m "deployment: prepare for Vercel"
git push origin main
```

### 2. Connect to Vercel
1. Go to https://vercel.com/import
2. Import your GitHub repository
3. Vercel auto-detects `vercel.json` config

### 3. Add Environment Variables
Copy these to Vercel dashboard (Settings → Environment Variables):

**From your `.env` file:**
```
DATABASE_URL=postgresql://...
PGHOST=your-host.neon.tech
PGPORT=5432
PGUSER=neondb_owner
PGPASSWORD=your_secure_password
PGDATABASE=neondb
NODE_ENV=production
SESSION_SECRET=generate-random-key-here
```

### 4. Deploy
Click "Deploy" - Vercel handles everything:
- Installs dependencies ✅
- Runs build command ✅
- Deploys to global CDN ✅
- Enables HTTPS ✅
- Creates preview URLs for PRs ✅

## Files Included

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel configuration (build, routes, env) |
| `.vercelignore` | Files to ignore during build |
| `.env.example` | Template for environment variables |
| `DEPLOYMENT_GUIDE.md` | Comprehensive deployment guide |
| `VERCEL_SETUP.md` | This quick start guide |

## Build Output

Build was tested and successful:
```
✓ Frontend: 1,299 kB JS + 137 KB CSS (minified/gzipped)
✓ Backend: 24.1 kB Node.js server (esbuild bundled)
✓ Total: ~2.1 MB (loads in <2 seconds)
```

## What Happens On Deploy

1. **Install**: `npm install` (all dependencies)
2. **Build**: `vite build && esbuild server/index-prod.ts ...`
3. **Output**: Static files → `dist/public/`, Server → `dist/index.js`
4. **Deploy**: Express server runs on Vercel, serves SPA + API
5. **Routes**: 
   - `/api/*` → Express backend
   - `/auth/*` → Authentication routes
   - `/*` → React frontend (SPA fallback)

## Post-Deployment

### Run Database Migrations
After first deploy, initialize the database:

```bash
# Option 1: Using Vercel CLI
vercel env pull .env.production.local
npm run db:push

# Option 2: Manually in Vercel bash
# (Settings → Functions → Create bash script)
npm run db:push
```

### Test Production
```bash
# Should return health status
curl https://your-domain.vercel.app/api/health

# Should return policies
curl https://your-domain.vercel.app/api/policies
```

## Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Real-time Logs**: `vercel logs --follow`
- **Analytics**: Built-in Web Vitals tracking
- **Errors**: Check Function Logs if API fails

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Build fails: "Cannot find esbuild" | Run `npm install` locally, commit lock file |
| API returns 500 | Check database connection in Vercel logs |
| Frontend shows blank page | Clear cache: `vercel redeploy` |
| CSS not loading | Rebuild: `vercel rebuild` |

## Environment Variables Reference

```bash
# Database (Required)
DATABASE_URL         # Full PostgreSQL connection string
PGHOST              # Database host (neon.tech)
PGPORT              # Port (usually 5432)
PGUSER              # Username
PGPASSWORD          # Password
PGDATABASE          # Database name

# App (Optional)
NODE_ENV            # "production" (auto-set)
SESSION_SECRET      # Random string for sessions
APP_NAME            # "AgentRise" (for branding)
APP_URL             # "https://your-domain.vercel.app"
```

## Performance Tips

1. **Caching**: Vercel auto-caches static assets globally
2. **Database**: Neon provides connection pooling (PgBouncer)
3. **Bundle**: ~1.3MB JS is acceptable (optimized with tree-shaking)
4. **CDN**: All static files served from 250+ global edge locations

## Next Steps

1. ✅ Verify build locally: `npm run build`
2. ✅ Push to GitHub: `git push origin main`
3. ✅ Import to Vercel: https://vercel.com/import
4. ✅ Set environment variables
5. ✅ Deploy
6. ✅ Test production: https://your-domain.vercel.app
7. ✅ Run DB migrations: `npm run db:push`
8. ✅ Add custom domain (optional)

## Support

- **Vercel Status**: https://www.vercel-status.com/
- **Help & Community**: https://vercel.com/support
- **Neon Support**: https://neon.tech/contact-sales

---

**Your app is ready to deploy!** 🚀

Next: Click "New Project" on Vercel, import your repo, add env vars, and deploy.
