
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface ComparisonSliderProps {
  beforeSrc: string | null;
  afterSrc: string | null;
  beforeLabel?: string;
  afterLabel?: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After"
}) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  // Handle touch start
  const handleTouchStart = () => {
    setIsDragging(true);
  };
  
  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const container = containerRef.current.getBoundingClientRect();
      const x = e.clientX - container.left;
      const newPosition = Math.max(0, Math.min(100, (x / container.width) * 100));
      setPosition(newPosition);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const container = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - container.left;
      const newPosition = Math.max(0, Math.min(100, (x / container.width) * 100));
      setPosition(newPosition);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);
  
  return (
    <div 
      className={cn(
        "relative w-full h-60 md:h-80 overflow-hidden rounded-xl border border-border shadow-sm",
        "bg-gray-100 flex items-center justify-center",
        (!beforeSrc || !afterSrc) && "opacity-50"
      )}
      ref={containerRef}
    >
      {(!beforeSrc || !afterSrc) ? (
        <div className="text-center p-4">
          <p className="text-muted-foreground">
            Upload an audio file to see the comparison
          </p>
        </div>
      ) : (
        <>
          {/* Before section */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative w-full h-full overflow-hidden">
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-900/5 backdrop-blur-xs"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-destructive" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19.82 2.04A10 10 0 0 0 5.4 16.59"></path>
                      <path d="M4.24 9.53A10 10 0 0 0 10.23 21"></path>
                      <path d="M8.5 14.5A4 4 0 0 1 15 7"></path>
                      <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{beforeLabel}</p>
                    <p className="text-xs text-muted-foreground">With Noise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* After section */}
          <div 
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-primary/5 backdrop-blur-xs"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{afterLabel}</p>
                    <p className="text-xs text-muted-foreground">Noise Removed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Slider */}
          <div 
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
            style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
          >
            <div 
              className="h-full w-1 bg-white shadow-md"
              style={{ opacity: isDragging ? 1 : 0.7 }}
            ></div>
            
            <div 
              className={cn(
                "absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md pointer-events-auto cursor-grab",
                isDragging && "cursor-grabbing scale-110",
                "transition-transform duration-150"
              )}
              style={{ left: '50%', transform: 'translateX(-50%)' }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-primary"
              >
                <polyline points="8 5 12 9 16 5"></polyline>
                <polyline points="16 19 12 15 8 19"></polyline>
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparisonSlider;
