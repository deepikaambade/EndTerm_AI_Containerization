
import React, { useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { toast } from '@/components/ui/use-toast';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };
  
  // Handle click upload
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };
  
  // Validate file type
  const validateAndProcessFile = (file: File) => {
    const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a WAV or MP3 file.",
        variant: "destructive"
      });
      return;
    }
    
    onFileUpload(file);
  };
  
  // Handle button click
  const onButtonClick = () => {
    inputRef.current?.click();
  };
  
  return (
    <form
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out",
        dragActive 
          ? "border-primary bg-primary/5 scale-[1.01]" 
          : "border-border hover:border-primary/50 hover:bg-secondary/50",
        loading && "opacity-50 pointer-events-none"
      )}
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".wav,.mp3"
        onChange={handleChange}
        className="hidden"
      />
      
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <svg 
            className="w-8 h-8 text-primary" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M8 16V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8" />
            <path d="M2 16l4-4 4 4" />
            <path d="M18 16l4-4 4 4" />
            <path d="M6 12h12" />
          </svg>
        </div>
        <p className="mb-2 text-lg font-medium text-foreground">
          {loading ? 'Processing...' : 'Drag & drop your audio file here'}
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          Supports WAV and MP3 formats
        </p>
        {!loading && (
          <button
            type="button"
            onClick={onButtonClick}
            className="py-2 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all duration-200"
          >
            Browse Files
          </button>
        )}
        {loading && (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="text-sm text-muted-foreground">Processing audio...</span>
          </div>
        )}
      </div>
    </form>
  );
};

export default FileUploader;
