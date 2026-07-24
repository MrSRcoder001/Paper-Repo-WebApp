# 🎓 PaperVault AI - AI-Powered Previous Year Question Paper Platform

PaperVault AI is an enterprise-grade SaaS web application designed for college students, faculty members, and university administrators.

## 🚀 Key Features

1. **Landing Page**: Public hero section, live stats badges (2M+ Question Papers, 500K+ Students, 1200+ Colleges, 50+ Universities), subject cards, trusted universities bar, pricing, FAQ accordion, light & dark theme toggle.
2. **Home Dashboard**: Welcome header ("Hello, Satish 👋"), 4 quick AI action cards, AI recommendations widget, continue studying card, recent downloads, trending subjects, latest papers grid.
3. **Smart Search & Multi-Faceted Filters**: University, College, Branch, Semester, Subject, Exam Type, Year, filter tags strip, instant paper search results with preview & download triggers.
4. **Interactive Paper Viewer**: Embedded document canvas with thumbnail strip, exam questions rendering (Q1, Q2, Q3, Q4 with marks breakdown), metadata sidebar, AI Explain tool.
5. **AI Assistant (Chat)**: Academic RAG chat engine, prompt suggestion chips, structured markdown comparison tables (e.g. Stack vs Queue comparison table), voice assistant toggle.
6. **Analytics Dashboard**: 4 KPI cards, Question Frequency (Last 10 Years) bar chart, Difficulty Distribution Donut Chart (Easy 28%, Medium 46%, Hard 26%), Most Repeated Questions list, Subject Wise Trend line graph (2020-2024).
7. **Mobile Responsive UI**: Mobile floating bottom navigation bar (`Home`, `Search`, `AI Chat`, `Analytics`, `Upload`) and responsive drawer scaling seamlessly down to 360px.
8. **Upload Paper with OCR**: Drag & Drop file dropzone, OCR auto-extraction button with live text output preview, semester/subject classification.
9. **AI Study Planner**: Exam Date selector, subject picker, hours-per-day slider -> Generates day-by-day study roadmap timeline cards with checkmarks.
10. **Admin Dashboard**: Admin stats (Total Users: 125,430, Total Papers: 2,45,678, Total Colleges: 1,245, Reports: 432), 8 Navigation tabs, Recent Uploads moderation table with status badges (`Approved`, `Pending`) and Approve action controls.
11. **Command Palette (`Ctrl + K`)**: Global search palette for instant keyboard navigation across all features.

## 💻 Tech Stack
- **Frontend**: React 19, Vite, Lucide Icons, Custom Design Tokens & CSS
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer, REST API
- **AI & Analytics**: RAG Chat Simulation, OCR Text Parsing, Study Roadmap Generator, Trend Aggregations
- **Deployment & DevOps**: Docker, Docker Compose, GitHub Actions CI/CD Pipeline

## ⚡ Quick Start

### Run Backend API
```bash
cd BackEnd
npm install
npm run dev
```

### Run Frontend Web App
```bash
cd FrontEnd
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
