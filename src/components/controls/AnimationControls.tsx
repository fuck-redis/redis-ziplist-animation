import { AnimationState } from '@/hooks/useAnimationControl';
import './AnimationControls.css';

interface AnimationControlsProps {
  animationState: AnimationState;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onGoToStep: (step: number) => void;
}

function AnimationControls({
  animationState,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  onSpeedChange,
  onGoToStep,
}: AnimationControlsProps) {
  const { steps, currentStep, isPlaying, speed } = animationState;
  const hasSteps = steps.length > 0;
  const canGoPrev = currentStep > 0;
  const canGoNext = currentStep < steps.length - 1;

  const speedOptions = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 1.0, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2.0, label: '2x' },
  ];

  return (
    <div className="animation-controls">
      <div className="controls-header">
        <h3 className="controls-title">🎬 动画控制</h3>
        {hasSteps && (
          <div className="step-indicator">
            步骤 {currentStep + 1} / {steps.length}
          </div>
        )}
      </div>

      {hasSteps ? (
        <>
          {/* 当前步骤描述 */}
          {currentStep >= 0 && currentStep < steps.length && (
            <div className="current-step-info">
              <div className="step-description">
                {steps[currentStep].description}
              </div>
              <div className="step-meta">
                <span className="step-type">{steps[currentStep].type}</span>
                <span className="step-duration">{steps[currentStep].duration}ms</span>
              </div>
            </div>
          )}

          {/* 进度条 */}
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <div className="progress-steps">
              {steps.map((_, index) => (
                <button
                  key={index}
                  className={`progress-step ${index === currentStep ? 'active' : ''} ${
                    index < currentStep ? 'completed' : ''
                  }`}
                  onClick={() => onGoToStep(index)}
                  title={`步骤 ${index + 1}: ${steps[index].description}`}
                />
              ))}
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="control-buttons">
            <button
              className="control-btn"
              onClick={onReset}
              disabled={currentStep === 0}
              title="重置到开始"
            >
              ⏮️ 重置
            </button>

            <button
              className="control-btn"
              onClick={onPrevStep}
              disabled={!canGoPrev || isPlaying}
              title="上一步"
            >
              ⏪ 上一步
            </button>

            <button
              className="control-btn primary"
              onClick={onTogglePlay}
              disabled={!canGoNext && !isPlaying}
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
            </button>

            <button
              className="control-btn"
              onClick={onNextStep}
              disabled={!canGoNext || isPlaying}
              title="下一步"
            >
              下一步 ⏩
            </button>
          </div>

          {/* 速度控制 */}
          <div className="speed-control">
            <label className="speed-label">播放速度:</label>
            <div className="speed-buttons">
              {speedOptions.map(option => (
                <button
                  key={option.value}
                  className={`speed-btn ${speed === option.value ? 'active' : ''}`}
                  onClick={() => onSpeedChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="no-animation">
          <p>暂无动画</p>
          <p className="hint">执行插入或删除操作后会生成动画步骤</p>
        </div>
      )}
    </div>
  );
}

export default AnimationControls;
