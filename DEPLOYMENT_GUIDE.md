# 🚀 Vercel Deployment Guide - AgentRise Insurance Wallet

## Pre-Deployment Checklist

### 1. ✅ Local Build Verification
Ensure the app builds successfully locally:

```bash
# Install dependencies
npm install

# Run type check
npm run check

# Build for production
npm run build

# Verify the build output
ls -la dist/public
ls -la dist/index.js
```

### 2. ✅ Environment Variables
Set up required environment variables on Vercel:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/dbname
PGHOST=your-host.neon.tech
PGPORT=5432
PGUSER=neondb_owner
PGPASSWORD=your_password
PGDATABASE=neondb

# Application
NODE_ENV=production
APP_NAME=AgentRise
APP_URL=https://your-domain.vercel.app
SESSION_SECRET=generate-a-random-secret-key-here
```

## Deployment Steps

### Step 1: Connect GitHub to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the project

### Step 2: Configure Project Settings
1. **Framework**: Select "Other" (not a standard framework)
2. **Build Command**: `vite build && esbuild server/index-prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js`
3. **Output Directory**: `dist/public`
4. **Install Command**: `npm install`

### Step 3: Set Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add all variables from `.env.example`
3. Apply to Production, Preview, and Development

Example:
```
DATABASE_URL = postgresql://...
PGHOST = your-host.neon.tech
PGPORT = 5432
PGUSER = neondb_owner
PGPASSWORD = ***
PGDATABASE = neondb
NODE_ENV = production
SESSION_SECRET = ***
```

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will automatically:
   - Install dependencies
   - Run build command
   - Deploy to CDN
   - Enable automatic HTTPS
   - Create preview deployments for PRs

## Monitoring Deployment

### Build Logs
- Real-time logs available in Vercel dashboard
- Check for any esbuild or Vite errors
- Verify database connection on deploy

### Production Monitoring
- **Vercel Analytics**: Track performance metrics
- **Error Tracking**: Sentry integration (optional)
- **Database**: Monitor Neon PostgreSQL usage

## Database Setup on Neon

### 1. Create Neon Project
1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project (PostgreSQL)
3. Get connection string from "Connection Details"

### 2. Run Initial Migrations
After deployment, SSH into Vercel and run:

```bash
# This will push your Drizzle schema to the database
npm run db:push
```

Or use Vercel CLI locally:

```bash
vercel env pull .env.production.local
npm run db:push
```

## Troubleshooting

### Build Fails: "Cannot find module"
- Ensure all imports use correct aliases (@/, @shared)
- Check that all dependencies are in package.json
- Run `npm install` locally to test

### Database Connection Error
- Verify DATABASE_URL is correct
- Check Neon connection limits (not exceeded)
- Test connection string locally
- Ensure firewall allows Vercel IPs (Neon auto-allows)

### Static Assets Not Loading
- Verify dist/public directory contains files
- Check vite.config.ts build.outDir
- Ensure no .gitignore excludes dist/

### Blank Page on Load
- Check browser console for JavaScript errors
- Verify API routes are working: `https://your-domain.vercel.app/api/health`
- Check server logs in Vercel dashboard

## Performance Optimization

### 1. Enable Edge Caching
Static assets automatically cached globally via Vercel Edge Network.

### 2. Optimize Bundle Size
```bash
# Analyze bundle
npm run build

# Check for unused dependencies
npm ls --depth=0
```

### 3. Enable Compression
Vercel automatically enables gzip compression.

## Custom Domain Setup

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., insurance.example.com)
3. Update DNS records:
   - CNAME: `cname.vercel-dns.com`
   - Or use Vercel nameservers
4. Wait for DNS propagation (5-48 hours)

## Automatic Deployments

### Production (Main Branch)
- Auto-deploys on push to `main`
- Full build & test cycle
- Production environment

### Preview (Pull Requests)
- Auto-deploys for every PR
- Separate preview URL per PR
- Test before merging

### Rollback
1. Go to "Deployments" tab
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

## Updating After Deployment

### Code Changes
```bash
git push origin main  # Vercel auto-deploys
```

### Database Schema Changes
```bash
# Locally create migration
npm run db:generate

# Push to database
npm run db:push

# Commit and push
git add migrations/
git commit -m "db: update schema"
git push origin main
```

### Environment Variable Changes
1. Update variables in Vercel dashboard
2. Trigger redeployment: Click "Redeploy" on any deployment
3. No code changes needed

## Security Best Practices

### 1. Environment Secrets
- Never commit `.env` files
- Use Vercel environment variables for sensitive data
- Rotate secrets regularly

### 2. HTTPS
- Automatically enabled for all Vercel deployments
- HTTP → HTTPS redirect automatic

### 3. Rate Limiting
- Consider adding rate limiting middleware
- Prevent API abuse

### 4. CORS
- Configure CORS properly in production
- Only allow trusted origins

## Monitoring & Analytics

### Enable Vercel Analytics
1. Settings → Analytics
2. Enable "Web Vitals"
3. Track LCP, FID, CLS metrics

### Log Monitoring
```bash
# Tail production logs (requires Vercel CLI)
vercel logs --follow
```

## Cost Estimation

| Component | Cost | Notes |
|---|---|---|
| Vercel Hosting | Free | Unlimited bandwidth on Hobby plan |
| Neon PostgreSQL | Free | Up to 1GB storage & 3 compute hours/month |
| Custom Domain | Free | Domain purchased separately (~$10/year) |
| **Total** | **Free** | Generous free tier! |

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Express.js**: https://expressjs.com
- **Vite**: https://vitejs.dev
- **Drizzle ORM**: https://orm.drizzle.team

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables configured in Vercel
- [ ] Build command verified locally
- [ ] Database migrations ready
- [ ] Email/contact info updated
- [ ] Analytics enabled
- [ ] Custom domain configured
- [ ] SSL certificate issued
- [ ] Monitoring configured
- [ ] Backup strategy in place

---

**Deployed with ❤️ on Vercel** 🚀

Questions? Contact support or check logs in Vercel dashboard.
