# Kërçishta Garage - Quick Start Guide

## ✅ All Fixed! Your site is ready to run.

### What Was Fixed

1. ✅ **Blank Page Issue**: Added missing script tag to load React app
2. ✅ **Logo**: KC_garage.jpg now displays in navbar and footer
3. ✅ **Map**: Google Maps showing Neu-Ulm, Germany location
4. ✅ **Database**: Migration script created with sample data
5. ✅ **Build**: All errors fixed, builds successfully

---

## 🚀 Running Locally (3 Steps)

### 1. Start the Dev Server
```bash
npm run dev
```

### 2. Open Your Browser
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Password**: `otrotr`

### 3. You're Done!
The site should now load with:
- KC_garage.jpg logo in navbar/footer
- Google Map showing Neu-Ulm location
- Sample leads and service records in admin panel

---

## 📊 What's in the Database

The migration script (`npm run migrate`) created:

### **5 Sample Leads**
- 2 new leads
- 2 contacted leads
- 1 resolved lead

### **10 Service Records**
- Total Revenue: €6,929
- Total Cost: €3,145
- Total Profit: €3,784

You can view/manage these in the admin panel at `/admin`

---

## 🛠️ Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Re-run database migration (resets data)
npm run migrate
```

---

## 🔐 Admin Panel

**URL**: http://localhost:3000/admin
**Password**: `otrotr`

Features:
- View and manage customer leads
- Track service records
- See revenue/cost/profit stats
- Change lead status (New → Contacted → Resolved)

---

## 📁 Project Files

```
├── App.tsx              - Main React component
├── index.tsx            - React entry point
├── index.html           - HTML template (now loads index.tsx!)
├── public/              - Static files
│   └── KC_garage.jpg    - Your logo
├── api/                 - Backend API routes
│   ├── auth.ts          - Admin login
│   ├── leads.ts         - Lead management
│   └── records.ts       - Service records
├── scripts/
│   └── migrate.ts       - Database seeding script
├── .env                 - Your MongoDB credentials
└── vercel.json          - Deployment config
```

---

## 🌐 Deploy to Vercel

When ready to deploy:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `MONGODB_URI` = (your connection string)
   - `ADMIN_PASSWORD` = otrotr

See **DEPLOYMENT.md** for full instructions.

---

## 🐛 Troubleshooting

### Page is blank
- Make sure you ran `npm install`
- Check that `npm run dev` is running
- Open browser console (F12) to see errors

### API errors
- Verify `.env` file exists with correct MongoDB URI
- Check MongoDB Atlas allows connections from `0.0.0.0/0`
- Run `npm run migrate` to ensure database has data

### Build fails
- Make sure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules && npm install`

---

## 📞 Test Features

1. **Homepage** → Should show logo and services
2. **Booking Form** → Fill and submit (creates a lead)
3. **Map** → Should display Neu-Ulm, Germany
4. **Admin Panel** → Login with password `otrotr`
5. **Leads** → View your test submission
6. **Operations** → See sample service records
7. **Stats** → Revenue/cost/profit displayed

---

## ✨ Next Steps

1. Customize sample data in `scripts/migrate.ts`
2. Update phone number/address in `App.tsx` (line 413-417)
3. Adjust pricing in `PricingSection` component (line 548-554)
4. Deploy to Vercel when ready!

---

**Everything is working now! Just run `npm run dev` and visit http://localhost:3000** 🎉
