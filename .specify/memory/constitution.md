# Readium Playground Constitution

## Core Principles

### I. 中文优先 (Chinese First)

所有问答交流和文档生成优先使用中文。这包括但不限于：需求澄清、设计讨论、代码审查反馈、任务说明等。使用中文可以确保与用户的高效沟通，减少语言歧义。

### II. 图书馆优先 (Library-First)

每个功能作为独立模块开发；模块必须自包含、可独立测试、有清晰文档；不接受仅为组织目的而创建的模块。

### III. 测试驱动 (Test-First)

TDD 强制执行：测试先行 → 用户确认 → 测试失败 → 然后实现。严格遵守 Red-Green-Refactor 循环。

### IV. 集成测试聚焦

集成测试重点覆盖：新模块契约测试、契约变更、服务间通信、共享模式。

### V. 简洁优先 (Simplicity)

从简单开始，遵循 YAGNI 原则。优先选择简单方案而非复杂方案，避免过度工程。

## Additional Constraints

### 技术栈

- TypeScript 5.7 + TanStack Start
- React 19 + @readium/js
- IndexedDB (idb) 用于本地存储

### 代码质量

- 必须通过 `npm test && npm run lint`
- 遵循 TypeScript 标准规范

## Development Workflow

### 开发流程

1. 使用 speckit 工具进行需求管理
2. 规格说明 → 澄清 → 规划 → 任务 → 实现 → 验证
3. 每个功能独立开发和测试

### 代码审查

- 必须验证与 Constitution 一致性
- 复杂度必须有充分理由

## Governance

Constitution 优先于所有其他实践；修正需要文档记录、审批和迁移计划。

**Version**: 0.2.0 | **Ratified**: 2026-03-03 | **Last Amended**: 2026-03-03
