export const theme = {
  colors: {
    background: '#F8FAFC',
    backgroundLight: '#FFFFFF',
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    secondary: '#06B6D4',
    accent: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    text: '#1E293B',
    textMuted: '#64748B',
    border: '#E2E8F0',
    byteHeader: '#06B6D4',
    byteEntry: '#3B82F6',
    byteEnd: '#EF4444',
    highlight: '#F59E0B',
  },
  fonts: {
    mono: 'JetBrains Mono, Consolas, monospace',
    sans: 'Inter, system-ui, sans-serif',
  },
  spacing: (n: number) => `${n * 8}px`,
};

export const animations = {
  fadeIn: (frame: number, start: number = 0) => ({
    opacity: Math.min(1, Math.max(0, (frame - start) / 15)),
  }),
  slideUp: (frame: number, start: number = 0) => ({
    transform: `translateY(${Math.max(0, 50 - (frame - start) * 3)}px)`,
    opacity: Math.min(1, Math.max(0, (frame - start) / 15)),
  }),
  scaleIn: (frame: number, start: number = 0) => ({
    transform: `scale(${Math.min(1, 0.5 + (frame - start) * 0.03)})`,
    opacity: Math.min(1, Math.max(0, (frame - start) / 15)),
  }),
};
