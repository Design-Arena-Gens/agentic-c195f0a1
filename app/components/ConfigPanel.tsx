'use client';

import { Globe, Volume2, Subtitles, Mic } from 'lucide-react';
import { DubbingConfig, SUPPORTED_LANGUAGES } from '../types';

interface ConfigPanelProps {
  config: DubbingConfig;
  onConfigUpdate: (config: Partial<DubbingConfig>) => void;
}

export default function ConfigPanel({ config, onConfigUpdate }: ConfigPanelProps) {
  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            <Globe className="w-4 h-4" />
            Source Language
          </label>
          <select
            value={config.sourceLanguage}
            onChange={(e) => onConfigUpdate({ sourceLanguage: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            <Globe className="w-4 h-4" />
            Target Language
          </label>
          <select
            value={config.targetLanguage}
            onChange={(e) => onConfigUpdate({ targetLanguage: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Voice Cloning</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Match original voice characteristics</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.voiceCloning}
              onChange={(e) => onConfigUpdate({ voiceCloning: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Preserve Background</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Keep music & sound effects</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.preserveBackground}
              onChange={(e) => onConfigUpdate({ preserveBackground: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <Subtitles className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Generate Subtitles</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add translated subtitles</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.subtitles}
              onChange={(e) => onConfigUpdate({ subtitles: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <Subtitles className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Original Subtitles</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Show original text too</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showOriginalSubtitles}
              onChange={(e) => onConfigUpdate({ showOriginalSubtitles: e.target.checked })}
              disabled={!config.subtitles}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600 peer-disabled:opacity-50"></div>
          </label>
        </div>
      </div>

      {/* Voice Speed Control */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Voice Speed: {config.voiceSpeed.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={config.voiceSpeed}
          onChange={(e) => onConfigUpdate({ voiceSpeed: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0.5x (Slower)</span>
          <span>1.0x (Normal)</span>
          <span>2.0x (Faster)</span>
        </div>
      </div>

      {/* Volume Balance */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          Volume Balance
        </h3>

        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300 mb-1 block">
            Dubbed Voice: {Math.round(config.volumeBalance.voice * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.volumeBalance.voice}
            onChange={(e) => onConfigUpdate({
              volumeBalance: { ...config.volumeBalance, voice: parseFloat(e.target.value) }
            })}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300 mb-1 block">
            Background Music: {Math.round(config.volumeBalance.background * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.volumeBalance.background}
            onChange={(e) => onConfigUpdate({
              volumeBalance: { ...config.volumeBalance, background: parseFloat(e.target.value) }
            })}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300 mb-1 block">
            Sound Effects: {Math.round(config.volumeBalance.effects * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.volumeBalance.effects}
            onChange={(e) => onConfigUpdate({
              volumeBalance: { ...config.volumeBalance, effects: parseFloat(e.target.value) }
            })}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
