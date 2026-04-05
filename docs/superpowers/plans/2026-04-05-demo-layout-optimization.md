# Demo Layout Optimization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构实战演示页面布局，实现全屏占满、中心画布四周面板的理想布局

**Architecture:** 采用 CSS Grid 三栏布局（左-中-右）+ 底部统计栏，保留全站 Header 和可拖拽右侧分割条，修复高度叠加问题

**Tech Stack:** React, TypeScript, CSS Grid/Flexbox

---

## Task 1: Fix Height Calculation in App.tsx

**Files:**
- Modify: `src/App.tsx:70-76`
- Modify: `src/App.css:1-40`

**问题:** 当前 main-content 有 padding-top，且 MainLayout 使用 100vh，叠加全站 Header 导致页面溢出

**解决方案:**
- [ ] **Step 1: Add demo-mode class for special styling**

```tsx
// In App.tsx, add className based on route
<main className={`main-content ${location.pathname === '/demo' ? 'demo-mode' : ''}`}>
```

- [ ] **Step 2: Update App.css for demo-mode height**

```css
.main-content.demo-mode {
  padding-top: 0;
  height: calc(100vh - 60px); /* Header height */
  overflow: hidden;
}

.main-content.demo-mode > * {
  height: 100%;
}
```

- [ ] **Step 3: Test height calculation**

Expected: Demo 页面不再出现垂直滚动条

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/App.css
git commit -m "fix: correct demo page height calculation to prevent overflow"
```

---

## Task 2: Refactor MainLayout CSS for Grid Layout

**Files:**
- Modify: `src/components/layout/MainLayout.css:1-235`

**目标:** 重构为左-中-右三栏 Grid 布局 + 底部统计栏

- [ ] **Step 1: Update CSS variables and base styles**

```css
:root {
  --demo-header-height: 56px;
  --left-panel-width: 280px;
  --right-panel-width: 380px;
  --bottom-panel-height: 60px;
  --splitter-width: 6px;
  --header-height: 60px;
}
```

- [ ] **Step 2: Refactor layout-container to Grid layout**

```css
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100%; /* Changed from 100vh */
  overflow: hidden;
}

.layout-container {
  flex: 1;
  display: grid;
  grid-template-columns: var(--left-panel-width) 1fr auto;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "left center right"
    "bottom bottom bottom";
  gap: 0;
  overflow: hidden;
  background: var(--bg-primary);
}

.left-panel {
  grid-area: left;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 16px;
}

.visualization-section {
  grid-area: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.control-section {
  grid-area: right;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-primary);
  transition: width 0.3s ease;
  position: relative;
  flex-shrink: 0;
}

.bottom-panel {
  grid-area: bottom;
  height: var(--bottom-panel-height);
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 16px;
}
```

- [ ] **Step 3: Update splitter styles for right panel**

```css
.splitter {
  width: var(--splitter-width);
  background: var(--border-color);
  cursor: col-resize;
  flex-shrink: 0;
  transition: background 0.2s ease;
  position: relative;
  grid-area: right;
  justify-self: start;
  z-index: 10;
}

/* Keep existing splitter::after and hover styles */
```

- [ ] **Step 4: Update responsive breakpoints**

```css
@media (max-width: 1200px) {
  .layout-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
      "left"
      "right"
      "center"
      "bottom";
  }

  .left-panel,
  .control-section {
    max-height: 25vh;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .splitter {
    display: none;
  }
}

@media (max-width: 768px) {
  .demo-header {
    height: 48px;
    padding: 0 12px;
  }

  .left-panel,
  .control-section {
    max-height: 30vh;
  }
}
```

- [ ] **Step 5: Test Grid layout**

Run: `npm run dev`
Expected: 可以看到三栏布局的基本结构

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/MainLayout.css
git commit -m "feat: refactor MainLayout to CSS Grid with left-center-right-bottom layout"
```

---

## Task 3: Update MainLayout Component Structure

**Files:**
- Modify: `src/components/layout/MainLayout.tsx:122-177`
- Modify: `src/components/visualization/VisualizationArea.tsx:57-61`

**目标:** 将组件按新布局重新分配，左侧放 OperationHints，底部放 StatisticsPanel

- [ ] **Step 1: Update MainLayout component structure**

```tsx
return (
  <main className="main-layout">
    {showGuide && <BeginnerGuide onClose={handleCloseGuide} />}

    <div className="demo-header">
      <div className="demo-title-section">
        <h1 className="demo-title">实战演示</h1>
        <p className="demo-subtitle">动手操作，直观理解ZipList</p>
      </div>
      {hasSeenGuide && (
        <button className="show-guide-btn" onClick={handleShowGuideAgain}>
          查看新手引导
        </button>
      )}
    </div>

    <div className="layout-container" ref={containerRef}>
      {/* 左侧面板 - Operation Hints */}
      <div className="left-panel">
        <OperationHints entryCount={zipListState.entries.length} />
      </div>

      {/* 中心画布区域 */}
      <div className="visualization-section">
        <VisualizationArea 
          zipListState={zipListState} 
          config={config} 
          showStatistics={false} /* 底部单独显示 */
        />
      </div>

      {/* 右侧控制面板 */}
      {!isControlPanelCollapsed && (
        <div
          className="splitter"
          onMouseDown={handleSplitterMouseDown}
        />
      )}

      <div
        className={`control-section ${isControlPanelCollapsed ? 'collapsed' : ''}`}
        style={{ 
          width: isControlPanelCollapsed ? 'var(--control-panel-collapsed-width)' : undefined,
          gridColumn: isControlPanelCollapsed ? '3' : undefined
        }}
      >
        <button
          className="collapse-btn"
          onClick={toggleControlPanel}
          title={isControlPanelCollapsed ? '展开控制面板' : '收起控制面板'}
        >
          {isControlPanelCollapsed ? '→' : '←'}
        </button>
        {!isControlPanelCollapsed && (
          <ControlPanel
            zipListState={zipListState}
            config={config}
            onUpdateZipList={onUpdateZipList}
            onUpdateConfig={onUpdateConfig}
          />
        )}
      </div>

      {/* 底部统计面板 */}
      {config.showStatistics && (
        <div className="bottom-panel">
          <StatisticsPanel zipListState={zipListState} />
        </div>
      )}
    </div>
  </main>
);
```

