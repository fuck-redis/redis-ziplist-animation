export type Language = 'java' | 'python' | 'go' | 'javascript';
export type SolutionKey = 'iterative' | 'recursive';

export interface VisualNode {
  id: string;
  value: string;
  x: number;
  y: number;
  isNull?: boolean;
  isActive?: boolean;
}

export interface VisualEdge {
  from: string;
  to: string;
  label?: string;
  isRewired?: boolean;
}

export interface PointerMarker {
  name: string;
  targetId: string | null;
  color: string;
}

export interface DataFlowArrow {
  fromId: string | null;
  toId: string | null;
  label: string;
}

export interface StackFrame {
  id: string;
  title: string;
  locals: Record<string, string>;
  state: 'enter' | 'active' | 'return';
}

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  lineMap: Record<Language, number>;
  variables: Record<string, string>;
  nodes: VisualNode[];
  edges: VisualEdge[];
  pointers: PointerMarker[];
  dataFlows: DataFlowArrow[];
  stackFrames: StackFrame[];
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  values: number[];
}
