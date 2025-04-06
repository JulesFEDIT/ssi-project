# 🛡️ Final Project SSI 2025 — Blue Team (Phases 1 & 2)

## 🎯 Project Title: Vulnerable & Secured Moodle Façade

A simulated version of the **Moodle platform**, built first with known web vulnerabilities (Phase 1), then gradually hardened with modern web security practices (Phase 2).

---

## 🌐 Phase 1 — Creation of the Vulnerable "Moodle Façade"

### 🧪 Objective
Build a **simplified clone of Moodle** that looks authentic but is **deliberately vulnerable**, to serve as a testing environment for exploitation and defense.

### 🛠️ Tasks Breakdown

1. 🕷️ **Scraping Moodle**
   - Scraped HTML and CSS from existing Moodle platforms (login and calendar pages).
   - Tools used: `BeautifulSoup`, browser dev tools, manual inspection.

2. 🧱 **Frontend Reconstruction**
   - Rebuilt interface using HTML/CSS to mimic the original Moodle look.
   - Maintained minimalist JS logic to reflect user interactions.

3. 🔧 **Basic Backend Simulation**
   - Created a lightweight server in Python (Flask / PHP / Node).
   - Implemented:
     - Rudimentary login system (no hashing, weak session handling).
     - Static calendar showing fixed events for all users.

4. 🚨 **Intentional Vulnerabilities**
   - Integrated common security flaws:
     - ✅ **XSS**: unsanitized input rendered directly in the DOM.
     - 🔓 **Insecure Authentication**: plaintext passwords, no rate limiting.
     - 🕳️ **Open Redirects**, lack of CSRF protection (optional).
     - 💬 No input validation or escaping.

5. 📝 **Documentation**
   - Detailed the vulnerabilities introduced.
   - Explained purpose and location of each flaw in the codebase.

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
