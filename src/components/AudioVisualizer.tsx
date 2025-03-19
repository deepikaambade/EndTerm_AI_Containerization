
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioUrl: string | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      return;
    }

    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    audioRef.current.src = audioUrl;
    audioRef.current.crossOrigin = 'anonymous';
    
    // Set up audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    
    // Create analyzer
    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
    
    const analyser = analyserRef.current;
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    // Set up visualization
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    
    // Animation function
    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);
      
      analyser.getByteFrequencyData(dataArray);
      
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      
      const barWidth = (WIDTH / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 255 * HEIGHT;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, HEIGHT, 0, HEIGHT - barHeight);
        gradient.addColorStop(0, 'rgba(0, 122, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(88, 86, 214, 0.8)');
        gradient.addColorStop(1, 'rgba(52, 199, 89, 0.8)');
        
        ctx.fillStyle = gradient;
        
        // Draw rounded bars
        ctx.beginPath();
        ctx.moveTo(x + barWidth * 0.2, HEIGHT);
        ctx.lineTo(x + barWidth * 0.8, HEIGHT);
        ctx.quadraticCurveTo(x + barWidth, HEIGHT, x + barWidth, HEIGHT - barWidth * 0.2);
        ctx.lineTo(x + barWidth, HEIGHT - barHeight + barWidth * 0.2);
        ctx.quadraticCurveTo(x + barWidth, HEIGHT - barHeight, x + barWidth * 0.8, HEIGHT - barHeight);
        ctx.lineTo(x + barWidth * 0.2, HEIGHT - barHeight);
        ctx.quadraticCurveTo(x, HEIGHT - barHeight, x, HEIGHT - barHeight + barWidth * 0.2);
        ctx.lineTo(x, HEIGHT - barWidth * 0.2);
        ctx.quadraticCurveTo(x, HEIGHT, x + barWidth * 0.2, HEIGHT);
        ctx.closePath();
        ctx.fill();
        
        x += barWidth + 1;
      }
    };
    
    // Start visualization
    audioRef.current.play();
    renderFrame();
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, [audioUrl]);
  
  return (
    <div className="w-full rounded-xl overflow-hidden bg-black/5 backdrop-blur-sm h-[200px] shadow-inner">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={200} 
        className="w-full h-full"
      />
    </div>
  );
};

export default AudioVisualizer;
