# 🛡️ Blue Team Remediation Report

## Executive Summary

This report outlines our response to the Red Team's security assessment of our Moodle facade application. The primary vulnerability identified was an insecure file upload system that allowed attackers to upload and execute malicious PHP code by bypassing our filtering mechanisms through image metadata injection and extension manipulation.

## Vulnerabilities Identified

| Vulnerability | Severity | Description |
|--------------|----------|-------------|
| Insecure File Upload | High | Attackers successfully bypassed our upload filtering by embedding PHP code within image metadata and using double extensions |
| Execution of PHP in Upload Directory | Critical | The server executed PHP files in the upload directory, allowing for remote code execution |
| Insufficient File Content Inspection | High | Our filtering only checked for blacklisted strings but failed to detect obfuscated code |
| Inadequate File Naming Controls | Medium | Original filenames with multiple extensions were preserved, enabling extension-based attacks |

## Remediation Plan

### 1. Secure File Upload Implementation

#### Code Modifications:

```php
// BEFORE (vulnerable code)
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
$blacklist = ['eval(', 'system(', 'exec(', 'shell_exec(', 'base64_decode(', 'passthru(', 'pcntl_exec(', 'posix_getuid(', '<script>'];

if(in_array($_FILES['file']['type'], $allowed_types)) {
  $content = file_get_contents($_FILES['file']['tmp_name']);
  $blocked = false;
  
  foreach($blacklist as $term) {
    if(strpos($content, $term) !== false) {
      $blocked = true;
      break;
    }
  }
  
  if(!$blocked) {
    $destination = 'upload/' . $_FILES['file']['name'];
    move_uploaded_file($_FILES['file']['tmp_name'], $destination);
    echo "File uploaded successfully";
  } else {
    echo "File failed security scan";
  }
}

// AFTER (secure implementation)
function secureFileUpload($file) {
  // Step 1: Define strict allowed types
  $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
  
  // Step 2: Use proper MIME type detection instead of trusting $_FILES
  $finfo = new finfo(FILEINFO_MIME_TYPE);
  $detected_type = $finfo->file($file['tmp_name']);
  
  if(!in_array($detected_type, $allowed_types)) {
    return [false, "Invalid file type detected"];
  }
  
  // Step 3: Generate a random name with single, safe extension
  $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
  $safe_extensions = ['jpg', 'jpeg', 'png', 'gif'];
  
  if(!in_array(strtolower($file_extension), $safe_extensions)) {
    return [false, "Invalid file extension"];
  }
  
  $new_filename = bin2hex(random_bytes(16)) . '.' . $file_extension;
  
  // Step 4: Use a dedicated upload directory with no execution permissions
  $upload_dir = 'secure_uploads/';
  $destination = $upload_dir . $new_filename;
  
  // Step 5: Deep content inspection - strip metadata
  try {
    // Create a new image from the uploaded file, removing all metadata
    switch($detected_type) {
      case 'image/jpeg':
        $image = imagecreatefromjpeg($file['tmp_name']);
        imagejpeg($image, $destination, 90);
        break;
      case 'image/png':
        $image = imagecreatefrompng($file['tmp_name']);
        imagepng($image, $destination, 9);
        break;
      case 'image/gif':
        $image = imagecreatefromgif($file['tmp_name']);
        imagegif($image, $destination);
        break;
      default:
        return [false, "Unsupported image format"];
    }
    imagedestroy($image);
    
    return [true, $new_filename];
  } catch (Exception $e) {
    return [false, "Error processing image: " . $e->getMessage()];
  }
}

// Implementation
if(isset($_FILES['file'])) {
  list($success, $message) = secureFileUpload($_FILES['file']);
  if($success) {
    echo "File uploaded successfully as: " . $message;
  } else {
    echo "Upload failed: " . $message;
  }
}
```

### 2. Server Configuration Changes

Add the following to the `.htaccess` file in the upload directory:

```
# Prevent execution of PHP files in upload directory
<FilesMatch "\.(php|php\.|php3|php4|php5|phtml|phptml)$">
  Order Allow,Deny
  Deny from all
</FilesMatch>

# Prevent access to files with multiple extensions
<FilesMatch ".*\.([^.]+)\.([^.]+)$">
  Order Allow,Deny
  Deny from all
</FilesMatch>

# Only allow specific file types to be accessed
<FilesMatch "\.(jpg|jpeg|png|gif)$">
  Order Deny,Allow
  Allow from all
</FilesMatch>

# Disable PHP engine in this directory
php_flag engine off
```

### 3. Additional Security Measures

#### Add a Web Application Firewall (ModSecurity)

Install and configure ModSecurity with the OWASP Core Rule Set:

```bash
# Ubuntu/Debian
sudo apt-get install libapache2-mod-security2
sudo a2enmod security2
sudo systemctl restart apache2

# Configure OWASP CRS
sudo cp /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf
sudo sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/modsecurity/modsecurity.conf
```

#### Implement ClamAV Scanning for Uploads

```php
// Add this to your file upload handler
function scanFileForMalware($filepath) {
  exec("clamscan --quiet " . escapeshellarg($filepath), $output, $return_code);
  return $return_code === 0; // 0 means no virus found
}

// Usage in upload handler
if(scanFileForMalware($destination)) {
  // File is clean, continue
} else {
  unlink($destination); // Delete the suspicious file
  return [false, "File failed malware scan"];
}
```

## Implementation Testing

After implementing these changes, we tested our system against the same attack vectors used by the Red Team:

1. ✅ Metadata injection attack: Blocked by stripping all metadata during image processing
2. ✅ Double extension attack: Blocked by generating random filenames with single extensions
3. ✅ PHP execution in upload directory: Blocked by server configuration
4. ✅ Content-based attacks: Improved with deep inspection and regeneration of images

## Long-term Security Recommendations

1. **Content Delivery Network (CDN)**: Consider using a CDN for serving static files, which adds an additional layer of security
2. **Regular Security Audits**: Schedule quarterly security audits of the application
3. **Security Headers**: Implement security headers like Content-Security-Policy to prevent XSS attacks
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks on the upload functionality
5. **Monitoring**: Implement logging and monitoring for suspicious upload attempts

## Conclusion

The remediation steps outlined above address the vulnerabilities identified by the Red Team. By implementing proper file validation, secure server configuration, and additional security layers, we've significantly improved our defense against file upload attacks.

The most critical change was moving from a simple blacklist-based approach to a comprehensive security strategy that includes:

1. Content verification and regeneration
2. Random filename generation
3. Preventing execution in upload directories
4. Server-side configuration enhancements
5. Additional security scanning

These improvements represent a shift from reactive security (detecting known bad patterns) to proactive security (allowing only verified safe content).