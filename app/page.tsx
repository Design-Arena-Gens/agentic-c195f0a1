'use client';

import { useState } from 'react';
import VideoUpload from './components/VideoUpload';
import ProcessingPipeline from './components/ProcessingPipeline';
import VideoPreview from './components/VideoPreview';
import { VideoFile, ProcessingState, DubbingConfig } from './types';

export default function Home() {
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    step: 'upload',
    progress: 0,
    status: 'idle'
  });
  const [dubbingConfig, setDubbingConfig] = useState<DubbingConfig>({
    sourceLanguage: 'en',
    targetLanguage: 'hi',
    preserveBackground: true,
    voiceCloning: true,
    subtitles: true,
    showOriginalSubtitles: true,
    voiceSpeed: 1.0,
    volumeBalance: {
      voice: 1.0,
      background: 0.8,
      effects: 0.9
    }
  });

  const handleVideoUpload = (file: VideoFile) => {
    setVideoFile(file);
    setProcessingState({
      step: 'configure',
      progress: 0,
      status: 'idle'
    });
  };

  const handleProcessingUpdate = (state: ProcessingState) => {
    setProcessingState(state);
  };

  const handleConfigUpdate = (config: Partial<DubbingConfig>) => {
    setDubbingConfig(prev => ({ ...prev, ...config }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Advanced Video Dubbing Studio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Professional AI-powered video dubbing with voice cloning, background audio preservation,
            and multilingual support for Hindi, Bengali, English and more
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <VideoUpload
              onVideoUpload={handleVideoUpload}
              currentVideo={videoFile}
            />
          </div>

          {/* Processing Pipeline */}
          <div className="lg:col-span-2">
            {videoFile && (
              <ProcessingPipeline
                videoFile={videoFile}
                config={dubbingConfig}
                onConfigUpdate={handleConfigUpdate}
                onProcessingUpdate={handleProcessingUpdate}
                processingState={processingState}
              />
            )}
          </div>
        </div>

        {/* Video Preview */}
        {videoFile && processingState.step !== 'upload' && (
          <div className="mt-8">
            <VideoPreview
              videoFile={videoFile}
              config={dubbingConfig}
              processingState={processingState}
            />
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon="🎙️"
            title="Voice Cloning"
            description="AI-powered voice synthesis matching original character voices"
          />
          <FeatureCard
            icon="🌍"
            title="Multilingual"
            description="Support for Hindi, Bengali, English and 50+ languages"
          />
          <FeatureCard
            icon="🎵"
            title="Audio Separation"
            description="Preserve background music and sound effects"
          />
          <FeatureCard
            icon="📝"
            title="Dual Subtitles"
            description="Show both original and translated subtitles"
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}
