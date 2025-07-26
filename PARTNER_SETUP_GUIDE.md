# 👥 PARTNER SETUP GUIDE - New UI Version

## 🚀 QUICK START

### **Step 1: Get Latest Code**
```bash
# Clone or pull latest changes
git clone https://github.com/Abhijeet-work-main/velmora.git
# OR if you already have the repo:
git pull origin main

# Navigate to project
cd velmora
```

### **Step 2: Install Dependencies** 
```bash
npm install
```

### **Step 3: Environment Setup**
```bash
# Copy environment template
cp config.example.env .env

# Add your API keys to .env file:
NEWS_API_KEY=9e7a78b06482478a90416aa9e6b61705
OPENWEATHER_API_KEY=923936663826c433aedbd3a77d7721fe
ALPHA_VANTAGE_API_KEY=0WUJUVGG9P5J9R9L
COINAPI_KEY=CG-bvtn12g3rGFTG5j3WFfoVEQV
AMAZON_API_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=real-time-amazon-data.p.rapidapi.com
```

### **Step 4: Start Development**
```bash
npm start
# Server will run on http://localhost:3000
```

## 🔄 RECOVERING YOUR STASHED CHANGES

### **If You Have Git Stash**
```bash
# Check what stashes you have
git stash list

# Apply your stashed changes (be careful of conflicts)
git stash pop

# OR apply specific stash
git stash apply stash@{0}
```

### **If You Have Backup Files**
1. **Compare your backup** with current implementation
2. **Identify unique features** you were working on
3. **Integrate incrementally** using the AI prompt guidelines

## 🎯 WHAT'S WORKING NOW

### **✅ Your Features Are Already Implemented!**

**Mood Playlist** 
- 8 mood options (happy, sad, energetic, chill, romantic, focused, party, nostalgic)
- Playlist generation with mock data
- Beautiful UI with mood selection buttons
- Ready for real API integration

**E-commerce**
- Product search functionality  
- RapidAPI integration for Amazon data
- Working backend route `/api/scrape/ecommerce`
- Results display in modern card layout

### **🔧 Ready for Enhancement**
Both features have **basic functionality** but are ready for your **advanced features**:
- Real music APIs (Spotify, YouTube)
- Price comparison across retailers
- User favorites and history
- Social sharing features

## 🤖 USING THE AI PROMPT

### **In Cursor IDE**
1. **Copy the AI_DEVELOPMENT_PROMPT.md** content
2. **Paste it in Cursor chat** before asking questions
3. **Reference specific sections** when asking for help

### **Example AI Conversations**
```
[Paste AI_DEVELOPMENT_PROMPT.md content]

Now help me enhance the mood playlist functionality to integrate with Spotify API while maintaining the existing UI structure.
```

## 📁 PROJECT STRUCTURE OVERVIEW

```
velmora/
├── public/
│   ├── index.html              # 🆕 NEW BEAUTIFUL UI
│   └── index-backup.html       # Old UI (backup)
├── routes/
│   ├── ecommerce.js           # ✅ Your e-commerce backend
│   ├── news.js                # News scraping routes  
│   ├── stocks.js              # Stock data routes
│   └── crypto.js              # Crypto data routes
├── simple-server.js           # 🚀 Production server
├── server.js                  # Full-stack server (optional)
├── .env                       # 🔑 API keys
├── AI_DEVELOPMENT_PROMPT.md   # 🤖 Your AI assistant guide
└── PARTNER_SETUP_GUIDE.md     # 📖 This file
```

## 🎨 KEY UI CHANGES

### **What Changed**
- **Complete visual redesign** with vibrant colors
- **Card-based layout** for all content
- **Smooth animations** and modern interactions
- **New sections** added (Profile, About Us, Reviews, Share)

### **What Stayed the Same**
- **All backend APIs** work exactly as before
- **Socket.IO communication** preserved
- **Functionality** is 100% maintained
- **Your features** are still there, just prettier!

## ⚠️ IMPORTANT NOTES

### **DO NOT**
- ❌ Modify the overall UI structure
- ❌ Change color scheme or animations  
- ❌ Break existing Socket.IO functionality
- ❌ Remove working features

### **DO**
- ✅ Enhance existing sections with new features
- ✅ Add backend functionality and APIs
- ✅ Improve user experience within current design
- ✅ Add database integration and authentication
- ✅ Test thoroughly before committing

## 🔗 USEFUL LINKS

- **Live Site**: https://velmora.onrender.com
- **Local Dev**: http://localhost:3000  
- **GitHub**: https://github.com/Abhijeet-work-main/velmora
- **API Documentation**: Coming soon...

## 🆘 NEED HELP?

### **Common Issues**
1. **Dependencies**: Run `npm install` again
2. **API Keys**: Check `.env` file configuration
3. **Port Issues**: Try different port: `PORT=3001 npm start`
4. **Git Conflicts**: Use `git status` to see conflicts

### **Contact**
- Ask in project chat
- Use the AI prompt for technical questions
- Check existing issues on GitHub

---

## 🎉 WELCOME TO THE NEW VELMORA!

**The UI is beautiful, everything works, and your features are ready for enhancement. Time to build something amazing! 🚀** 