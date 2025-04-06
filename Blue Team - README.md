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




🛡️ Security Improvements Implementation Report
📋 Executive Summary
Following the detailed Red Team exploitation report, we have implemented several critical security enhancements to protect our file upload system. These improvements directly address the vulnerabilities discovered during penetration testing, particularly focusing on preventing PHP code injection in image metadata and double extension bypass attempts.

Vulnerability	Severity	Description
Insecure File Upload	High	Attackers successfully bypassed our upload filtering by embedding PHP code within image metadata and using double extensions
Execution of PHP in Upload Directory	Critical	The server executed PHP files in the upload directory, allowing for remote code execution
Insufficient File Content Inspection	High	Our filtering only checked for blacklisted strings but failed to detect obfuscated code
Inadequate File Naming Controls	Medium	Original filenames with multiple extensions were preserved, enabling extension-based attacks
🔒 Implemented Security Measures
1. 🤖 Enhanced CAPTCHA System
Randomized Content: Replaced digit-only system with random combination of letters and numbers
Increased Complexity: Extended length to 6 characters to mitigate brute force attempts
Timing Attack Prevention: Implemented secure comparison methods to prevent timing-based attacks
// More secure CAPTCHA generation
const generateCaptcha = () => {
  // Combination of letters and numbers to avoid predictable patterns
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  setCaptchaText(captcha);
  setUserCaptcha('');
  setCaptchaVerified(false);
};

// CAPTCHA verification with timing attack protection
const verifyCaptcha = () => {
  // Secure comparison to avoid timing attacks
  if (userCaptcha.length === captchaText.length) {
    let match = true;
    for (let i = 0; i < captchaText.length; i++) {
      if (userCaptcha[i] !== captchaText[i]) {
        match = false;
      }
    }
    if (match) {
      setCaptchaVerified(true);
      setError('');
      return true;
    }
  }
  setError('Invalid CAPTCHA code');
  return false;
};
image

alt text

2. ✅ Improved Verification Process
Pre-Processing Validation: CAPTCHA now verified before any file processing operations begin
Sequential Security Gates: Ensures authentication before allowing resource-intensive operations
const validateFile = async (file: File): Promise<boolean> => {
  // Check CAPTCHA BEFORE processing file
  if (!captchaVerified) {
    setError('Please verify CAPTCHA first');
    return false;
  }
image

3. 🔍 Double Extension Detection
Full Filename Analysis: Comprehensive scanning of complete filenames to detect double extensions (e.g., .php.png)
Extension Blacklisting: Implementation of blacklist for dangerous extensions (.php, .js, .exe, etc.)
Pattern Recognition: Detection of common obfuscation techniques
// Check for double extensions
if (fileNameParts.length > 2) {
  const suspiciousExtensions = ['php', 'js', 'html', 'exe', 'sh', 'asp', 'cgi', 'pl'];
  for (const ext of suspiciousExtensions) {
    if (fileNameParts.includes(ext)) {
      setScanResult(`Potentially dangerous extension detected: ${ext}`);
      setScanning(false);
      return false;
    }
  }
}
4. 🧩 MIME/Extension Consistency Verification
Content Type Validation: Cross-verification between declared MIME type and file extension
Automatic Rejection: Files with mismatched extension/content types are immediately rejected
// Check if extension matches MIME type
const validExtensions = {
  'pdf': 'application/pdf',
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png'
};

const expectedMimeType = validExtensions[extension as keyof typeof validExtensions];
if (expectedMimeType && file.type !== expectedMimeType) {
  setScanResult('File type does not match extension');
  setScanning(false);
  return false;
}
5. 📊 Image Metadata Analysis
Header Validation: Thorough checking of file headers to confirm legitimate image files
Metadata Scanning: Detection of PHP code injected into image metadata (addressing the specific exploit demonstrated by Red Team)
EXIF Data Inspection: Examination of all metadata fields for malicious content
// Specific analysis for images
if (file.type.includes('image')) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Check valid image headers
  const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  const jpegSignature = [0xFF, 0xD8, 0xFF];
  
  const isPNG = pngSignature.every((byte, i) => uint8Array[i] === byte);
  const isJPEG = jpegSignature.every((byte, i) => uint8Array[i] === byte);
  
  if (file.type.includes('png') && !isPNG) {
    setScanResult("Invalid PNG header detected");
    setScanning(false);
    return false;
  }
  
  if ((file.type.includes('jpeg') || file.type.includes('jpg')) && !isJPEG) {
    setScanResult("Invalid JPEG header detected");
    setScanning(false);
    return false;
  }
  
  // Search for PHP code in binary data
  const binaryString = Array.from(uint8Array)
    .map(b => String.fromCharCode(b))
    .join('');
    
  const phpPatterns = ['<?php', '<?=', '<%', 'system(', 'eval(', 'exec('];
  for (const pattern of phpPatterns) {
    if (binaryString.includes(pattern)) {
      setScanResult(`Potentially malicious code detected in image metadata`);
      setScanning(false);
      return false;
    }
  }
}
6. 🔬 Enhanced Content Analysis
Expanded Pattern Detection: Significantly extended list of dangerous patterns for detection
Anti-Obfuscation Measures: Implementation of regular expressions to detect code obfuscation attempts
Binary Analysis: Deep inspection of binary files to detect hidden malicious code
// Extended list of dangerous patterns
const dangerousPatterns = [
  'eval(', 'system(', '<script>', 'Function(', 'exec(', 'shell_exec(', 
  'base64_decode(', 'os.system(', 'compile(', 'os.chmod(', 'os.chown(',
  'passthru(', 'pcntl_exec(', 'posix_getuid(', 'posix_setuid(', 'pty.spawn(',
  '<?php', '<?=', '<%', '<asp:', 'fromcharcode', 'document.write', '.exec',
  'child_process', 'spawn(', 'writefilesync'
];

