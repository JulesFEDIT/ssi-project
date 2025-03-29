import React, { useState } from 'react';
import { Upload, FileCheck, AlertCircle, XCircle } from 'lucide-react';

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

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

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types are: ${allowedExtensions}`);
      return false;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      setError('File size exceeds 100MB limit');
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
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

      {error && (
        <div className="bg-red-900/50 text-red-200 rounded-lg p-4 flex items-center mb-8">
          <XCircle className="h-6 w-6 text-red-500 mr-3" />
          <p>{error}</p>
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
          <li>• All files are encrypted before transmission</li>
          <li>• Supported formats: PDF, DOC, DOCX, JPG, PNG</li>
          <li>• Files are automatically scanned for malware</li>
          <li>• Data is stored in secure, encrypted storage</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;