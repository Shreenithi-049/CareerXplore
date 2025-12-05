# Live Internship API Setup Guide

## 🚀 Real API Integration Complete!

The career recommendation app now supports **live internship data** from multiple sources:

### **Implemented Sources:**

1. **Real Job APIs:**
   - Adzuna API (Free tier: 1000 calls/month)
   - JSearch API via RapidAPI (Free tier: 150 calls/month)

2. **Web Scraping (Simulated):**
   - Internshala (Indian internships)
   - Naukri.com (Professional jobs)

3. **Fallback System:**
   - Mock data as backup when APIs fail

---

## **Setup Instructions:**

### **1. Get API Keys:**

#### **Adzuna API:**
1. Visit: https://developer.adzuna.com/
2. Sign up for free account
3. Get your `app_id` and `app_key`
4. Free tier: 1000 calls/month

#### **JSearch API (RapidAPI):**
1. Visit: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/
2. Subscribe to free plan
3. Get your `X-RapidAPI-Key`
4. Free tier: 150 calls/month

### **2. Configure API Keys:**

Edit `src/services/realInternshipAPI.js`:

```javascript
const API_CONFIG = {
  ADZUNA: {
    baseUrl: 'https://api.adzuna.com/v1/api/jobs',
    appId: 'YOUR_ADZUNA_APP_ID',     // Replace with your app_id
    appKey: 'YOUR_ADZUNA_APP_KEY',   // Replace with your app_key
    country: 'in'
  },
  
  JSEARCH: {
    baseUrl: 'https://jsearch.p.rapidapi.com',
    apiKey: 'YOUR_RAPIDAPI_KEY',     // Replace with your RapidAPI key
    host: 'jsearch.p.rapidapi.com'
  }
};
```

---

## **Features Implemented:**

### **✅ Multi-Source Data Aggregation:**
- Combines results from 3+ sources
- Removes duplicates automatically
- Fallback to mock data if APIs fail

### **✅ Smart Caching:**
- 5-minute cache for API calls
- 10-minute cache for web scraping
- Reduces API usage and improves performance

### **✅ Skill-Based Matching:**
- Extracts skills from job descriptions
- Calculates match percentages
- Prioritizes relevant internships

### **✅ Enhanced UI:**
- Loading indicators with source information
- Source attribution for each listing
- Match score badges
- Professional card design

### **✅ Real-time Features:**
- Pull-to-refresh functionality
- Live search across all sources
- Recommended vs All modes
- Apply button with external links

---

## **API Usage & Limits:**

| Source | Free Tier | Rate Limit | Coverage |
|--------|-----------|------------|----------|
| Adzuna | 1000/month | No limit | Global + India |
| JSearch | 150/month | 5/second | Global |
| Scraping | Unlimited | Custom | India-specific |
| Mock Data | Unlimited | None | Fallback |

---

## **Production Deployment:**

### **Backend Service Needed:**
For production web scraping, deploy a backend service:

```javascript
// Example Express.js endpoint
app.get('/api/scrape/internshala', async (req, res) => {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch();
  // Scraping logic here
  res.json(scrapedData);
});
```

### **Environment Variables:**
```bash
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
RAPIDAPI_KEY=your_rapidapi_key
```

---

## **Testing:**

1. **Without API Keys:** App works with mock data
2. **With API Keys:** Live data from multiple sources
3. **Network Issues:** Automatic fallback to cached/mock data

---

## **Next Steps:**

1. **Get API keys** from Adzuna and RapidAPI
2. **Replace placeholder keys** in `realInternshipAPI.js`
3. **Test live integration** with real data
4. **Deploy backend service** for production scraping
5. **Monitor API usage** and upgrade plans as needed

The app is now ready for **live internship data integration**! 🎉