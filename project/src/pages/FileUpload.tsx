import React, { useState, useEffect } from 'react';
import { Upload, FileCheck, AlertCircle, XCircle, Shield, RefreshCw } from 'lucide-react';

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  
  // CAPTCHA states
  const [captchaText, setCaptchaText] = useState<string>('');
  const [userCaptcha, setUserCaptcha] = useState<string>('');
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);

  // Define allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ];

  // File extensions for display
  const allowedExtensions = '.pdf, .doc, .docx, .jpg, .png';

  // VULNERABLE: Simple captcha generation
  const generateCaptcha = () => {
    // VULNERABLE: Predictable pattern - only numbers
    const captcha = Math.floor(Math.random() * 9000 + 1000).toString();
    setCaptchaText(captcha);
    setUserCaptcha('');
    setCaptchaVerified(false);
  };

  // Initialize captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // VULNERABLE: Simple string comparison
  const verifyCaptcha = () => {
    if (userCaptcha === captchaText) {
      setCaptchaVerified(true);
      setError('');
      return true;
    }
    setError('Invalid CAPTCHA code');
    return false;
  };

  // Basic signature scanning - VULNERABLE: Only checks for exact matches
  const scanFile = async (file: File): Promise<boolean> => {
    setScanning(true);
    setScanResult('');

    try {
      const text = await file.text(); // VULNERABLE: Assumes file is text-based
      const dangerousPatterns = [
        'eval(',
        'system(',
        '<script>',
        'Function(',
        'exec(',
        'shell_exec(',
        'base64_decode(',
        'os.system(',
        'compile(',
        'os.chmod(',
        'os.chown(',
        'passthru(',
        'pcntl_exec(',
        'posix_getuid(',
        'posix_setuid(',
        'pty.spawn('
      ];

      // VULNERABLE: Simple string matching without context
      for (const pattern of dangerousPatterns) {
        if (text.includes(pattern)) {
          setScanResult(`Potentially malicious content detected: ${pattern}`);
          setScanning(false);
          return false;
        }
      }

      setScanResult('File scan completed: No threats detected');
      setScanning(false);
      return true;
    } catch (err) {
      // VULNERABLE: Generic error handling
      console.error('Scan failed:', err);
      setScanResult('File scan failed');
      setScanning(false);
      return false;
    }
  };

  const validateFile = async (file: File): Promise<boolean> => {
    // VULNERABLE: CAPTCHA check after file processing started
    if (!captchaVerified) {
      setError('Please verify CAPTCHA first');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types are: ${allowedExtensions}`);
      return false;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      setError('File size exceeds 100MB limit');
      return false;
    }

    // VULNERABLE: Scan happens after type validation
    const scanPassed = await scanFile(file);
    if (!scanPassed) {
      setError('File failed security scan');
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
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-cyan-500 bg-slate-700/50" : "border-slate-600"
          } ${error ? "border-red-500" : ""}`}
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