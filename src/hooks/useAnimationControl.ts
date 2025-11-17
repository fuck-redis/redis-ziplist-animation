import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimationStep } from '@/types/ziplist';

export interface AnimationState {
  steps: AnimationStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number; // 1.0 = normal, 0.5 = slow, 2.0 = fast
}

export function useAnimationControl() {
  const [animationState, setAnimationState] = useState<AnimationState>({
    steps: [],
    currentStep: -1,
    isPlaying: false,
    speed: 1.0,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 设置动画步骤
  const setSteps = useCallback((steps: AnimationStep[]) => {
    setAnimationState(prev => ({
      ...prev,
      steps,
      currentStep: steps.length > 0 ? 0 : -1,
      isPlaying: false,
    }));
  }, []);

  // 播放下一步
  const playNextStep = useCallback(() => {
    setAnimationState(prev => {
      if (prev.currentStep >= prev.steps.length - 1) {
        return { ...prev, isPlaying: false };
      }

      const nextStep = prev.currentStep + 1;
      const step = prev.steps[nextStep];

      if (prev.isPlaying) {
        timeoutRef.current = setTimeout(() => {
          playNextStep();
        }, step.duration / prev.speed);
      }

      return {
        ...prev,
        currentStep: nextStep,
      };
    });
  }, []);

  // 播放/暂停
  const togglePlay = useCallback(() => {
    setAnimationState(prev => {
      const newIsPlaying = !prev.isPlaying;

      if (newIsPlaying && prev.currentStep < prev.steps.length - 1) {
        // 开始播放
        const nextStep = prev.currentStep + 1;
        const step = prev.steps[nextStep];
        
        timeoutRef.current = setTimeout(() => {
          playNextStep();
        }, step.duration / prev.speed);

        return {
          ...prev,
          isPlaying: true,
          currentStep: nextStep,
        };
      } else if (!newIsPlaying && timeoutRef.current) {
        // 暂停
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      return { ...prev, isPlaying: newIsPlaying };
    });
  }, [playNextStep]);

  // 下一步
  const nextStep = useCallback(() => {
    setAnimationState(prev => {
      if (prev.currentStep >= prev.steps.length - 1) {
        return prev;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      return {
        ...prev,
        currentStep: prev.currentStep + 1,
        isPlaying: false,
      };
    });
  }, []);

  // 上一步
  const prevStep = useCallback(() => {
    setAnimationState(prev => {
      if (prev.currentStep <= 0) {
        return prev;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      return {
        ...prev,
        currentStep: prev.currentStep - 1,
        isPlaying: false,
      };
    });
  }, []);

  // 重置
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setAnimationState(prev => ({
      ...prev,
      currentStep: prev.steps.length > 0 ? 0 : -1,
      isPlaying: false,
    }));
  }, []);

  // 设置速度
  const setSpeed = useCallback((speed: number) => {
    setAnimationState(prev => ({ ...prev, speed }));
  }, []);

  // 跳转到指定步骤
  const goToStep = useCallback((step: number) => {
    setAnimationState(prev => {
      if (step < 0 || step >= prev.steps.length) {
        return prev;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      return {
        ...prev,
        currentStep: step,
        isPlaying: false,
      };
    });
  }, []);

  return {
    animationState,
    setSteps,
    togglePlay,
    nextStep,
    prevStep,
    reset,
    setSpeed,
    goToStep,
  };
}
