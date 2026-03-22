import { useEffect, useMemo, useState } from 'react';
import { buildSteps } from '@/algorithms/reverseLinkedList/steps';
import LinkedListCanvas from '@/components/canvas/LinkedListCanvas';
import CodePanel from '@/components/code/CodePanel';
import PlaybackControls from '@/components/control/PlaybackControls';
import { usePersistentPreference } from '@/hooks/usePersistentPreference';
import { Language, SolutionKey } from '@/types/demo';
import './SolutionWorkspace.css';

interface SolutionWorkspaceProps {
  solution: SolutionKey;
  values: number[];
}

function SolutionWorkspace({ solution, values }: SolutionWorkspaceProps) {
  const { value: language, setValue: setLanguage } = usePersistentPreference<Language>('pref-language', 'java');
  const { value: speed, setValue: setSpeed } = usePersistentPreference<number>('pref-speed', 1);
  const steps = useMemo(() => buildSteps(values, solution), [values, solution]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queryHydrated, setQueryHydrated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepFromQuery = Number(params.get('step'));
    if (Number.isInteger(stepFromQuery) && stepFromQuery >= 0 && stepFromQuery < steps.length) {
      setCurrentStep(stepFromQuery);
    } else {
      setCurrentStep(0);
    }
    setIsPlaying(false);
    setQueryHydrated(true);
  }, [steps]);

  useEffect(() => {
    if (!queryHydrated) {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('step', String(currentStep));
    window.history.replaceState(null, '', url.toString());
  }, [currentStep, queryHydrated]);

  useEffect(() => {
    if (!isPlaying || steps.length <= 1) {
      return;
    }
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, Math.max(120, 900 / speed));

    return () => window.clearTimeout(timer);
  }, [currentStep, isPlaying, speed, steps.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIsPlaying(false);
        setCurrentStep((prev) => Math.max(0, prev - 1));
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setIsPlaying(false);
        setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
      } else if (event.key === ' ') {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        setIsPlaying(false);
        setCurrentStep(0);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steps.length]);

  const step = steps[Math.min(currentStep, steps.length - 1)] ?? steps[0];

  if (!step) {
    return null;
  }

  const shareCurrentState = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('data', values.join(','));
    url.searchParams.set('step', String(currentStep));
    try {
      await navigator.clipboard.writeText(url.toString());
      window.alert('分享链接已复制到剪贴板');
    } catch {
      window.prompt('复制此分享链接', url.toString());
    }
  };

  return (
    <section className="workspace">
      <div className="workspace-canvas">
        <LinkedListCanvas step={step} stepIndex={currentStep} stepCount={steps.length} />
      </div>

      <aside className="workspace-side">
        <div className="side-top">
          <CodePanel
            solution={solution}
            language={language}
            onLanguageChange={setLanguage}
            step={step}
          />
        </div>
        <div className="side-bottom">
          <PlaybackControls
            stepCount={steps.length}
            currentStep={currentStep}
            isPlaying={isPlaying}
            speed={speed}
            onPrev={() => {
              setIsPlaying(false);
              setCurrentStep((prev) => Math.max(0, prev - 1));
            }}
            onNext={() => {
              setIsPlaying(false);
              setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
            }}
            onTogglePlay={() => setIsPlaying((prev) => !prev)}
            onReset={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            onSeek={(idx) => {
              setIsPlaying(false);
              setCurrentStep(idx);
            }}
            onSpeedChange={setSpeed}
            onShare={shareCurrentState}
          />

          <div className="vars-panel">
            <h4>变量快照</h4>
            <div className="vars-grid">
              {Object.entries(step.variables).map(([k, v]) => (
                <div key={k} className="var-item">
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}

export default SolutionWorkspace;
