
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface AudioControlsProps {
  src: string | null;
  title: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Reset state when audio source changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Handle metadata loaded
  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Handle play/pause
  const togglePlayPause = () => {
    if (!src) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };
  
  // Format time
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div className={cn(
      "w-full p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-300",
      !src && "opacity-50 pointer-events-none"
    )}>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleMetadataLoaded}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="truncate mr-4">
          <h3 className="text-sm font-medium text-muted-foreground">Now Playing</h3>
          <p className="text-base font-medium truncate">{title || 'No audio selected'}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={togglePlayPause}
            disabled={!src}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full",
              "bg-primary text-primary-foreground shadow-md",
              "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50",
              "transition-all duration-200",
              !src && "opacity-50 cursor-not-allowed"
            )}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="relative group">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSliderChange}
            disabled={!src}
            className={cn(
              "w-full h-2 bg-secondary rounded-full appearance-none",
              "focus:outline-none",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3",
              "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary",
              "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all",
              "group-hover:[&::-webkit-slider-thumb]:w-4 group-hover:[&::-webkit-slider-thumb]:h-4"
            )}
          />
          <div 
            className="absolute h-2 bg-primary/50 rounded-full pointer-events-none" 
            style={{ 
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              top: '0',
              left: '0' 
            }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!src}
            className={cn(
              "w-24 h-1 bg-secondary rounded-full appearance-none",
              "focus:outline-none",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2",
              "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary",
              "[&::-webkit-slider-thumb]:cursor-pointer"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