// Regex to detect obfuscated schemes
const dangerousRegexPatterns = [
  /(\$|_|\w+)\s*\(\s*(\$|_|\w+)\s*\[\s*['"]?\w+['"]?\s*\]\s*\)/i, // Variable func patterns
  /\\x[0-9a-f]{2}/i, // Hex encoding
  /base64_/i, // Base64 related functions
  /eval\s*\(/i, // Eval with spaces
  /\\u00[0-9a-f]{2}/i, // Unicode encoding
  /String\.fromCharCode/i, // JavaScript character code conversion
];
image

7. ⚙️ Complete Pre-Upload Validation
Multi-Layer Verification: Comprehensive checking of actual file extension
MIME Validation: Rigorous MIME type validation before acceptance
Size Limitations: Maximum file size maintained at 100MB to prevent DoS attacks
// Check file extension
const fileNameParts = file.name.toLowerCase().split('.');
const extension = fileNameParts[fileNameParts.length - 1];
const validExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

if (!validExtensions.includes(extension)) {
  setError(`Invalid file type. Allowed types: ${allowedExtensions}`);
  return false;
}

// Check MIME type
if (!allowedTypes.includes(file.type)) {
  setError(`Invalid file type. Allowed types: ${allowedExtensions}`);
  return false;
}

const maxSize = 100 * 1024 * 1024; // 100MB in bytes
if (file.size > maxSize) {
  setError('File size exceeds 100MB limit');
  return false;
}
8. 👁️ User Interface Improvements
Transparent Security: Clear information about supported formats presented to users
Security Awareness: Explicit mention of metadata analysis to discourage malicious attempts
// Allowed file types
const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

// Extensions for display
const allowedExtensions = '.pdf, .doc, .docx, .jpg, .png';
🔄 Relation to Red Team Findings
These security enhancements directly address the vulnerabilities demonstrated in the Red Team report:

🐛 Metadata Injection Vulnerability: The implementation of thorough metadata analysis prevents the successful injection of PHP code into image metadata that bypassed our previous filtering system.

📝 Double Extension Bypass: New filename analysis and extension verification prevent the use of double extensions to disguise malicious files as legitimate images.

🔐 Blacklist Evasion: Enhanced content analysis with regular expressions can now detect obfuscated malicious code that previously evaded our blacklist filters.

📈 Additional Security Recommendations
Based on the Red Team's report, we also recommend implementing:

🚫 Complete disabling of PHP execution in upload directories
🔄 Server-side file renaming using secure hashing algorithms
🦠 Integration with ClamAV or similar antivirus scanning
📦 Sandbox execution analysis for suspicious files
🏁 Conclusion
The implemented security measures significantly enhance our defense-in-depth strategy for file uploads. By addressing the precise techniques used by the Red Team (particularly metadata injection and double extension bypasses), we have substantially reduced the attack surface of our application.

These improvements demonstrate our commitment to security as an ongoing process and our ability to rapidly respond to identified vulnerabilities.
