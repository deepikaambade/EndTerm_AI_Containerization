
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUploader from '@/components/FileUploader';
import AudioControls from '@/components/AudioControls';
import AudioVisualizer from '@/components/AudioVisualizer';
import ComparisonSlider from '@/components/ComparisonSlider';
import InfoCard from '@/components/InfoCard';
import Statistics from '@/components/Statistics';
import { processAudio, downloadAudio } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [originalAudio, setOriginalAudio] = useState<string | null>(null);
  const [processedAudio, setProcessedAudio] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      setAudioName(file.name);
      
      // Create URL for original audio
      const originalUrl = URL.createObjectURL(file);
      setOriginalAudio(originalUrl);
      
      // Process the audio
      const processedUrl = await processAudio(file);
      setProcessedAudio(processedUrl);
      
      // Show success toast
      toast({
        title: 'Audio Processed Successfully',
        description: 'Your audio has been denoised and is ready to play.',
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Processing Failed',
        description: 'Failed to process audio file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!processedAudio) return;
    
    const fileName = audioName.replace(/\.[^/.]+$/, '') + '_denoised.wav';
    downloadAudio(processedAudio, fileName);
    
    toast({
      title: 'Download Started',
      description: `Downloading ${fileName}`,
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <Header />
      
      <main className="flex-1">
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto animate-fade-in mb-16">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Eliminate Noise from Your Audio
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Our AI-powered audio processing system removes unwanted noise while 
                preserving the clarity and quality of your original audio.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <InfoCard
                  title="Noise Reduction"
                  description="Eliminate background noise, hums, and static from your recordings with advanced neural network processing."
                  icon={
                    <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  }
                />
                
                <InfoCard
                  title="Audio Enhancement"
                  description="Preserve and enhance the quality of speech and music with our specially trained deep learning model."
                  icon={
                    <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                  }
                />
                
                <InfoCard
                  title="Fast Processing"
                  description="Process your audio files quickly with our optimized algorithms designed for speed and accuracy."
                  icon={
                    <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  }
                />
              </div>
              
              <div className="space-y-12">
                <div className="bg-white/70 backdrop-blur-lg border border-border rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">Upload Your Audio</h2>
                  <FileUploader onFileUpload={handleFileUpload} loading={loading} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-xl font-semibold">Original Audio</h3>
                    <AudioVisualizer audioUrl={originalAudio} />
                    <AudioControls src={originalAudio} title={audioName || 'Original Audio'} />
                  </div>
                  
                  <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-xl font-semibold">Denoised Audio</h3>
                    <AudioVisualizer audioUrl={processedAudio} />
                    <AudioControls src={processedAudio} title={audioName ? `${audioName} (Denoised)` : 'Processed Audio'} />
                  </div>
                </div>
                
                <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-xl font-semibold">Compare Results</h3>
                  <ComparisonSlider beforeSrc={originalAudio} afterSrc={processedAudio} />
                  
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={handleDownload}
                      disabled={!processedAudio}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg py-2 px-4 shadow-sm transition-all duration-200"
                    >
                      <svg 
                        className="w-5 h-5 mr-2" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download Processed Audio
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                Performance Metrics
              </span>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Exceptional Results</h2>
              <p className="text-lg text-muted-foreground">
                Our audio denoising technology delivers outstanding results across multiple metrics.
              </p>
            </div>
            
            <Statistics />
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                How It Works
              </span>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Powered by Deep Learning</h2>
              <p className="text-lg text-muted-foreground">
                Our technology leverages state-of-the-art neural networks to analyze and clean your audio files.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl glass-card text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 mx-auto mb-4">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Audio Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our system breaks down your audio into frequency components using advanced signal processing.
                </p>
              </div>
              
              <div className="p-6 rounded-xl glass-card text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 mx-auto mb-4">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Noise Detection</h3>
                <p className="text-sm text-muted-foreground">
                  AI algorithms identify and isolate unwanted noise patterns from meaningful audio signals.
                </p>
              </div>
              
              <div className="p-6 rounded-xl glass-card text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 mx-auto mb-4">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Audio Reconstruction</h3>
                <p className="text-sm text-muted-foreground">
                  Clean audio is reconstructed, preserving natural sound characteristics while removing noise.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
