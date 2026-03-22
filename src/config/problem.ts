import { SolutionKey } from '@/types/demo';

export const PROBLEM = {
  title: '206. 反转链表',
  englishTitle: 'Reverse Linked List',
  leetcodeUrl: 'https://leetcode.cn/problems/reverse-linked-list/',
  hot100Url: 'https://fuck-algorithm.github.io/leetcode-hot-100/',
  idea: [
    '迭代法核心是三指针：prev、curr、next。',
    '每一步先保存 next，再让 curr.next 指向 prev，最后整体右移指针。',
    '递归法核心是先走到尾节点作为新头，再在回溯阶段执行“后继指回前驱”。',
    '动画中重点观察“指针重连”与“调用栈回溯”。',
  ],
  inputHelp: '输入链表节点值，使用英文逗号分隔，如 1,2,3,4,5',
  maxLen: 12,
  minVal: -1000,
  maxVal: 1000,
};

export const SOLUTIONS: { key: SolutionKey; label: string; route: string; description: string }[] = [
  {
    key: 'iterative',
    label: '解法一：迭代三指针',
    route: '/iterative',
    description: '空间 O(1)，通过 prev/curr/next 原地反转指针。',
  },
  {
    key: 'recursive',
    label: '解法二：递归回溯',
    route: '/recursive',
    description: '利用递归调用栈从尾节点开始回溯重连。',
  },
];

export const SAMPLE_INPUTS = ['1,2,3,4,5', '5,4,3,2,1', '1', '2,7,11,15', '9,8,7,6,5,4,3'];
