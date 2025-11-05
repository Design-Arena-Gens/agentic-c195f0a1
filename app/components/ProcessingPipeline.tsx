'use client';

import { useState, useEffect } from 'react';
import { Settings, Play, Download, AlertCircle } from 'lucide-react';
import { VideoFile, ProcessingState, DubbingConfig, SUPPORTED_LANGUAGES } from '../types';
import ConfigPanel from './ConfigPanel';
import ProcessingSteps from './ProcessingSteps';

interface ProcessingPipelineProps {
  videoFile: VideoFile;
  config: DubbingConfig;
  onConfigUpdate: (config: Partial<DubbingConfig>) => void;
  onProcessingUpdate: (state: ProcessingState) => void;
  processingState: ProcessingState;
}

export default function ProcessingPipeline({
  videoFile,
  config,
  onConfigUpdate,
  onProcessingUpdate,
  processingState
}: ProcessingPipelineProps) {
  const [showConfig, setShowConfig] = useState(true);
  const [processingData, setProcessingData] = useState<any>(null);

  const startProcessing = async () => {
    try {
      // Step 1: Audio Extraction
      onProcessingUpdate({
        step: 'extracting',
        progress: 0,
        status: 'processing',
        message: 'Extracting audio tracks...'
      });

      await simulateProcessing(2000);

      // Simulate audio extraction
      const audioTracks = [
        {
          id: 'voice',
          type: 'voice' as const,
          url: videoFile.url,
          volume: config.volumeBalance.voice,
          waveform: generateWaveform()
        },
        {
          id: 'background',
          type: 'background' as const,
          url: videoFile.url,
          volume: config.volumeBalance.background,
          waveform: generateWaveform()
        },
        {
          id: 'effects',
          type: 'effects' as const,
          url: videoFile.url,
          volume: config.volumeBalance.effects,
          waveform: generateWaveform()
        }
      ];

      onProcessingUpdate({
        step: 'extracting',
        progress: 100,
        status: 'complete',
        message: 'Audio tracks extracted successfully',
        data: { audioTracks }
      });

      await simulateProcessing(1000);

      // Step 2: Transcription
      onProcessingUpdate({
        step: 'transcribing',
        progress: 0,
        status: 'processing',
        message: 'Transcribing audio...'
      });

      await simulateProcessing(3000);

      const transcription = {
        segments: generateTranscriptionSegments(videoFile.duration),
        language: config.sourceLanguage
      };

      onProcessingUpdate({
        step: 'transcribing',
        progress: 100,
        status: 'complete',
        message: 'Transcription complete',
        data: { audioTracks, transcription }
      });

      await simulateProcessing(1000);

      // Step 3: Translation
      onProcessingUpdate({
        step: 'translating',
        progress: 0,
        status: 'processing',
        message: 'Translating text...'
      });

      await simulateProcessing(2000);

      const translation = {
        segments: transcription.segments.map(seg => ({
          id: seg.id,
          originalText: seg.text,
          translatedText: translateText(seg.text, config.sourceLanguage, config.targetLanguage),
          start: seg.start,
          end: seg.end,
          speaker: seg.speaker
        })),
        sourceLanguage: config.sourceLanguage,
        targetLanguage: config.targetLanguage
      };

      onProcessingUpdate({
        step: 'translating',
        progress: 100,
        status: 'complete',
        message: 'Translation complete',
        data: { audioTracks, transcription, translation }
      });

      await simulateProcessing(1000);

      // Step 4: Voice Synthesis
      onProcessingUpdate({
        step: 'synthesizing',
        progress: 0,
        status: 'processing',
        message: 'Synthesizing dubbed voice with cloning...'
      });

      await simulateProcessing(4000);

      onProcessingUpdate({
        step: 'synthesizing',
        progress: 100,
        status: 'complete',
        message: 'Voice synthesis complete',
        data: {
          audioTracks,
          transcription,
          translation,
          synthesizedAudio: videoFile.url
        }
      });

      await simulateProcessing(1000);

      // Step 5: Audio Mixing
      onProcessingUpdate({
        step: 'mixing',
        progress: 0,
        status: 'processing',
        message: 'Mixing audio tracks and generating final video...'
      });

      await simulateProcessing(3000);

      onProcessingUpdate({
        step: 'complete',
        progress: 100,
        status: 'complete',
        message: 'Dubbing complete!',
        data: {
          audioTracks,
          transcription,
          translation,
          synthesizedAudio: videoFile.url,
          finalVideo: videoFile.url
        }
      });

      setProcessingData({
        audioTracks,
        transcription,
        translation,
        synthesizedAudio: videoFile.url,
        finalVideo: videoFile.url
      });

    } catch (error) {
      onProcessingUpdate({
        step: processingState.step,
        progress: processingState.progress,
        status: 'error',
        message: 'Processing failed. Please try again.'
      });
    }
  };

  const simulateProcessing = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Configuration
          </h2>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            {showConfig ? 'Hide' : 'Show'}
          </button>
        </div>

        {showConfig && (
          <ConfigPanel config={config} onConfigUpdate={onConfigUpdate} />
        )}

        {processingState.step === 'configure' && (
          <button
            onClick={startProcessing}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Start Dubbing Process
          </button>
        )}
      </div>

      {/* Processing Steps */}
      {processingState.step !== 'upload' && processingState.step !== 'configure' && (
        <ProcessingSteps processingState={processingState} />
      )}

      {/* Download Section */}
      {processingState.status === 'complete' && processingState.step === 'complete' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 rounded-full p-2">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                Dubbing Complete!
              </h3>
              <p className="text-green-600 dark:text-green-300 text-sm">
                Your video has been successfully dubbed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Download className="w-5 h-5" />
              Download Dubbed Video
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Download className="w-5 h-5" />
              Download Subtitles (SRT)
            </button>
          </div>

          <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-semibold">
              Processing Summary:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>✓ Audio tracks separated and preserved</li>
              <li>✓ Voice cloned and synthesized in {SUPPORTED_LANGUAGES.find(l => l.code === config.targetLanguage)?.name}</li>
              <li>✓ Background audio and effects preserved</li>
              <li>✓ Dual subtitles generated (original + translated)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function generateWaveform(): number[] {
  return Array.from({ length: 100 }, () => Math.random() * 100);
}

function generateTranscriptionSegments(duration: number) {
  const segments = [];
  const numSegments = Math.floor(duration / 3);

  const sampleTexts = [
    "Welcome to our presentation.",
    "Today we'll discuss important topics.",
    "Let's begin with the introduction.",
    "This is a significant point to consider.",
    "We'll explore various aspects of this subject.",
    "Thank you for your attention."
  ];

  for (let i = 0; i < Math.min(numSegments, 10); i++) {
    segments.push({
      id: `seg-${i}`,
      start: i * 3,
      end: (i + 1) * 3,
      text: sampleTexts[i % sampleTexts.length],
      speaker: i % 2 === 0 ? 'Speaker 1' : 'Speaker 2',
      confidence: 0.9 + Math.random() * 0.1
    });
  }

  return segments;
}

function translateText(text: string, from: string, to: string): string {
  // Simulated translations
  const translations: Record<string, Record<string, string>> = {
    hi: {
      "Welcome to our presentation.": "हमारी प्रस्तुति में आपका स्वागत है।",
      "Today we'll discuss important topics.": "आज हम महत्वपूर्ण विषयों पर चर्चा करेंगे।",
      "Let's begin with the introduction.": "आइए परिचय से शुरू करें।",
      "This is a significant point to consider.": "यह विचार करने के लिए एक महत्वपूर्ण बिंदु है।",
      "We'll explore various aspects of this subject.": "हम इस विषय के विभिन्न पहलुओं का पता लगाएंगे।",
      "Thank you for your attention.": "आपके ध्यान के लिए धन्यवाद।"
    },
    bn: {
      "Welcome to our presentation.": "আমাদের উপস্থাপনায় আপনাকে স্বাগতম।",
      "Today we'll discuss important topics.": "আজ আমরা গুরুত্বপূর্ণ বিষয় নিয়ে আলোচনা করব।",
      "Let's begin with the introduction.": "চলুন ভূমিকা দিয়ে শুরু করি।",
      "This is a significant point to consider.": "এটি বিবেচনা করার জন্য একটি গুরুত্বপূর্ণ পয়েন্ট।",
      "We'll explore various aspects of this subject.": "আমরা এই বিষয়ের বিভিন্ন দিক অন্বেষণ করব।",
      "Thank you for your attention.": "আপনার মনোযোগের জন্য ধন্যবাদ।"
    }
  };

  return translations[to]?.[text] || `[${to.toUpperCase()}] ${text}`;
}
