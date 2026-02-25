import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Download, FileDown, LogIn, LogOut, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileUpload } from '@/components/FileUpload';
import { StatusBanner } from '@/components/StatusBanner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { HowItWorks } from '@/components/HowItWorks';
import GradientText from '@/components/GradientText';
import VariableProximity from '@/components/VariableProximity';
import Grainient from '@/components/Grainient';

type AppView = 'landing' | 'main';
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const mockUploadApi = async (file: File): Promise<void> => {
  console.log('Starting upload for:', file.name);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) resolve();
      else reject(new Error('Server connection timeout. Please try again.'));
    }, 2000);
  });
};

export default function App() {
  const titleContainerRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<AppView>('landing');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const openLoginModal = () => {
    setLoginError(null);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginError(null);
  };

  const handleSubmitLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);

    if (!username.trim() || !password.trim()) {
      setLoginError('Please enter your username and password.');
      return;
    }

    if (username !== 'Admin' || password !== 'Admin123') {
      setLoginError('Invalid username or password.');
      return;
    }

    setIsLoginModalOpen(false);
    setView('main');
    setUsername('');
    setPassword('');
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setStatus('idle');

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/csv',
    ];

    const fileName = selectedFile.name.toLowerCase();
    const isValidExtension =
      fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');

    if (!validTypes.includes(selectedFile.type) && !isValidExtension) {
      setError('Invalid file type. Please upload .xlsx, .xls, or .csv.');
      setFile(selectedFile);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
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

  const handleSubmitUpload = async () => {
    if (!file || error) return;

    setStatus('uploading');
    try {
      await mockUploadApi(file);
      setStatus('success');
      setStatusMessage('File processed successfully. Your report is ready for download.');
      setFile(null);
    } catch (err) {
      setStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };

  const handleDownloadTemplate = () => {
    alert('This would download the template file.');
  };

  if (view === 'main') {
    return (
      <div className="min-h-screen bg-lifewood-paper p-4 md:p-8 text-lifewood-dark-serpent">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <div className="inline-flex items-center justify-center sm:justify-start">
                <img
                  src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                  alt="Lifewood logo"
                  className="h-12 w-auto"
                />
              </div>
              <h2 className="mt-3 text-xl font-medium uppercase tracking-wider text-lifewood-dark-serpent/85">
                Daily Head Count Monitoring
              </h2>
            </div>

            <Button
              variant="outline"
              onClick={() => setView('landing')}
              className="w-full sm:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Back to Landing
            </Button>
          </div>

          <Card className="border-t-4 border-t-lifewood-castleton shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upload Data</CardTitle>
              <CardDescription>
                Upload your daily headcount report to update the system.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <StatusBanner status="success" message={statusMessage} />
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

              {status !== 'success' && (
                <div className="space-y-6">
                  {status === 'uploading' ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-gray-50 py-12 space-y-6">
                      <LoadingSpinner size={64} />
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-lifewood-dark-serpent">
                          Uploading Data...
                        </h3>
                        <p className="text-sm text-gray-500">
                          Please wait while we process your file.
                        </p>
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
                className="w-full sm:w-auto"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Download Template
              </Button>

              {status !== 'success' && (
                <Button
                  onClick={handleSubmitUpload}
                  disabled={!file || !!error || status === 'uploading'}
                  className="w-full sm:w-auto min-w-[160px]"
                >
                  {status === 'uploading' ? 'Processing...' : 'Upload & Submit'}
                  {status !== 'uploading' && <Upload className="ml-2 h-4 w-4" />}
                </Button>
              )}

              {status === 'success' && (
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Button
                    onClick={() => alert('Downloading processed report...')}
                    className="w-full sm:w-auto bg-lifewood-castleton hover:bg-lifewood-dark-serpent text-white shadow-md"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  <Button variant="outline" onClick={() => setStatus('idle')} className="w-full sm:w-auto">
                    Upload New File
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>

          <HowItWorks />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-lifewood-paper text-lifewood-dark-serpent">
      <div className="pointer-events-none absolute inset-0">
        <Grainient
          color1="#A7D4BF"
          color2="#3A8B69"
          color3="#133020"
          timeSpeed={0.18}
          colorBalance={0.02}
          warpStrength={0.75}
          warpFrequency={3.6}
          warpSpeed={1.2}
          warpAmplitude={82}
          blendAngle={18}
          blendSoftness={0.16}
          rotationAmount={180}
          noiseScale={1.2}
          grainAmount={0.05}
          grainScale={2}
          grainAnimated={false}
          contrast={1.08}
          gamma={1}
          saturation={0.72}
          centerX={0}
          centerY={0}
          zoom={1.06}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 md:px-8 md:py-8">
        <main className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex w-full max-w-5xl flex-col items-center px-4 py-8 text-center md:px-8 md:py-12"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.88, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, type: 'spring', stiffness: 220, damping: 16 }}
              src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
              alt="Lifewood logo"
              className="mb-8 h-16 w-auto drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)] md:h-24"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.11, type: 'spring', stiffness: 220, damping: 16 }}
              className="max-w-4xl"
            >
              <div ref={titleContainerRef} className="relative">
                <h1 className="text-center text-4xl font-semibold leading-tight md:text-6xl">
                  <GradientText
                    colors={['#ffffff', '#FFE6B8', '#FFB347', '#ffffff']}
                    animationSpeed={6}
                    showBorder={false}
                    direction="horizontal"
                    className="inline-flex drop-shadow-[0_6px_26px_rgba(0,0,0,0.55)]"
                  >
                    <VariableProximity
                      label="Daily Head Count Monitoring"
                      className="variable-proximity-demo"
                      fromFontVariationSettings="'wght' 500, 'opsz' 14"
                      toFontVariationSettings="'wght' 1000, 'opsz' 72"
                      containerRef={titleContainerRef}
                      radius={130}
                      falloff="linear"
                    />
                  </GradientText>
                </h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18, type: 'spring', stiffness: 220, damping: 16 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={openLoginModal}
                className="mt-10 min-w-[180px] rounded-full border-white/80 bg-white/10 text-white shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-white/18 hover:text-white"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={closeLoginModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.28, type: 'spring', stiffness: 240, damping: 18 }}
              className="relative z-50 w-full max-w-xl rounded-3xl border border-white/25 bg-white/10 px-6 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-10 md:py-12"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close login modal"
                onClick={closeLoginModal}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white/90 transition hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </button>

              <motion.img
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.04 }}
                src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
                alt="Lifewood logo"
                className="mx-auto h-16 w-auto drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:h-20"
              />

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-6 text-base font-medium uppercase tracking-[0.18em] text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)] md:text-xl"
              >
                Always On Never Off
              </motion.p>

              <motion.form
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.16 }}
                onSubmit={handleSubmitLogin}
                className="mx-auto mt-8 w-full max-w-sm space-y-4 text-left"
              >
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/85"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Admin"
                    className="w-full rounded-xl border border-white/25 bg-white/12 px-4 py-3 text-white placeholder:text-white/45 outline-none ring-0 backdrop-blur-md transition focus:border-white/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/85"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin123"
                    className="w-full rounded-xl border border-white/25 bg-white/12 px-4 py-3 text-white placeholder:text-white/45 outline-none ring-0 backdrop-blur-md transition focus:border-white/60"
                  />
                </div>

                {loginError && (
                  <p className="rounded-xl border border-red-300/30 bg-red-500/15 px-3 py-2 text-sm text-red-100">
                    {loginError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="mt-2 w-full rounded-xl border-white/70 bg-white text-lifewood-dark-serpent hover:bg-white/90"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
