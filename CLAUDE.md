# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Redis ZipList 可视化教学系统 - An interactive educational platform for learning Redis ZipList data structure.

**Tech Stack:** React 18 + TypeScript + Vite + D3.js + Remotion

**Live Site:** https://cc11001100.github.io/redis-ziplist-animation/

## Common Commands

```bash
# Development server (runs on port 46049)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint TypeScript/React files
npm run lint

# Remotion video preview (for educational videos)
npm run remotion:preview

# Build Remotion video (outputs to out/structure.mp4)
npm run remotion:build
```

## Architecture

### Path Aliases
- `@/` maps to `src/` directory (configured in vite.config.ts and tsconfig.json)

### Core Modules

**ZipList Implementation (`src/core/ziplist.ts`)**
- Contains the complete ZipList algorithm implementation
- Key functions: `createZipList()`, `insertEntry()`, `deleteEntry()`, `updateEntry()`, `selectEncoding()`
- Implements cascade update logic (连锁更新)
- Constants: `ZIPLIST_HEADER_SIZE = 12`, `PREVLEN_THRESHOLD = 254`

**Type Definitions (`src/types/ziplist.ts`)**
- `ZipListState` - Complete state including header, entries, memory blocks
- `ZipListEntry` - Individual entry with encoding, content, offsets
- `EntryEncoding` - Enum for all encoding types (INT8/16/24/32/64, STR_6BIT/14BIT/32BIT)
- `MemoryByte` - Byte-level memory representation for visualization

**Visualization Components (`src/components/visualization/`)**
- `VisualizationArea.tsx` - Main container with tabs (memory/byte/structure/conversion views)
- `MemoryLayoutView.tsx` - Visual representation of ZipList memory layout
- `ByteLevelView.tsx` - Hex dump style byte-level view
- `StructureView.tsx` - Tree/graph visualization using D3.js

**Layout (`src/components/layout/`)**
- `MainLayout.tsx` - Demo page layout with CSS Grid (left panel, center canvas, right panel, bottom stats)
- Splitter drag functionality for resizing right panel

### Video Generation (Remotion)
Located in `src/remotion/videos/` - Used to generate educational videos about ZipList concepts:
- `ZipListStructure.tsx` - Overall structure animation
- `EncodingMechanism.tsx` - Encoding type explanations
- `CascadeUpdate.tsx` - Chain update demonstration

### Configuration
- **Vite config:** Development port 46049, base path `/redis-ziplis-1t-animation/` for GitHub Pages
- **TypeScript:** Path mapping `@/*` to `src/*`, strict mode enabled
- **Remotion:** Video output format PNG, overwrite enabled

### Key Features to Understand
1. **Encoding Selection** - Automatic selection of optimal encoding based on value type/size
2. **Cascade Update** - When an entry grows >=254 bytes, subsequent entries' prevlen field may expand from 1 to 5 bytes
3. **Memory Layout** - Compact contiguous memory structure vs linked list pointer overhead
4. **Bidirectional Traversal** - Forward by offset accumulation, backward by prevlen subtraction
