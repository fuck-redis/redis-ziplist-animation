import {
  DataFlowArrow,
  DemoStep,
  Language,
  PointerMarker,
  SolutionKey,
  StackFrame,
  VisualEdge,
  VisualNode,
} from '@/types/demo';

type LineMap = Record<Language, number>;

const NODE_SPACING = 140;
const NODE_Y = 200;
const NODE_START_X = 120;

function nodeRef(values: number[], idx: number | null): string {
  if (idx === null || idx < 0 || idx >= values.length) {
    return 'null';
  }
  return String(values[idx]) + '@' + String(idx);
}

function nodeId(idx: number | null): string {
  return idx === null ? 'null' : 'n' + String(idx);
}

function createNodes(values: number[], active: number[] = []): VisualNode[] {
  const nodes: VisualNode[] = values.map((value, idx) => ({
    id: 'n' + String(idx),
    value: String(value),
    x: NODE_START_X + idx * NODE_SPACING,
    y: NODE_Y,
    isActive: active.includes(idx),
  }));

  nodes.push({
    id: 'null',
    value: 'null',
    x: NODE_START_X + values.length * NODE_SPACING,
    y: NODE_Y,
    isNull: true,
  });

  return nodes;
}

function createEdges(nextMap: Array<number | null>, rewiredFrom?: number): VisualEdge[] {
  return nextMap.map((to, from) => ({
    from: 'n' + String(from),
    to: to === null ? 'null' : 'n' + String(to),
    label: 'next',
    isRewired: rewiredFrom === from,
  }));
}

function makePointers(items: Array<[string, number | null, string]>): PointerMarker[] {
  return items.map(([name, targetId, color]) => ({
    name,
    targetId: targetId === null ? 'null' : 'n' + String(targetId),
    color,
  }));
}

function vars(values: number[], pairs: Array<[string, number | null]>): Record<string, string> {
  return Object.fromEntries(pairs.map(([k, idx]) => [k, nodeRef(values, idx)]));
}

function cloneStack(stack: StackFrame[]): StackFrame[] {
  return stack.map((item) => ({
    ...item,
    locals: { ...item.locals },
  }));
}

function lineMap(java: number, python: number, go: number, javascript: number): LineMap {
  return { java, python, go, javascript };
}

const ITER_LINES = {
  init: lineMap(3, 3, 2, 2),
  setCurr: lineMap(4, 4, 3, 3),
  saveNext: lineMap(6, 6, 5, 5),
  rewire: lineMap(7, 7, 6, 6),
  movePrev: lineMap(8, 8, 7, 7),
  moveCurr: lineMap(9, 9, 8, 8),
  done: lineMap(11, 10, 10, 10),
};

const REC_LINES = {
  condition: lineMap(3, 3, 2, 2),
  call: lineMap(6, 5, 5, 5),
  rewire: lineMap(7, 6, 6, 6),
  breakOld: lineMap(8, 7, 7, 7),
  ret: lineMap(9, 8, 8, 8),
};

export function buildSteps(values: number[], solution: SolutionKey): DemoStep[] {
  if (solution === 'recursive') {
    return buildRecursiveSteps(values);
  }
  return buildIterativeSteps(values);
}

function buildIterativeSteps(values: number[]): DemoStep[] {
  if (values.length === 0) {
    return [
      {
        id: 'iter-empty',
        title: '空链表',
        description: '输入为空，直接返回 null。',
        lineMap: ITER_LINES.done,
        variables: { head: 'null', prev: 'null', curr: 'null' },
        nodes: createNodes(values),
        edges: [],
        pointers: makePointers([
          ['head', null, '#2563eb'],
          ['prev', null, '#d97706'],
          ['curr', null, '#16a34a'],
        ]),
        dataFlows: [],
        stackFrames: [],
      },
    ];
  }

  const steps: DemoStep[] = [];
  const nextMap: Array<number | null> = values.map((_, idx) => (idx + 1 < values.length ? idx + 1 : null));

  let prev: number | null = null;
  let curr: number | null = 0;
  let next: number | null = null;

  const pushStep = (
    id: string,
    title: string,
    description: string,
    lines: LineMap,
    active: number[],
    rewiredFrom?: number,
    flows: DataFlowArrow[] = []
  ) => {
    steps.push({
      id,
      title,
      description,
      lineMap: lines,
      variables: vars(values, [
        ['head', 0],
        ['prev', prev],
        ['curr', curr],
        ['next', next],
      ]),
      nodes: createNodes(values, active),
      edges: createEdges(nextMap, rewiredFrom),
      pointers: makePointers([
        ['head', 0, '#2563eb'],
        ['prev', prev, '#d97706'],
        ['curr', curr, '#16a34a'],
        ['next', next, '#dc2626'],
      ]),
      dataFlows: flows,
      stackFrames: [],
    });
  };

  pushStep('iter-init-1', '初始化 prev', 'prev = null', ITER_LINES.init, []);
  pushStep('iter-init-2', '初始化 curr', 'curr = head', ITER_LINES.setCurr, [0]);

  let round = 0;
  while (curr !== null) {
    round += 1;
    next = nextMap[curr];
    pushStep(
      'iter-' + String(round) + '-save-next',
      '第 ' + String(round) + ' 轮：保存 next',
      '先保存 curr.next，避免断链。',
      ITER_LINES.saveNext,
      [curr],
      undefined,
      [{ fromId: nodeId(curr), toId: nodeId(next), label: 'next = curr.next' }]
    );

    nextMap[curr] = prev;
    pushStep(
      'iter-' + String(round) + '-rewire',
      '第 ' + String(round) + ' 轮：反转指针',
      '执行 curr.next = prev，完成当前节点反转。',
      ITER_LINES.rewire,
      [curr],
      curr,
      [{ fromId: nodeId(curr), toId: nodeId(prev), label: 'curr.next -> prev' }]
    );

    prev = curr;
    pushStep(
      'iter-' + String(round) + '-move-prev',
      '第 ' + String(round) + ' 轮：移动 prev',
      'prev = curr，prev 向前推进。',
      ITER_LINES.movePrev,
      [prev]
    );

    curr = next;
    pushStep(
      'iter-' + String(round) + '-move-curr',
      '第 ' + String(round) + ' 轮：移动 curr',
      'curr = next，进入下一轮。',
      ITER_LINES.moveCurr,
      curr === null ? [] : [curr]
    );
  }

  pushStep('iter-done', '返回结果', '循环结束，返回 prev 作为新头结点。', ITER_LINES.done, prev === null ? [] : [prev]);

  return steps;
}

