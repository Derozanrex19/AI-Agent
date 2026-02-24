import { Check, Upload, FileCheck, Server, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Upload',
      description: 'Select your daily headcount Excel or CSV file.',
      icon: Upload,
    },
    {
      id: 2,
      title: 'Validate',
      description: 'System checks for file format and size errors.',
      icon: FileCheck,
    },
    {
      id: 3,
      title: 'Process',
      description: 'Securely transmitted to the backend server.',
      icon: Server,
    },
    {
      id: 4,
      title: 'Auto-Input',
      description: 'Data is automatically entered into the system.',
      icon: Database,
    },
  ];

  return (
    <div className="mt-12 pt-8 border-t border-gray-200/60">
      <h3 className="text-lg font-semibold text-lifewood-dark-serpent mb-6">How it works</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col items-start group">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-5 left-12 w-[calc(100%-3rem)] h-[2px] bg-gray-100 group-hover:bg-lifewood-castleton/20 transition-colors" />
            )}
            
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full mb-4 z-10 transition-all duration-300",
              "bg-white border-2 border-gray-100 text-gray-400 shadow-sm",
              "group-hover:border-lifewood-castleton group-hover:text-lifewood-castleton group-hover:scale-110"
            )}>
              <step.icon className="w-5 h-5" />
            </div>
            
            <h4 className="text-sm font-semibold text-lifewood-dark-serpent mb-1">
              Step {step.id}: {step.title}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
