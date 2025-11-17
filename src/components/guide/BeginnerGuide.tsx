import { useState } from 'react';
import './BeginnerGuide.css';

interface BeginnerGuideProps {
  onClose: () => void;
}

function BeginnerGuide({ onClose }: BeginnerGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '👋 欢迎来到实战演示！',
      content: '这里可以让你亲手操作ZipList，看到每一步的变化。\n完全不用担心，我会一步步教你！',
      highlight: '跟着我的指引，3分钟就能上手！',
    },
    {
      title: '📝 第一步：插入你的第一个数字',
      content: '看到右边的"节点值"输入框了吗？\n在里面输入一个数字，比如：42',
      highlight: '试试输入 42，然后点击"插入节点"按钮',
      image: '💡 提示：任何数字都可以，比如你的幸运数字！',
    },
    {
      title: '👀 第二步：观察发生了什么',
      content: '点击"插入节点"后，你会看到：\n\n✅ 左边出现了一个新的节点块\n✅ 显示了这个数字42\n✅ 统计信息更新了',
      highlight: '这就是ZipList在内存中的样子！',
      image: '🎉 恭喜！你已经创建了第一个ZipList节点！',
    },
    {
      title: '🎨 第三步：切换不同的视图',
      content: '左上角有三个按钮：\n\n📦 内存布局 - 看整体结构\n🔢 字节视图 - 看实际的字节（高级）\n🏗️ 结构视图 - 看节点关系',
      highlight: '初学者建议使用"内存布局"视图',
      image: '💡 每个视图都是同一个ZipList的不同展示方式',
    },
    {
      title: '🚀 第四步：试试更多操作',
      content: '现在你可以：\n\n1️⃣ 继续插入更多数字\n2️⃣ 试试插入文字，比如"Hello"\n3️⃣ 观察统计信息的变化\n4️⃣ 尝试删除某个节点',
      highlight: '放心大胆地尝试，随时可以重新开始！',
      image: '🎯 每次操作后都看看统计面板的变化',
    },
    {
      title: '✨ 开始你的探索之旅！',
      content: '你现在已经掌握了基础操作！\n\n记住三个要点：\n1. 插入节点 - 添加数据\n2. 查看变化 - 观察结果\n3. 统计分析 - 理解优化',
      highlight: '有任何问题，查看右侧的"💡 使用提示"',
      image: '🎊 准备好了？关闭这个引导开始探索吧！',
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="beginner-guide-overlay">
      <div className="beginner-guide-modal">
        <div className="guide-header">
          <div className="guide-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${
                  index < currentStep ? 'completed' : ''
                }`}
              />
            ))}
          </div>
          <button className="guide-close" onClick={handleSkip}>
            ✕
          </button>
        </div>

        <div className="guide-content">
          <h2 className="guide-title">{currentStepData.title}</h2>
          <div className="guide-text">
            {currentStepData.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <div className="guide-highlight">{currentStepData.highlight}</div>
          {currentStepData.image && (
            <div className="guide-image">{currentStepData.image}</div>
          )}
        </div>

        <div className="guide-footer">
          <div className="guide-step-info">
            步骤 {currentStep + 1} / {steps.length}
          </div>
          <div className="guide-buttons">
            {currentStep > 0 && (
              <button className="guide-btn guide-btn-prev" onClick={handlePrev}>
                ← 上一步
              </button>
            )}
            <button className="guide-btn guide-btn-skip" onClick={handleSkip}>
              跳过引导
            </button>
            <button className="guide-btn guide-btn-next" onClick={handleNext}>
              {currentStep === steps.length - 1 ? '开始探索 →' : '下一步 →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeginnerGuide;
