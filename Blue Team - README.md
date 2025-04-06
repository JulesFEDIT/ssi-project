# 🛡️ Final Project SSI 2025 — Blue Team

## 🎯 Project Title: Vulnerable & Secured Moodle Façade

A simulated version of the **Moodle platform**, built first with known web vulnerabilities (Phase 1), then gradually hardened with modern web security practices (Phase 2).

---

## 🌐 Phase 1 — Creation of the Vulnerable "Moodle Façade"

### 🧪 Objective
We decided to implement a **very basic website** that looks authentic but is **deliberately vulnerable**, to serve as a testing environment for exploitation and defense. The website is name **CyberGuard** and it is deployed with Netlify, you can access to it with the link in the repo description.

⚠️​We advise you not to refresh the website. It may leads to crash the website.⚠️​

### 🛠️ Tasks Breakdown

1. 🕷️ **Wesite development**
   - Developed very simple website about cybersecurity.
   - 3 main pages :
        - **Home page**: small presentation of the website
        - **Upload page**: page where the user is allowed to upload files with some security measures
        - **Login page**: authentication page with email address and password
    
   ![image](https://github.com/user-attachments/assets/be7529f3-fe32-49c2-8386-923346a1826a)

   *Home page screenshot*

   ![image](https://github.com/user-attachments/assets/4823154a-4718-4420-84d2-aefab5051aa1)

   *Upload page screenshot*
   
   ![image](https://github.com/user-attachments/assets/3ab85600-f3fb-4253-b4b2-3326737fe53a)
   
   *Login page screenshot*
2. 🔧 **Basic Backend Simulation**
   - Created a lightweight database with PhpMyAdmin
   - Implemented:
     - Rudimentary login system (no hashing, weak session handling).
     - Static calendar showing fixed events for all users.

3. 🚨 **Intentional Vulnerabilities**
   - Integrated common security flaws:
     - ✅ **XSS**: unsanitized input rendered directly in the DOM.
     - 🔓 **Insecure Authentication**: plaintext passwords, no rate limiting.
     - 🕳️ **Open Redirects**, lack of CSRF protection (optional).
     - 💬 No input validation or escaping.
       
---

## 🔒 Phase 2 — Securing the "Moodle Façade"

### 🧠 Objective
Identify and mitigate the flaws from Phase 1 by applying fundamental web security countermeasures.

### 🛠️ Tasks Breakdown

1. 🔍 **Security Analysis**
   - Reviewed source code and functionality from Phase 1.
   - Identified vulnerabilities:
     - Reflected XSS on login.
     - Stored XSS on calendar notes.
     - Weak authentication and session handling.

2. 🛡️ **Implemented Fixes**
   - ✅ Input validation (server and client-side).
   - ✅ Output escaping (HTML sanitization, templating with safe rendering).
   - ✅ Password hashing with `bcrypt` / `argon2`.
   - ✅ Rate limiting and session management (secure cookies, timeouts).
   - ✅ HTTPS enforced (if hosted).
   - ✅ Optional CSRF protection via tokens.

3. 🧪 **Security Testing**
   - Manual penetration tests to ensure XSS patches.
   - Password brute force mitigation.
   - Verified no user data was accessible between sessions.

4. 📚 **Security Documentation**
   - Listed each vulnerability → fix.
   - Detailed code snippets of countermeasures.
   - Provided a table of "Before" vs "After" behavior for each patch.

---