function buildRecursiveSteps(values: number[]): DemoStep[] {
  if (values.length === 0) {
    return [
      {
        id: 'rec-empty',
        title: '空链表',
        description: '输入为空，递归基直接返回 null。',
        lineMap: REC_LINES.condition,
        variables: { head: 'null', newHead: 'null' },
        nodes: createNodes(values),
        edges: [],
        pointers: makePointers([
          ['head', null, '#2563eb'],
          ['newHead', null, '#16a34a'],
        ]),
        dataFlows: [],
        stackFrames: [],
      },
    ];
  }

  const steps: DemoStep[] = [];
  const nextMap: Array<number | null> = values.map((_, idx) => (idx + 1 < values.length ? idx + 1 : null));
  const frameStack: StackFrame[] = [];

  const pushStep = (
    id: string,
    title: string,
    description: string,
    lines: LineMap,
    active: number[],
    head: number | null,
    newHead: number | null,
    rewiredFrom?: number,
    flows: DataFlowArrow[] = []
  ) => {
    steps.push({
      id,
      title,
      description,
      lineMap: lines,
      variables: vars(values, [
        ['head', head],
        ['newHead', newHead],
      ]),
      nodes: createNodes(values, active),
      edges: createEdges(nextMap, rewiredFrom),
      pointers: makePointers([
        ['head', head, '#2563eb'],
        ['newHead', newHead, '#16a34a'],
      ]),
      dataFlows: flows,
      stackFrames: cloneStack(frameStack),
    });
  };

  const dfs = (idx: number): number => {
    frameStack.push({
      id: 'frame-' + String(idx),
      title: 'reverse(node=' + String(values[idx]) + '@' + String(idx) + ')',
      locals: { head: nodeRef(values, idx) },
      state: 'enter',
    });

    pushStep(
      'rec-enter-' + String(idx),
      '递归进入 ' + String(values[idx]) + '@' + String(idx),
      '检查是否命中递归基。',
      REC_LINES.condition,
      [idx],
      idx,
      null
    );

    if (idx === values.length - 1) {
      frameStack[frameStack.length - 1].state = 'return';
      pushStep(
        'rec-base-' + String(idx),
        '递归基返回 ' + String(values[idx]) + '@' + String(idx),
        '到达尾节点，作为 newHead 返回。',
        REC_LINES.condition,
        [idx],
        idx,
        idx
      );
      frameStack.pop();
      return idx;
    }

    frameStack[frameStack.length - 1].state = 'active';
    pushStep(
      'rec-call-' + String(idx),
      '调用下一层 ' + String(values[idx + 1]) + '@' + String(idx + 1),
      'newHead = reverseList(head.next)',
      REC_LINES.call,
      [idx, idx + 1],
      idx,
      null
    );

    const newHead = dfs(idx + 1);

    nextMap[idx + 1] = idx;
    pushStep(
      'rec-rewire-' + String(idx),
      '回溯重连 ' + String(values[idx + 1]) + ' -> ' + String(values[idx]),
      '执行 head.next.next = head',
      REC_LINES.rewire,
      [idx, idx + 1],
      idx,
      newHead,
      idx + 1,
      [{ fromId: nodeId(idx + 1), toId: nodeId(idx), label: 'head.next.next = head' }]
    );

    nextMap[idx] = null;
    pushStep(
      'rec-break-' + String(idx),
      '断开旧指针 ' + String(values[idx]) + ' -> null',
      '执行 head.next = null，避免形成环。',
      REC_LINES.breakOld,
      [idx],
      idx,
      newHead,
      idx,
      [{ fromId: nodeId(idx), toId: 'null', label: 'head.next = null' }]
    );

    frameStack[frameStack.length - 1].state = 'return';
    pushStep(
      'rec-return-' + String(idx),
      '返回 newHead=' + String(values[newHead]) + '@' + String(newHead),
      '当前层返回 newHead 给上一层。',
      REC_LINES.ret,
      [newHead],
      idx,
      newHead
    );

    frameStack.pop();
    return newHead;
  };

  const newHead = dfs(0);

  steps.push({
    id: 'rec-final',
    title: '递归完成',
    description: '最外层返回 newHead，链表反转结束。',
    lineMap: REC_LINES.ret,
    variables: vars(values, [
      ['head', 0],
      ['newHead', newHead],
    ]),
    nodes: createNodes(values, [newHead]),
    edges: createEdges(nextMap),
    pointers: makePointers([
      ['head', 0, '#2563eb'],
      ['newHead', newHead, '#16a34a'],
    ]),
    dataFlows: [{ fromId: nodeId(newHead), toId: nodeId(0), label: '返回反转后的头节点' }],
    stackFrames: [],
  });

  return steps;
}
