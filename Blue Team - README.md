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
   - Concerning the **upload page** we implemented the following security measures:
     
        - ​✅​**CAPTCHA system** : CAPTCHA prevents automated attacks, such as brute-force attempts or account enumeration, by forcing human interaction. It therefore strengthens the security of forms against malicious bots.
        - ✅​**File extension verification**: Checking the file extension during upload filters the authorised file types, reducing the risk of malicious code being executed or potentially dangerous files being uploaded. This helps protect the system against file injection attacks and RCE.
        - ✅​**File content scanner**: Scanning the contents of files can detect and block malicious software or dangerous scripts, strengthening security against attacks. This helps prevent the execution of unauthorised code and protect the integrity of data and systems.
        - ✅​**Size file limitation**: Limiting the size of uploaded files helps prevent Denial of Service (DDos) attacks by preventing large uploads that could exhaust server resources. It also helps to maintain storage efficiency and ensure optimum data management.
    
   - Concerning the **login page** we implemented the following security measures:
        - ✅**User input validation**: The email and password fields are marked as required, which ensures that the user cannot submit the form without filling them in. The email field uses the email type, which helps validate the format of the email address.
        - ✅**Error management**: The connection error message does not specify whether it is the email or the password that is incorrect. This does not give the attacker any clues about the existing users
        - ✅**Prepared request**: We use PDO (PHP Data Objects) with prepared queries to interact with the database. This helps prevent SQL injections by separating the SQL code from the data supplied by the user.
          
4. 🧪 **Security Testing**

**Upload file**

   - CAPTCHA system test
          
![image](https://github.com/user-attachments/assets/4fe3a2df-21d4-4ffa-a65b-8632e463e255)

If we don't verify the captcha we can't upload files, this security measure works.

   - File extension verification test

Only these exetensions are allowed : .pdf, .doc, .docx, .jpg, .png. We tried to upload the following php file :
![image](https://github.com/user-attachments/assets/0bae4551-599b-434d-9afb-147ebe7cb0c9)

![image](https://github.com/user-attachments/assets/9a3e090f-7d0f-46e9-a016-2ddc86fc194a)
We observe in the image above the error message informs us that the extension is not compatible. The uplaod is rejected.

   - File content scanner test
     
A basic file content scanner verify if the file contains some functions that may use for malicious purposes.

We uplaod the following file with this content:

![image](https://github.com/user-attachments/assets/c2ff4353-1b70-4a75-8b14-ab599222bd96)

This file uses os.system function that may use for execute some malicious commands. We have to protect the website from this kind of attacks. 

![image](https://github.com/user-attachments/assets/8c08e3f2-7592-4e1f-b70d-0c1f7cfb18e2)

As we see, the file is rejected thanks to the scan.

   - Size file limitation test

We verify the size of the file uploaded to preventfor DDoS attack. We will try to upload this file with 104.9MB size.
![image](https://github.com/user-attachments/assets/0b9961a3-ecee-478f-93de-767776daf562)

![image](https://github.com/user-attachments/assets/01eebe02-eb40-4c25-863a-1932137a5940)

The upload is rejected because the file is too big. Actually, the size limit is fixed to 100MB maximum.
