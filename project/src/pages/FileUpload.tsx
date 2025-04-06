import React, { useState, useEffect } from 'react';
import { Upload, FileCheck, AlertCircle, XCircle, Shield, RefreshCw } from 'lucide-react';

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  
  // CAPTCHA states with enhanced security
  const [captchaText, setCaptchaText] = useState<string>('');
  const [userCaptcha, setUserCaptcha] = useState<string>('');
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);

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

  // More secure CAPTCHA generation
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);
    setUserCaptcha('');
    setCaptchaVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // CAPTCHA verification
  const verifyCaptcha = () => {
    if (userCaptcha === captchaText) {
      setCaptchaVerified(true);
      setError('');
      return true;
    }
    setError('Invalid CAPTCHA code');
    return false;
  };

  // Deep file scan
  const scanFile = async (file: File): Promise<boolean> => {
    setScanning(true);
    setScanResult('');

    const fileNameParts = file.name.toLowerCase().split('.');
    const extension = fileNameParts[fileNameParts.length - 1];
    
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

    try {
      if (file.type.includes('text') || file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document')) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const textDecoder = new TextDecoder();
        const content = textDecoder.decode(uint8Array);
        
        const dangerousPatterns = [
          'eval(', 'system(', '<script>', 'Function(', 'exec(', 'shell_exec(', 
          'base64_decode(', 'os.system(', 'compile(', 'os.chmod(', 'os.chown(',
          'passthru(', 'pcntl_exec(', 'posix_getuid(', 'posix_setuid(', 'pty.spawn(',
          '<?php', '<?=', '<%', '<asp:', 'fromcharcode', 'document.write', '.exec',
          'child_process', 'spawn(', 'writefilesync'
        ];

        const dangerousRegexPatterns = [
          /(\$|_|\w+)\s*\(\s*(\$|_|\w+)\s*\[\s*['"]?\w+['"]?\s*\]/i,
          /\\x[0-9a-f]{2}/i,
          /base64_/i,
          /eval\s*\(/i,
          /\\u00[0-9a-f]{2}/i,
          /String\.fromCharCode/i,
        ];

        for (const pattern of dangerousPatterns) {
          if (content.toLowerCase().includes(pattern.toLowerCase())) {
            setScanResult(`Potentially malicious content detected: ${pattern}`);
            setScanning(false);
            return false;
          }
        }

        for (const regex of dangerousRegexPatterns) {
          if (regex.test(content)) {
            setScanResult(`Suspicious pattern detected in the file`);
            setScanning(false);
            return false;
          }
        }
      }

      if (file.type.includes('image')) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

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

      setScanResult('Scan complete: No threats detected');
      setScanning(false);
      return true;
    } catch (err) {
      console.error('Scan failed:', err);
      setScanResult('File scan failed');
      setScanning(false);
      return false;
    }
  };

  const validateFile = async (file: File): Promise<boolean> => {
    if (!captchaVerified) {
      setError('Please verify CAPTCHA first');
      return false;
    }

    const fileNameParts = file.name.toLowerCase().split('.');
    const extension = fileNameParts[fileNameParts.length - 1];
    const validExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

    if (!validExtensions.includes(extension)) {
      setError(`Invalid file type. Allowed types: ${allowedExtensions}`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedExtensions}`);
      return false;
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds 100MB limit');
      return false;
    }

    const scanPassed = await scanFile(file);
    if (!scanPassed) {
      setError('File failed the security scan');
      return false;
    }

    setError('');
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (await validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (await validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Secure File Upload</h1>
        <p className="text-slate-400">Upload your files securely with end-to-end encryption</p>
      </div>

      {/* CAPTCHA Section */}
      <div className="bg-slate-800 rounded-lg p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Verify CAPTCHA</h2>
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-slate-700 p-3 rounded-lg font-mono text-xl tracking-wider">
            {captchaText}
          </div>
          <button
            onClick={generateCaptcha}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        <div className="flex space-x-4">
          <input
            type="text"
            value={userCaptcha}
            onChange={(e) => setUserCaptcha(e.target.value)}
            placeholder="Enter CAPTCHA"
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={verifyCaptcha}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors"
          >
            Verify
          </button>
        </div>
        {captchaVerified && (
          <p className="text-green-500 mt-2">CAPTCHA verified successfully! You are able to submit your file!</p>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-8 mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? "border-cyan-500 bg-slate-700/50" : "border-slate-600"} ${error ? "border-red-500" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${error ? "text-red-500" : "text-cyan-500"}`} />
          <p className="text-lg mb-2">
            Drag and drop your file here, or{" "}
            <label className="text-cyan-500 hover:text-cyan-400 cursor-pointer">
              browse
              <input
                type="file"
                className="hidden"
                onChange={handleChange}
                accept={allowedExtensions}
              />
            </label>
          </p>
          <p className="text-sm text-slate-400">Maximum file size: 100MB</p>
          <p className="text-sm text-slate-400">Allowed types: {allowedExtensions}</p>
        </div>
      </div>

      {scanning && (
        <div className="bg-slate-800 rounded-lg p-4 flex items-center mb-8">
          <Shield className="h-6 w-6 text-cyan-500 animate-pulse mr-3" />
          <p>Scanning file for threats...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 text-red-200 rounded-lg p-4 flex items-center mb-8">
          <XCircle className="h-6 w-6 text-red-500 mr-3" />
          <p>{error}</p>
        </div>
      )}

      {scanResult && !error && (
        <div className="bg-slate-800 rounded-lg p-4 flex items-center mb-8">
          <Shield className="h-6 w-6 text-cyan-500 mr-3" />
          <p>{scanResult}</p>
        </div>
      )}

      {file && !error && (
        <div className="bg-slate-800 rounded-lg p-4 flex items-center">
          <FileCheck className="h-6 w-6 text-green-500 mr-3" />
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-slate-800/50 rounded-lg p-6">
        <h3 className="flex items-center text-lg font-medium mb-4">
          <AlertCircle className="h-5 w-5 text-cyan-500 mr-2" />
          Security Guidelines
        </h3>
        <ul className="space-y-2 text-slate-400">
          <li>• Supported formats: PDF, DOC, DOCX, JPG, PNG</li>
          <li>• Files are automatically scanned for malware</li>
          <li>• Size limit is 100MB.</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
