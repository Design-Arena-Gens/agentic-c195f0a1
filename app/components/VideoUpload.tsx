'use client';

import { useRef, useState } from 'react';
import { Upload, Video, X } from 'lucide-react';
import { VideoFile } from '../types';

interface VideoUploadProps {
  onVideoUpload: (file: VideoFile) => void;
  currentVideo: VideoFile | null;
}

export default function VideoUpload({ onVideoUpload, currentVideo }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }

    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;

    video.onloadedmetadata = () => {
      onVideoUpload({
        file,
        url,
        duration: video.duration,
        size: file.size,
        name: file.name
      });
    };
  };

  const handleRemove = () => {
    if (currentVideo) {
      URL.revokeObjectURL(currentVideo.url);
    }
    onVideoUpload(null as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Upload Video
      </h2>

      {!currentVideo ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Drop your video here
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supports MP4, MOV, AVI, WebM (Max 500MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              src={currentVideo.url}
              className="w-full rounded-lg"
              controls
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {currentVideo.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="ml-2 text-gray-700 dark:text-gray-200">
                  {formatDuration(currentVideo.duration)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Size:</span>
                <span className="ml-2 text-gray-700 dark:text-gray-200">
                  {formatFileSize(currentVideo.size)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
