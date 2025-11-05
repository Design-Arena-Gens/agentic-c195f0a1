export interface VideoFile {
  file: File;
  url: string;
  duration: number;
  size: number;
  name: string;
}

export interface ProcessingState {
  step: 'upload' | 'configure' | 'extracting' | 'transcribing' | 'translating' | 'synthesizing' | 'mixing' | 'complete';
  progress: number;
  status: 'idle' | 'processing' | 'complete' | 'error';
  message?: string;
  data?: ProcessingData;
}

export interface ProcessingData {
  audioTracks?: AudioTrack[];
  transcription?: Transcription;
  translation?: Translation;
  synthesizedAudio?: string;
  finalVideo?: string;
}

export interface AudioTrack {
  id: string;
  type: 'voice' | 'background' | 'effects';
  url: string;
  volume: number;
  waveform?: number[];
}

export interface Transcription {
  segments: TranscriptionSegment[];
  language: string;
}

export interface TranscriptionSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence?: number;
}

export interface Translation {
  segments: TranslationSegment[];
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationSegment {
  id: string;
  originalText: string;
  translatedText: string;
  start: number;
  end: number;
  speaker?: string;
}

export interface DubbingConfig {
  sourceLanguage: string;
  targetLanguage: string;
  preserveBackground: boolean;
  voiceCloning: boolean;
  subtitles: boolean;
  showOriginalSubtitles: boolean;
  voiceSpeed: number;
  volumeBalance: {
    voice: number;
    background: number;
    effects: number;
  };
}

export interface Subtitle {
  start: number;
  end: number;
  text: string;
  originalText?: string;
}

export interface VoiceProfile {
  id: string;
  speaker: string;
  sampleAudio: string;
  characteristics: {
    pitch: number;
    speed: number;
    tone: string;
  };
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
];
