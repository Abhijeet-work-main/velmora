# 🚀 Velmora Project - Partner Onboarding Guide

Welcome to the Velmora Advanced Web Scraping Platform! This guide will help you set up the project locally and start contributing.

## 📋 Prerequisites

Before starting, ensure you have the following installed on your laptop:

### 1. Install Node.js
- Download and install **Node.js v18 or later** from [nodejs.org](https://nodejs.org/)
- Verify installation by running in terminal/command prompt:
  ```bash
  node --version
  npm --version
  ```

### 2. Install Git
- Download and install **Git** from [git-scm.com](https://git-scm.com/)
- Verify installation:
  ```bash
  git --version
  ```

### 3. Install a Code Editor
- Recommended: **Visual Studio Code** from [code.visualstudio.com](https://code.visualstudio.com/)
- Alternative: WebStorm, Sublime Text, or any preferred editor

### 4. Create GitHub Account
- Sign up at [github.com](https://github.com/) if you don't have an account
- Ask the project owner to add you as a collaborator to the repository

## 🔧 Project Setup

### Step 1: Clone the Repository
1. Open terminal/command prompt
2. Navigate to your desired projects folder:
   ```bash
   cd Documents  # or wherever you want to store the project
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/[USERNAME]/velmora.git
   ```
4. Navigate into the project folder:
   ```bash
   cd velmora
   ```

### Step 2: Install Dependencies
Install all required packages:
```bash
npm install
```

**Note**: This might take a few minutes. Don't worry if it seems slow - Puppeteer downloads Chromium browser.

### Step 3: Set Up Environment Variables
1. Create a `.env` file in the project root:
   ```bash
   # On Windows
   type nul > .env
   
   # On Mac/Linux
   touch .env
   ```

2. Add the following API keys to your `.env` file:
   ```env
   # News API
   NEWS_API_KEY=9e7a78b06482478a90416aa9e6b61705
   
   # OpenWeather API
   OPENWEATHER_API_KEY=923936663826c433aedbd3a77d7721fe
   
   # Alpha Vantage (Stock Data)
   ALPHA_VANTAGE_API_KEY=0WUJUVGG9P5J9R9L
   
   # CoinGecko API
   COINGECKO_API_KEY=CG-bvtn12g3rGFTG5j3WFfoVEQV
   
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Server Configuration
   PORT=3000
   ```

**⚠️ Important**: Never commit the `.env` file to GitHub. It's already in `.gitignore`.

### Step 4: Test the Setup
1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. You should see the Velmora dashboard with a modern dark theme UI.

## 🧪 Testing the Features

### Test Global Search
1. Use the search bar in the top navigation
2. Search for terms like "messi", "AI", or "bitcoin"
3. Results should appear in the dashboard

### Test Individual Modules
- **News Scraper**: Navigate to the News section
- **Stock Tracker**: Check the Stock section
- **Crypto Monitor**: Test the Crypto section

## 🔄 Development Workflow

### Daily Workflow
1. **Pull latest changes** before starting work:
   ```bash
   git pull origin main
   ```

2. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and test them locally

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub for code review

### Branch Naming Convention
- Features: `feature/add-new-scraper`
- Bug fixes: `fix/search-results-display`
- Updates: `update/ui-improvements`

## 📁 Project Structure

```
velmora/
├── public/                 # Static files (CSS, JS, images)
├── server/                 # Backend server code
├── index.html             # Main HTML file
├── package.json           # Project dependencies
├── .env                   # Environment variables (don't commit)
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## 🛠️ Key Technologies

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Web Scraping**: Puppeteer
- **Real-time**: Socket.IO
- **APIs**: News API, OpenWeather, Alpha Vantage, CoinGecko
- **Database**: Supabase (PostgreSQL)

## 🐛 Common Issues & Solutions

### Issue 1: Port Already in Use
If you get "Port 3000 is already in use":
```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Issue 2: npm install Fails
- Try clearing npm cache:
  ```bash
  npm cache clean --force
  npm install
  ```

### Issue 3: API Keys Not Working
- Double-check your `.env` file formatting
- Ensure no extra spaces around the `=` sign
- Restart the server after changing `.env`

## 🤝 Getting Help

- **Code Issues**: Create an issue on GitHub
- **Questions**: Ask in the project group chat
- **Documentation**: Check the main README.md

## 📝 Next Steps

1. **Familiarize yourself** with the codebase
2. **Review existing issues** on GitHub
3. **Pick a small task** to start with
4. **Ask questions** - don't hesitate to reach out!

## 🎯 Development Tips

- Always test your changes locally before pushing
- Follow the existing code style and patterns
- Write clear commit messages
- Keep pull requests focused on one feature/fix
- Update documentation when adding new features

---

**Welcome to the team! Happy coding! 🚀** 