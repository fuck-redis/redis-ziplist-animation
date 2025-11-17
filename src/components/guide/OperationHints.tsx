import { useState } from 'react';
import './OperationHints.css';

interface OperationHintsProps {
  entryCount: number;
}

function OperationHints({ entryCount }: OperationHintsProps) {
  const [isExpanded, setIsExpanded] = useState(entryCount === 0);
  const getHintForState = () => {
    if (entryCount === 0) {
      return {
        icon: '👉',
        title: '从这里开始',
        steps: [
          '在右边"节点值"输入框中输入一个数字，比如：42',
          '点击"插入节点"按钮',
          '看！左边会出现你的第一个节点',
        ],
        tip: '💡 提示：任何数字都可以，试试你的幸运数字！',
      };
    } else if (entryCount === 1) {
      return {
        icon: '🎉',
        title: '太棒了！继续尝试',
        steps: [
          '再插入几个数字，比如：100, 255, 1000',
          '观察左边每个节点显示的编码类型（INT8, INT16等）',
          '看看下面的统计信息如何变化',
        ],
        tip: '💡 不同大小的数字会自动选择最优的编码方式！',
      };
    } else if (entryCount < 5) {
      return {
        icon: '🚀',
        title: '你做得很好！试试这些',
        steps: [
          '试着插入一段文字，比如："Hello"',
          '点击左上角的三个按钮切换视图',
          '切换到"删除"标签，试着删除一个节点',
        ],
        tip: '💡 ZipList可以同时存储数字和文字！',
      };
    } else {
      return {
        icon: '🌟',
        title: '你已经掌握了基础！',
        steps: [
          '查看"统计面板"中的"内存效率"和"节省"比例',
          '试试"批量"标签，一次性创建多个节点',
          '点击顶部导航的"🔬 核心概念"深入学习原理',
        ],
        tip: '💡 看到了吗？ZipList帮你节省了大量内存！',
      };
    }
  };

  const hint = getHintForState();

  return (
    <div className={`operation-hints ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="hints-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="hints-header-left">
          <span className="hints-icon">{hint.icon}</span>
          <h3 className="hints-title">{hint.title}</h3>
        </div>
        <button className="hints-toggle">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="hints-steps">
            {hint.steps.map((step, index) => (
              <div key={index} className="hint-step">
                <div className="step-number">{index + 1}</div>
                <div className="step-text">{step}</div>
              </div>
            ))}
          </div>

          <div className="hints-tip">{hint.tip}</div>

          {entryCount === 0 && (
            <div className="first-time-help">
              <p>
                <strong>第一次使用？</strong>
              </p>
              <p>不用担心！跟着上面的步骤，你马上就能上手。</p>
              <p>记住：<strong>输入 → 点击 → 观察</strong></p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OperationHints;
