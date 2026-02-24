import * as React from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';

interface StatusBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'success' | 'error';
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function StatusBanner({ status, message, onRetry, className, ...props }: StatusBannerProps) {
  const isSuccess = status === 'success';

  return (
    <div
      className={cn(
        "rounded-xl p-4 flex items-start gap-4 border shadow-sm",
        isSuccess 
          ? "bg-green-50 border-green-200 text-green-900" 
          : "bg-red-50 border-red-200 text-red-900",
        className
      )}
      {...props}
    >
      <div className="shrink-0 mt-0.5">
        {isSuccess ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
      </div>
      
      <div className="flex-1">
        <h4 className="font-semibold text-sm mb-1">
          {isSuccess ? "Upload Successful" : "Upload Failed"}
        </h4>
        <p className="text-sm opacity-90 leading-relaxed">
          {message}
        </p>
        
        {!isSuccess && onRetry && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRetry}
            className="mt-3 h-8 px-3 -ml-2 text-red-700 hover:bg-red-100 hover:text-red-800"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
