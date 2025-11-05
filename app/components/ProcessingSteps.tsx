'use client';

import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { ProcessingState } from '../types';

interface ProcessingStepsProps {
  processingState: ProcessingState;
}

const STEPS = [
  { key: 'extracting', label: 'Audio Extraction', description: 'Separating voice, music, and effects' },
  { key: 'transcribing', label: 'Transcription', description: 'Converting speech to text' },
  { key: 'translating', label: 'Translation', description: 'Translating to target language' },
  { key: 'synthesizing', label: 'Voice Synthesis', description: 'Cloning voice and generating dubbed audio' },
  { key: 'mixing', label: 'Audio Mixing', description: 'Combining all audio tracks' },
  { key: 'complete', label: 'Complete', description: 'Video ready for download' }
];

export default function ProcessingSteps({ processingState }: ProcessingStepsProps) {
  const currentStepIndex = STEPS.findIndex(s => s.key === processingState.step);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Processing Pipeline
      </h2>

      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const isComplete = index < currentStepIndex || (index === currentStepIndex && processingState.status === 'complete');
          const isCurrent = index === currentStepIndex && processingState.status === 'processing';
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.key}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                isCurrent
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                  : isComplete
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                  : 'bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {isCurrent ? (
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                ) : isComplete ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${
                  isCurrent ? 'text-blue-700 dark:text-blue-300' :
                  isComplete ? 'text-green-700 dark:text-green-300' :
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>

                {isCurrent && processingState.message && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    {processingState.message}
                  </p>
                )}

                {isCurrent && processingState.progress > 0 && processingState.progress < 100 && (
                  <div className="mt-3">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${processingState.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {processingState.progress}% complete
                    </p>
                  </div>
                )}
              </div>

              {isComplete && (
                <div className="flex-shrink-0">
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded">
                    Done
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">
                    In Progress
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {processingState.status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg">
          <p className="text-red-700 dark:text-red-300 font-semibold">
            ⚠️ {processingState.message || 'An error occurred during processing'}
          </p>
        </div>
      )}
    </div>
  );
}
