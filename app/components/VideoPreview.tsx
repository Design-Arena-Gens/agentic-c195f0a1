'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { VideoFile, ProcessingState, DubbingConfig } from '../types';

interface VideoPreviewProps {
  videoFile: VideoFile;
  config: DubbingConfig;
  processingState: ProcessingState;
}

export default function VideoPreview({ videoFile, config, processingState }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<any>(null);

  // Sample subtitles for demo
  const subtitles = [
    { start: 0, end: 3, original: "Welcome to our presentation.", translated: "हमारी प्रस्तुति में आपका स्वागत है।" },
    { start: 3, end: 6, original: "Today we'll discuss important topics.", translated: "आज हम महत्वपूर्ण विषयों पर चर्चा करेंगे।" },
    { start: 6, end: 9, original: "Let's begin with the introduction.", translated: "आइए परिचय से शुरू करें।" },
    { start: 9, end: 12, original: "This is a significant point to consider.", translated: "यह विचार करने के लिए एक महत्वपूर्ण बिंदु है।" },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    if (config.subtitles) {
      const subtitle = subtitles.find(
        s => currentTime >= s.start && currentTime <= s.end
      );
      setCurrentSubtitle(subtitle);
    } else {
      setCurrentSubtitle(null);
    }
  }, [currentTime, config.subtitles]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Video Preview
        </h2>
        {processingState.status === 'complete' && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
            ✓ Dubbed
          </span>
        )}
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoFile.url}
          className="w-full aspect-video"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Subtitles Overlay */}
        {currentSubtitle && config.subtitles && (
          <div className="absolute bottom-16 left-0 right-0 px-4">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 max-w-3xl mx-auto">
              {config.showOriginalSubtitles && (
                <p className="text-gray-300 text-sm text-center mb-1">
                  {currentSubtitle.original}
                </p>
              )}
              <p className="text-white text-lg font-semibold text-center">
                {currentSubtitle.translated}
              </p>
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-3"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
            }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              {/* Time */}
              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Audio Tracks Visualization */}
      {processingState.data?.audioTracks && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Audio Tracks
          </h3>
          {processingState.data.audioTracks.map((track: any) => (
            <div key={track.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
                  {track.type} Track
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Volume: {Math.round(track.volume * 100)}%
                </span>
              </div>
              <div className="h-12 bg-gray-200 dark:bg-slate-600 rounded flex items-end gap-0.5 px-2">
                {track.waveform?.slice(0, 50).map((amplitude: number, i: number) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t ${
                      track.type === 'voice' ? 'bg-blue-500' :
                      track.type === 'background' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}
                    style={{ height: `${amplitude}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transcription Preview */}
      {processingState.data?.transcription && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Transcription
          </h3>
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
            {processingState.data.transcription.segments.map((segment: any) => (
              <div key={segment.id} className="text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-mono">
                  [{formatTime(segment.start)} - {formatTime(segment.end)}]
                </span>
                <span className="ml-2 text-gray-700 dark:text-gray-200">
                  {segment.text}
                </span>
                {segment.speaker && (
                  <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">
                    ({segment.speaker})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Translation Preview */}
      {processingState.data?.translation && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Translation
          </h3>
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto space-y-3">
            {processingState.data.translation.segments.map((segment: any) => (
              <div key={segment.id} className="text-sm border-l-4 border-blue-500 pl-3">
                <p className="text-gray-500 dark:text-gray-400 italic">
                  {segment.originalText}
                </p>
                <p className="text-gray-700 dark:text-gray-200 font-medium mt-1">
                  {segment.translatedText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
