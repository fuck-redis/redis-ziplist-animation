declare module '@remotion/video' {
  export const AbsoluteFill: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }>;
  export function spring(props: { frame: number; fps: number; config?: { damping?: number; stiffness?: number } }): number;
  export function useCurrentFrame(): number;
  export function useVideoConfig(): { fps: number };
  export function interpolate(frame: number, input: number[], output: number[], options?: { extrapolate?: 'clamp' | 'extend' | 'identity' }): number;
}

declare module '@remotion/player' {
  import { ComponentType } from 'react';
  export interface PlayerRef {
    play: () => void;
    pause: () => void;
  }
  export interface PlayerProps {
    component: ComponentType<any>;
    durationInFrames: number;
    fps: number;
    compositionWidth?: number;
    compositionHeight?: number;
    style?: React.CSSProperties;
    controls?: boolean;
    loop?: boolean;
  }
  export const Player: React.FC<PlayerProps>;
}
