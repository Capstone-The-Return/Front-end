# ✨ Front-end Setup & Team Workflow Guide

Welcome to the official **Front-end repository** of our Capstone team —  
clean code, smooth workflow, good vibes. 🚀

---

# 📦 Getting Started

## 1️⃣ Install NVM (Node Version Manager) – Windows

🔗 Download: https://github.com/coreybutler/nvm-windows/releases  
Download and install **nvm-setup.exe**

Run:
- nvm install latest

---

## 2️⃣ Clone & Run the Project

git clone https://github.com/Capstone-The-Return/Front-end.git  
cd Front-end/Electo_vite  
npm install  
npm install json-server --save-dev
npx json-server --watch db/db.json --port 4000
npm run dev  

🎉 App runs at: http://localhost:5173

---

## 3️⃣ Run via Docker (Cloud Environment)

-- Run docker ("Cloud")
install: https://docs.docker.com/desktop/setup/install/windows-install/

docker build -f Dockerfile.localdev -t frontend-dev .  
docker run -p 5173:5173 frontend-dev

---

# 🌿 Git Workflow Rules

## 🔀 Branching Rules
✔ Everyone works on their own branch  
❌ No direct commits to dev or main

---

## 🌱 Branch Naming Pattern

feature/[page-or-component]  
bugfix/[short-description]  
hotfix/[critical-fix]

Examples:  
- feature/login-page  
- feature/voting-dashboard  
- bugfix/navbar-overflow

---

# 📝 Commit Message Guidelines

Format:  
[USECASE-ID] - short description

Examples:  
UC-04 - Implement user registration form  
UC-12 - Fix sidebar hover effect  
UC-19 - Add dark mode toggle

Rules:  
✔ Must include Use Case ID  
✔ Keep messages short & meaningful  
✔ One commit = one logical change  
✔ No committing generated files  

---

# 📬 Pull Request Rules

✔ PRs must target dev  
✔ Include a clear summary  
✔ UI changes must include screenshots  
✔ Needs 1 approval  
✔ Always pull latest dev before creating PR

git pull origin dev

---

# 📁 Project Structure Guide

src/  
 ├─ components/  
 ├─ pages/  
 ├─ styles/  
 └─ utils/

🏗️ No new folders without team approval.

---

# 💬 Team Communication Rules

- Announce when starting a task  
- Share your branch when you push  
- Open PRs early  
- Ask for help when stuck  
- Respect feedback  

❤️ Open, kind, respectful communication — always.

---

# 🔄 Daily Developer Checklist

Before coding:  
git pull origin dev

Create your branch:  
git checkout -b feature/my-cool-feature

Workflow:  
Write code → Commit → Push  
Open PR → Request review  
Merge into dev after approval  

---

# 👥 About the Team

We are a passionate Capstone team building a clean, modern, and efficient election-related platform.

Values:  
✨ Collaboration  
✨ Clarity  
✨ Respect  
✨ Ownership  
✨ Learning  

We don’t just write code —  
we build, discuss, debate, learn, experiment, fail, improve, succeed… together.

---

# 🚀 Final Notes

Thank you for contributing to this project!  
Let’s keep the code clean, communication open, and collaboration smooth.
