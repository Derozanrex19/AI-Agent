/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBanner } from '@/components/StatusBanner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { HowItWorks } from '@/components/HowItWorks';
import { Download, FileDown, Upload } from 'lucide-react';

// --- MOCK API ---
const mockUploadApi = async (file: File): Promise<void> => {
  console.log('Starting upload for:', file.name);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        console.log('Upload success');
        resolve();
      } else {
        console.error('Upload failed');
        reject(new Error("Server connection timeout. Please try again."));
      }
    }, 2500); // 2.5s delay for realistic feel
  });
};

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setStatus('idle');
    
    // Validation
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/csv' // .csv alternative
    ];
    
    // Check extension as fallback since mime types can vary
    const fileName = selectedFile.name.toLowerCase();
    const isValidExtension = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');

    if (!validTypes.includes(selectedFile.type) && !isValidExtension) {
      setError('Invalid file type. Please upload .xlsx, .xls, or .csv.');
      setFile(selectedFile); // We still show the file but with error state
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
      setError('File is too large. Maximum size is 10MB.');
      setFile(selectedFile);
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setStatus('idle');
  };

  const handleSubmit = async () => {
    if (!file || error) return;

    setStatus('uploading');
    
    try {
      // Replace this mock API with real backend endpoint
      // const formData = new FormData();
      // formData.append('file', file);
      // await axios.post('/api/headcount/upload', formData);
      
      await mockUploadApi(file);
      
      setStatus('success');
      setStatusMessage('File processed successfully. Your report is ready for download.');
      setFile(null); // Clear file on success
    } catch (err) {
      setStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };

  const handleDownloadTemplate = () => {
    // Placeholder for template download
    alert("This would download the template file.");
  };

  return (
    <div className="min-h-screen bg-lifewood-paper p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            {/* Lifewood Logo Placeholder - Diamond Shape */}
            <div className="w-8 h-12 bg-lifewood-saffaron clip-diamond mr-3" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
            <h1 className="text-4xl font-bold text-lifewood-dark-serpent tracking-tight">lifewood</h1>
          </div>
          <h2 className="text-xl font-medium text-lifewood-dark-serpent/80 uppercase tracking-wider">Daily Head Count Monitoring</h2>
        </div>

        <Card className="border-t-4 border-t-lifewood-castleton shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upload Data</CardTitle>
            <CardDescription>
              Upload your daily headcount report to update the system.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <StatusBanner 
                    status="success" 
                    message={statusMessage} 
                  />
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <StatusBanner 
                    status="error" 
                    message={statusMessage} 
                    onRetry={() => setStatus('idle')}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Area */}
            {status !== 'success' && (
              <div className="space-y-6">
                 {status === 'uploading' ? (
                   <div className="flex flex-col items-center justify-center py-12 space-y-6 bg-gray-50 rounded-xl border border-gray-100">
                     <LoadingSpinner size={64} />
                     <div className="text-center space-y-2">
                       <h3 className="text-lg font-semibold text-lifewood-dark-serpent">Uploading Data...</h3>
                       <p className="text-sm text-gray-500">Please wait while we process your file.</p>
                     </div>
                   </div>
                 ) : (
                   <FileUpload 
                     onFileSelect={handleFileSelect}
                     onFileRemove={handleRemoveFile}
                     selectedFile={file}
                     error={error}
                     disabled={status === 'uploading'}
                   />
                 )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
            <Button 
              variant="ghost" 
              onClick={handleDownloadTemplate}
              disabled={status === 'uploading'}
              className="w-full sm:w-auto text-lifewood-dark-serpent hover:bg-lifewood-dark-serpent/5"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Template
            </Button>

            {status !== 'success' && (
              <Button 
                onClick={handleSubmit}
                disabled={!file || !!error || status === 'uploading'}
                className="w-full sm:w-auto min-w-[160px]"
              >
                {status === 'uploading' ? 'Processing...' : 'Upload & Submit'}
                {status !== 'uploading' && <Upload className="ml-2 h-4 w-4" />}
              </Button>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  onClick={() => alert("Downloading processed report...")}
                  className="w-full sm:w-auto bg-lifewood-castleton hover:bg-lifewood-dark-serpent text-white shadow-md"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setStatus('idle')}
                  className="w-full sm:w-auto"
                >
                  Upload New File
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        {/* How It Works Section */}
        <HowItWorks />
        
        {/* Footer */}
        <div className="mt-12 text-center text-xs text-lifewood-dark-serpent/40">
          <p>&copy; {new Date().getFullYear()} Lifewood. All rights reserved.</p>
          <p className="mt-1">Always On Never Off</p>
        </div>
      </motion.div>
    </div>
  );
}
