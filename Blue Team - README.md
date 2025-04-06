# 🛡️ Final Project SSI 2025 — Blue Team

## 🎯 Project Title: Vulnerable & Secured Moodle Façade

A simulated version of the **Moodle platform**, built first with known web vulnerabilities, then gradually hardened with modern web security practices.

---

## 🌐 Phase 1 — Creation of the Vulnerable website

### 🧪 Objective
We decided to implement a **very basic website** that looks authentic but is **deliberately vulnerable**, to serve as a testing environment for exploitation and defense. The website is named **CyberGuard** and it is deployed with Netlify, you can access to it with the link in the repo description.

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
  
     ![image](https://github.com/user-attachments/assets/aebf6280-33aa-4d38-9081-955c5b5c14dd)

   *Structure of the users table screenshot*

   The users table is the unique table of our database.
   
   - Implemented:
     - Rudimentary login system.

3. 🚨 **Intentional Vulnerabilities**
   - Here are our 2 principals integrated common security flaws:
     - **Insecure Authentication**: inputs fields of the login page are security flaws for the website and the database if they are not well secur
     - **Upload files**: the upload functionnality represents a great opportunity for attackers to introduces viruses or malicious code into the website.
       
---

## 🔒 Phase 2 — Securing the website

### 🧠 Objective
Identify and mitigate the flaws from Phase 1 by applying fundamental web security countermeasures. Our strategy here is to 

### 🛠️ Tasks Breakdown

1. 🔍 **Security Analysis**
   
To resume there are two main vectors to exploit
   - Upload page
   - Login page
     
Identified vulnerabilities:
   - Upload page
      - **RCE - Remote Code Execution**: If the server accepts PHP, ASPX, JS or other executable files without blocking or disabling them, an attacker can upload a webshell and execute code remotely.
      - **Malware / Virus Upload**: A malicious user can host malicious files on your server and distribute them to other users
      - **XSS via files (Stored XSS)**: Some files can contain malicious JavaScript and lead to cookie theft and identity theft.
      - **Path Traversal**: If the upload allows the file name or destination path to be specified, an attacker can attempt to write outside the specified folder (../../../../etc/passwd).
      - **DoS attacks via large files**: Unlimited upload of very large files (>1GB, or zip bombs) can saturate disk space and crash the backend (memory resources exhausted)
      
   - Login page
      - **Injection SQL**: It can leads to login without password, data leakage or corruption.
      - **Unlocked brute-force**: There is no limit on attempts, no cooldown, no CAPTCHA.
      - **Too precised error message**: The error message reveals whether or not the user exists.

3. 🛡️ **Implemented Fixes**
   - Concerning the upload page we focuse 
4. 🧪 **Security Testing**
   - Manual penetration tests to ensure XSS patches.
   - Password brute force mitigation.
   - Verified no user data was accessible between sessions.

5. 📚 **Security Documentation**
   - Listed each vulnerability → fix.
   - Detailed code snippets of countermeasures.
   - Provided a table of "Before" vs "After" behavior for each patch.

---