- [ ] **Step 2: Add StatisticsPanel import**

```tsx
import StatisticsPanel from '../visualization/StatisticsPanel';
```

- [ ] **Step 3: Update VisualizationArea to accept showStatistics prop**

```tsx
interface VisualizationAreaProps {
  zipListState: ZipListState;
  config: VisualizationConfig;
  showStatistics?: boolean;
}

function VisualizationArea({ zipListState, config, showStatistics = true }: VisualizationAreaProps) {
  // ... existing code ...
  
  return (
    <div className="visualization-area">
      {/* ... header and content ... */}
      
      {showStatistics && config.showStatistics && (
        <div className="viz-footer">
          <StatisticsPanel zipListState={zipListState} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Test component structure**

Expected: 
- 左侧显示 OperationHints
- 中心显示 VisualizationArea（不含统计栏）
- 右侧显示 ControlPanel
- 底部显示 StatisticsPanel

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/MainLayout.tsx src/components/visualization/VisualizationArea.tsx
git commit -m "feat: reorganize components to left-center-right-bottom layout"
```

---

## Task 4: Fix Splitter Drag Logic for New Layout

**Files:**
- Modify: `src/components/layout/MainLayout.tsx:84-110`

**问题:** 现有 splitter 逻辑假设左右分栏，需要适配新的 Grid 布局

- [ ] **Step 1: Update handleSplitterMouseDown for right panel only**

```tsx
const handleSplitterMouseDown = useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  isDragging.current = true;
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const leftWidth = parseInt(getComputedStyle(containerRef.current).getPropertyValue('--left-panel-width'));
    
    // Calculate right panel width based on mouse position
    const availableWidth = containerRect.width - leftWidth;
    const rightEdgeX = containerRect.right;
    const newRightWidth = rightEdgeX - e.clientX - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--splitter-width')) / 2);
    
    // Clamp between min and max
    const minWidth = 280;
    const maxWidth = Math.min(600, availableWidth * 0.6);
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newRightWidth));
    
    // Update CSS variable for right panel
    if (containerRef.current) {
      containerRef.current.style.setProperty('--right-panel-width', `${clampedWidth}px`);
    }
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

- [ ] **Step 2: Update CSS to use CSS variable for right panel width**

```css
.control-section {
  width: var(--right-panel-width, 380px);
  /* ... rest of styles ... */
}
```

- [ ] **Step 3: Test splitter drag**

Expected: 拖拽 splitter 可以调整右侧面板宽度

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/MainLayout.tsx src/components/layout/MainLayout.css
git commit -m "fix: update splitter logic for right panel in grid layout"
```

---

## Task 5: Polish Left Panel Styling

**Files:**
- Modify: `src/components/layout/MainLayout.css:70-140`

**目标:** 优化左侧面板的视觉呈现

- [ ] **Step 1: Add left panel specific styles**

```css
.left-panel {
  grid-area: left;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.left-panel h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-color);
}

.left-panel .hint-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 2px;
  padding: 12px;
  margin-bottom: 12px;
}

.left-panel .hint-item:last-child {
  margin-bottom: 0;
}
```

- [ ] **Step 2: Update OperationHints component styles if needed**

Check: `src/components/guide/OperationHints.css`

- [ ] **Step 3: Test visual appearance**

Expected: 左侧面板美观，内容可读

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/MainLayout.css
git commit -m "style: polish left panel styling for better visual appearance"
```

---

## Task 6: Final Testing and Validation

**Files:**
- All modified files

**综合测试验证**

- [ ] **Step 1: Verify full screen coverage**

Checklist:
- [ ] 页面无垂直滚动条
- [ ] 内容占满整个可视区域
- [ ] Header + MainLayout 高度总和等于视口高度

- [ ] **Step 2: Verify layout structure**

Checklist:
- [ ] 左侧面板显示 OperationHints
- [ ] 中心显示 VisualizationArea
- [ ] 右侧面板显示 ControlPanel
- [ ] 底部显示 StatisticsPanel
- [ ] splitter 可拖拽调整右侧面板宽度

- [ ] **Step 3: Verify responsive behavior**

Checklist:
- [ ] 窗口缩小时布局自动调整
- [ ] 移动端显示正常

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete demo page layout optimization with grid layout"
```

---

## Summary

**变更文件清单:**
1. `src/App.tsx` - 添加 demo-mode 样式类
2. `src/App.css` - 修复高度计算
3. `src/components/layout/MainLayout.css` - Grid 布局重构
4. `src/components/layout/MainLayout.tsx` - 组件结构重排
5. `src/components/visualization/VisualizationArea.tsx` - 可选统计栏显示

**预期结果:**
- Demo 页面占满全屏，无溢出
- 清晰的三栏 + 底部布局
- 中心画布突出，四周面板整齐排列
- 响应式适配良好
