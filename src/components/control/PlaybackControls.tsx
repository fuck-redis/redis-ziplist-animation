import { useMemo, useRef } from 'react';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  stepCount: number;
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSeek: (index: number) => void;
  onSpeedChange: (speed: number) => void;
  onShare: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function PlaybackControls({
  stepCount,
  currentStep,
  isPlaying,
  speed,
  onPrev,
  onNext,
  onTogglePlay,
  onReset,
  onSeek,
  onSpeedChange,
  onShare,
}: PlaybackControlsProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const progress = useMemo(() => {
    if (stepCount <= 1) {
      return 0;
    }
    return (currentStep / (stepCount - 1)) * 100;
  }, [currentStep, stepCount]);

  const seekByClientX = (clientX: number) => {
    if (!trackRef.current || stepCount <= 1) {
      return;
    }
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const index = Math.round(ratio * (stepCount - 1));
    onSeek(index);
  };

  const startDrag = (clientX: number) => {
    seekByClientX(clientX);
    const handleMove = (event: MouseEvent) => seekByClientX(event.clientX);
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <section className="playback-panel">
      <div className="control-buttons">
        <button type="button" onClick={onPrev} disabled={currentStep <= 0}>
          上一步 (←)
        </button>
        <button type="button" onClick={onNext} disabled={currentStep >= stepCount - 1}>
          下一步 (→)
        </button>
        <button type="button" onClick={onTogglePlay}>
          {isPlaying ? '暂停 (Space)' : '播放 (Space)'}
        </button>
        <button type="button" onClick={onReset}>
          重置 (R)
        </button>
        <button type="button" onClick={onShare}>
          复制分享链接
        </button>
      </div>

      <div className="speed-row">
        <span>播放速度</span>
        <div className="speed-buttons">
          {SPEED_OPTIONS.map((item) => (
            <button
              key={String(item)}
              type="button"
              className={item === speed ? 'speed-btn active' : 'speed-btn'}
              onClick={() => onSpeedChange(item)}
            >
              {item.toFixed(1)}x
            </button>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        className="progress-track"
        onMouseDown={(e) => startDrag(e.clientX)}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={stepCount - 1}
        aria-valuenow={currentStep}
      >
        <div className="progress-played" style={{ width: progress + '%' }} />
        <div className="progress-thumb" style={{ left: progress + '%' }} />
      </div>
    </section>
  );
}

export default PlaybackControls;
