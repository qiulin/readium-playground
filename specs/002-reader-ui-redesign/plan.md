# Implementation Plan: Reader UI Redesign

**Branch**: `002-reader-ui-redesign` | **Date**: 2026-03-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-reader-ui-redesign/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

重新设计阅读器页面展示样式，提供更符合阅读器使用体验的界面。主要包括：沉浸式阅读体验、主题切换（亮色/暗色/护眼色）、字体大小调节、改进的导航控制、阅读进度显示、以及清理不必要的演示页面。

## Technical Context

**Language/Version**: TypeScript 5.7
**Primary Dependencies**: TanStack Start, React 19, @readium/js, Tailwind CSS
**Storage**: IndexedDB (via idb library)
**Testing**: Playwright (for UI verification), npm test && npm run lint
**Target Platform**: Web Browser
**Project Type**: Web Application (EPUB Reader)
**Performance Goals**: 主题切换 <200ms, 导航响应 <100ms, 进度更新 <500ms
**Constraints**: 离线可用, 必须通过 lint
**Scale/Scope**: 单用户，中小型电子书

## Constitution Check

**Gate 1 - 中文优先**: ✅ 通过 - 代码使用英文，但需求文档和交流使用中文
**Gate 2 - 简洁优先**: ✅ 通过 - 采用简单CSS变量方案实现主题切换
**Gate 3 - 测试验证**: ✅ 通过 - 使用 Playwright 验证 UI 修改

## Project Structure

### Documentation (this feature)

```text
specs/002-reader-ui-redesign/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   └── epub/
│       ├── EpubReader.tsx    # Main reader component (to be modified)
│       ├── TableOfContents.tsx
│       ├── ProgressBar.tsx
│       ├── BookCard.tsx
│       └── FileImporter.tsx
├── routes/
│   ├── library.tsx           # Library page
│   ├── reader.$bookId.tsx    # Reader page
│   ├── index.tsx            # Home/redirect
│   └── about.tsx            # About page (to be removed/cleaned)
├── services/
│   ├── epub/
│   └── storage/
├── stores/
│   └── library.ts
└── types/
    └── epub.ts
```

**Structure Decision**: 单项目 Web 应用，使用现有 TanStack Start 结构

## Phase 0: Research

### Research Tasks

1. **Tailwind CSS 主题实现方案**: 研究如何使用 CSS 变量和 Tailwind 实现亮色/暗色/护眼色主题切换
2. **Playwright UI 测试**: 研究如何使用 Playwright 验证主题切换和 UI 元素
3. **EPUB 阅读器 UI 最佳实践**: 研究现代电子书阅读器的 UI 设计模式

### Research Findings

**Decision**: 使用 Tailwind CSS 的 dark mode + 自定义 CSS 变量实现主题
- CSS 变量存储主题颜色，Tailwind 通过 dark: 前缀和 CSS 变量引用
- 主题持久化使用 IndexedDB (现有 idb 库)
- Playwright 用于端到端 UI 验证测试

**Rationale**: 简单、符合现有技术栈、性能好

**Alternatives considered**:
- CSS-in-JS (styled-components): 过度工程
- 纯 CSS 类切换: 不够灵活
- 第三方主题库: 增加依赖

## Phase 1: Design

### Data Model

**UserPreferences**:
- theme: 'light' | 'dark' | 'sepia'
- fontSize: 'small' | 'medium' | 'large'

### UI Components to Modify

1. **EpubReader.tsx**: 添加主题支持、字体大小控制、自动隐藏导航
2. **Header/导航组件**: 清理演示页面链接
3. **ProgressBar.tsx**: 改进进度显示

### Contracts (UI 接口)

- 主题切换 API: setTheme(theme) / getTheme()
- 字体大小切换 API: setFontSize(size) / getFontSize()
- 导航控制: onPrev(), onNext(), onToggleControls()

## Complexity Tracking

> 当前实现无需复杂度追踪 - 所有需求均可通过简单方案实现

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |
