# Research: Reader UI Redesign

**Date**: 2026-03-03
**Feature**: 002-reader-ui-redesign

## Research Tasks

### 1. Tailwind CSS 主题实现方案

**Question**: 如何使用 Tailwind CSS 实现亮色/暗色/护眼色主题切换？

**Findings**:
- 使用 CSS 变量存储主题颜色
- Tailwind 通过 `@layer` 和自定义颜色引用 CSS 变量
- 主题类 (light/dark/sepia) 添加到 html 或 body 元素
- 主题切换通过切换类名实现

**Decision**: 使用 Tailwind dark mode + 自定义 CSS 变量

**Rationale**:
- 符合现有技术栈 (Tailwind 已安装)
- 性能好 (无重排，仅类切换)
- 维护简单

**Alternatives evaluated**:
| Alternative | Reason for rejection |
|------------|---------------------|
| CSS-in-JS (styled-components) | 过度工程，增加依赖 |
| 纯 CSS 类切换 | 不够灵活，难以扩展 |
| 第三方主题库 | 增加依赖，学习成本 |

---

### 2. Playwright UI 测试

**Question**: 如何使用 Playwright 验证主题切换和 UI 元素？

**Findings**:
- Playwright 已安装 (.playwright-mcp/ 存在)
- 可使用 `page.locator()` 定位元素
- 可使用 `page.evaluate()` 获取 computed styles 验证主题颜色
- 支持截图验证 UI 变化

**Decision**: 使用 Playwright 编写 UI 验证测试

**Rationale**:
- 已安装可用
- 支持端到端测试
- 可验证 UI 变化

---

### 3. EPUB 阅读器 UI 最佳实践

**Question**: 现代电子书阅读器有哪些 UI 设计模式？

**Findings**:
- Kindle/Apple Books 模式:
  - 沉浸式阅读，导航控件自动隐藏
  - 点击边缘翻页
  - 底部进度条
  - 顶部工具栏可隐藏

- 主题选项:
  - 亮色 (白底黑字)
  - 暗色 (黑底白字)
  - 护眼/ sepia (暖色背景)

- 字体大小:
  - 3-5 个预设 (小/中/大)

**Decision**: 采用主流阅读器设计模式

**Rationale**: 用户熟悉，减少学习成本

---

## Summary

| Decision | Rationale |
|----------|-----------|
| Tailwind + CSS 变量实现主题 | 符合现有技术栈，简单高效 |
| Playwright UI 验证 | 已安装，可验证 UI 变化 |
| 主流阅读器设计模式 | 用户熟悉 |
