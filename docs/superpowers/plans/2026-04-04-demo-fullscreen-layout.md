# ZipList 实战演示 全屏自适应布局优化

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将实战演示页面改造为单屏幕全屏应用，移除垂直滚动条，实现垂直/水平方向完全自适应用户屏幕尺寸，同时优化教程页面的整体布局结构。

**Architecture:**
- 采用 CSS Flexbox + CSS Grid 实现全屏自适应布局
- 控制面板支持折叠/展开，节省可视化区域空间
- 引入可拖拽分割条，允许用户自定义左右区域比例
- 响应式断点优化，针对不同屏幕尺寸提供最佳布局

**Tech Stack:** CSS Flexbox, CSS Grid, CSS Variables, React Hooks (useState, useEffect, useRef, useCallback)

---

## 一、问题分析

### 当前布局问题

1. **垂直滚动条问题** (`MainLayout.css:4-7`)
   ```css
   .main-layout {
     height: calc(100vh - 140px);
     overflow-y: auto;  /* ← 产生垂直滚动条 */
   }
   ```

2. **双重滚动问题** (`MainLayout.css:54-63`)
   ```css
   .layout-container {
     overflow-y: auto;  /* ← layout-container 也有滚动 */
   }
   ```

3. **固定宽度分割** (`MainLayout.css:56-57`)
   ```css
   grid-template-columns: 1fr 400px;  /* ← 右侧固定400px，小屏幕不适应 */
   ```

4. **教程页面凌乱** - 各教育组件缺乏统一的布局规范

---

## 二、布局架构设计

### 2.1 全屏自适应布局模型

```
┌─────────────────────────────────────────────────────────────┐
│  Header (固定高度 60px)                                      │
├─────────────────────────────────────────────────────────────┤
│  Demo Header (固定高度 56px)                                │
├────────────────────────────────────┬────────────────────────┤
│                                    │                        │
│   可视化区域 (flex: 1)             │  控制面板 (可折叠)      │
│   - 内存布局/字节视图/结构视图     │  - 操作控制             │
│   - 动画可视化                     │  - 动画控制             │
│   - 统计信息                       │  - 状态信息             │
│                                    │                        │
│   [可拖拽分割条]                   │  [收起/展开按钮]        │
│                                    │                        │
└────────────────────────────────────┴────────────────────────┘
```

### 2.2 核心 CSS 变量

```css
:root {
  --header-height: 60px;
  --demo-header-height: 56px;
  --control-panel-width: 380px;
  --control-panel-collapsed-width: 48px;
  --splitter-width: 6px;
  --footer-height: 0px; /* 隐藏footer */
}
```

---

## 三、实施任务

### Task 1: 改造 MainLayout 为全屏自适应

**Files:**
- Modify: `src/components/layout/MainLayout.tsx`
- Modify: `src/components/layout/MainLayout.css`

- [ ] **Step 1: 重写 MainLayout.tsx 布局结构**

```tsx
// 核心布局组件
function MainLayout({ zipListState, config, onUpdateZipList, onUpdateConfig }: MainLayoutProps) {
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.65); // 可视化区域占比
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // 计算可视化区域和控制面板的宽度
  const visualizationWidth = isControlPanelCollapsed 
    ? 'calc(100% - var(--control-panel-collapsed-width))' 
    : `calc(${splitRatio * 100}% - var(--splitter-width))`;
  const controlPanelWidth = isControlPanelCollapsed 
    ? 'var(--control-panel-collapsed-width)' 
    : `calc(${(1 - splitRatio) * 100}% - var(--splitter-width))`;

  return (
    <main className="main-layout">
      {/* Demo Header */}
      <div className="demo-header">...</div>

      {/* 主内容区 - 全屏自适应 */}
      <div className="fullscreen-container" ref={containerRef}>
        {/* 可视化区域 */}
        <div className="visualization-section" style={{ width: visualizationWidth }}>
          <VisualizationArea zipListState={zipListState} config={config} />
        </div>

        {/* 可拖拽分割条 */}
        {!isControlPanelCollapsed && (
          <div className="splitter" onMouseDown={handleSplitterMouseDown} />
        )}

        {/* 控制面板 */}
        <div className={`control-section ${isControlPanelCollapsed ? 'collapsed' : ''}`} 
             style={{ width: controlPanelWidth }}>
          <button className="collapse-btn" onClick={toggleControlPanel}>
            {isControlPanelCollapsed ? '◀' : '▶'}
          </button>
          {!isControlPanelCollapsed && (
            <>
              <OperationHints entryCount={zipListState.entries.length} />
              <ControlPanel ... />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: 重写 MainLayout.css 全屏样式**

```css
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;  /* 100% 视口高度 */
  overflow: hidden;  /* 禁止滚动 */
}

.demo-header {
  flex-shrink: 0;
  height: var(--demo-header-height);
  /* 其他样式保持 */
}

.fullscreen-container {
  flex: 1;
  display: flex;
  overflow: hidden;  /* 禁止滚动 */
  min-height: 0;
}

.visualization-section {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.splitter {
  width: var(--splitter-width);
  background: var(--border-color);
  cursor: col-resize;
  transition: background 0.2s;
}

.splitter:hover {
  background: var(--primary-color);
}

.control-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
  position: relative;
}

.control-section.collapsed {
  width: var(--control-panel-collapsed-width);
}

.collapse-btn {
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  z-index: 10;
}
```

- [ ] **Step 3: 添加拖拽分割逻辑**

```tsx
const handleSplitterMouseDown = useCallback((e: React.MouseEvent) => {
  isDragging.current = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';

  const handleMouseMove = (moveEvent: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newRatio = (moveEvent.clientX - containerRect.left) / containerRect.width;
    setSplitRatio(Math.max(0.3, Math.min(0.8, newRatio)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}, []);
```

---

### Task 2: 优化 VisualizationArea 全屏自适应

**Files:**
- Modify: `src/components/visualization/VisualizationArea.tsx`
- Modify: `src/components/visualization/VisualizationArea.css`

- [ ] **Step 1: 修改 VisualizationArea 为全屏自适应**

```tsx
function VisualizationArea({ zipListState, config }: VisualizationAreaProps) {
  return (
    <div className="visualization-area">
      <div className="viz-header">...</div>
      <div className="viz-content">
        {activeTab === 'memory' && <MemoryLayoutView zipListState={zipListState} />}
        {/* ... */}
      </div>
      <div className="viz-footer">...</div>
    </div>
  );
}
```

- [ ] **Step 2: 更新 VisualizationArea.css**

```css
.visualization-area {
  display: flex;
  flex-direction: column;
  height: 100%;  /* 继承父容器高度 */
  overflow: hidden;
}

.viz-header {
  flex-shrink: 0;
  height: 52px;
}

.viz-content {
  flex: 1;
  overflow: auto;  /* 内容区内部可滚动 */
  min-height: 0;
}

.viz-footer {
  flex-shrink: 0;
  height: 48px;
}
```

---

### Task 3: 控制面板折叠功能优化

**Files:**
- Modify: `src/components/layout/MainLayout.tsx`
- Modify: `src/components/layout/MainLayout.css`

- [ ] **Step 1: 添加折叠状态管理和动画**

```tsx
const toggleControlPanel = useCallback(() => {
  setIsControlPanelCollapsed(prev => !prev);
}, []);

// 折叠时保存用户偏好
useEffect(() => {
  localStorage.setItem('control-panel-collapsed', String(isControlPanelCollapsed));
}, [isControlPanelCollapsed]);

// 初始化时恢复偏好
useEffect(() => {
  const saved = localStorage.getItem('control-panel-collapsed');
  if (saved === 'true') setIsControlPanelCollapsed(true);
}, []);
```

---

### Task 4: 响应式断点优化

**Files:**
- Modify: `src/components/layout/MainLayout.css`

- [ ] **Step 1: 添加响应式断点**

```css
/* 小屏幕：控制面板默认折叠 */
@media (max-width: 1024px) {
  .fullscreen-container {
    flex-direction: column;
  }
  
  .visualization-section {
    width: 100% !important;
    height: 60%;
  }
  
  .control-section {
    width: 100% !important;
    height: 40%;
    flex-direction: row;
  }
  
  .splitter {
    display: none;
  }
}

/* 平板：默认展开但可折叠 */
@media (min-width: 1025px) and (max-width: 1440px) {
  :root {
    --control-panel-width: 320px;
  }
}

/* 手机：全屏单列布局 */
@media (max-width: 768px) {
  .demo-header {
    height: 48px;
    padding: 8px 16px;
  }
  
  .demo-title {
    font-size: 18px;
  }
  
  .fullscreen-container {
    flex-direction: column;
  }
  
  .visualization-section,
  .control-section {
    width: 100% !important;
    height: 50%;
  }
}
```

---

### Task 5: 隐藏 Footer 在 Demo 页面

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Footer.css`

- [ ] **Step 1: 在 Demo 页面隐藏 Footer**

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<IntroductionSection />} />
  <Route path="/demo" element={
    <>
      <MainLayout ... />
      {/* 不渲染 Footer */}
    </>
  } />
  {/* ... */}
</Routes>
```

- [ ] **Step 2: 添加 Footer 隐藏样式**

```css
/* Demo 页面隐藏 footer */
.main-layout ~ .footer {
  display: none;
}
```

或者更好的方式 - 在 App.tsx 中条件渲染：

```tsx
{location.pathname !== '/demo' && <Footer />}
```

---

### Task 6: 功能增强 - 快捷键支持

**Files:**
- Modify: `src/components/layout/MainLayout.tsx`

- [ ] **Step 1: 添加键盘快捷键**

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl/Cmd + \ : 切换控制面板
    if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
      e.preventDefault();
      toggleControlPanel();
    }
    // Ctrl/Cmd + [ : 减小分割比例
    if ((e.ctrlKey || e.metaKey) && e.key === '[') {
      e.preventDefault();
      setSplitRatio(prev => Math.max(0.3, prev - 0.05));
    }
    // Ctrl/Cmd + ] : 增加分割比例
    if ((e.ctrlKey || e.metaKey) && e.key === ']') {
      e.preventDefault();
      setSplitRatio(prev => Math.min(0.8, prev + 0.05));
    }
    // F11: 切换全屏
    if (e.key === 'F11') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [toggleControlPanel]);
```

---

### Task 7: 教程页面布局标准化

**Files:**
- Modify: `src/components/education/IntroductionSection.css`
- Modify: `src/components/education/ConceptsSection.css`
- Modify: 其他教育组件 CSS

- [ ] **Step 1: 创建统一的布局工具类**

```css
/* 教程页面通用布局 */
.tutorial-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.tutorial-content {
  display: grid;
  gap: var(--spacing-xl);
}

/* 双列布局 */
@media (min-width: 1024px) {
  .tutorial-content.two-columns {
    grid-template-columns: 1fr 1fr;
  }
}

/* 三列布局 */
@media (min-width: 1200px) {
  .tutorial-content.three-columns {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 2: 标准化各教程页面**

对以下文件应用统一布局规范：
- `IntroductionSection.css`
- `ConceptsSection.css`
- `ConfigurationSection.css`
- `ComparisonSection.css`
- `CommandsSection.css`
- `PracticeSection.css`

---

## 四、测试验证

- [ ] **Test 1: 全屏无滚动**
  - 打开 `/demo` 页面
  - 验证整个页面没有垂直滚动条
  - 验证内容完全填满屏幕

- [ ] **Test 2: 控制面板折叠**
  - 点击折叠按钮
  - 验证控制面板平滑收起
  - 验证可视化区域自动扩展

- [ ] **Test 3: 拖拽分割条**
  - 拖拽分割条
  - 验证左右区域比例实时变化
  - 验证比例可以保存（可选）

- [ ] **Test 4: 响应式布局**
  - 在不同窗口尺寸下测试
  - 验证小屏幕时自动切换为上下布局

- [ ] **Test 5: 快捷键功能**
  - `Ctrl+\` 切换控制面板
  - `Ctrl+[/]` 调整分割比例

---

## 五、预计改动文件清单

| 文件 | 改动类型 |
|------|---------|
| `src/components/layout/MainLayout.tsx` | 重写布局逻辑 |
| `src/components/layout/MainLayout.css` | 全屏自适应样式 |
| `src/components/visualization/VisualizationArea.tsx` | 移除固定高度 |
| `src/components/visualization/VisualizationArea.css` | 全屏自适应 |
| `src/App.tsx` | 条件渲染 Footer |
| `src/App.css` | 全局滚动条控制 |
| `src/styles/global.css` | CSS 变量补充 |
| `src/components/education/*.css` | 布局标准化 |

---

## 六、风险与注意事项

1. **D3 可视化组件兼容性** - 某些 D3 组件可能有固定高度假设，需要检查并适配
2. **浏览器兼容性** - `dvh/lvh` 单位在旧浏览器支持有限，使用 `calc(100vh - x)` 方案
3. **状态持久化** - 分割比例和折叠状态使用 localStorage 保存
4. **性能考虑** - 拖拽时使用 `requestAnimationFrame` 节流
