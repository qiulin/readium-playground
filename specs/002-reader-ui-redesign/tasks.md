# Tasks: Reader UI Redesign

**Input**: Design documents from `/specs/002-reader-ui-redesign/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: 使用 Playwright 验证 UI 修改 (用户明确要求)

**Organization**: 任务按用户故事组织，每个故事可独立实现和测试

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可并行运行 (不同文件，无依赖)
- **[Story]**: 所属用户故事 (如 US1, US2)

## Phase 1: Setup

**Purpose**: 项目初始化和基础结构

- [ ] T001 [P] 验证 package.json 包含 @tanstack/react-start, react@19, tailwindcss, idb
- [ ] T001b [P] 确认 src/components/epub/ 目录存在 EpubReader.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 用户偏好存储 - 所有用户故事依赖

**CRITICAL**: 在任何用户故事开始前必须完成

- [ ] T002 [P] 在 src/services/storage/ 创建 preferences.ts 存储服务
- [ ] T003 [P] 实现 getPreferences() / savePreferences() 方法
- [ ] T004 添加 UserPreferences 类型定义到 src/types/epub.ts

**Checkpoint**: 偏好存储就绪 - 用户故事实现可以开始

---

## Phase 3: User Story 1 - Immersive Reading Experience (Priority: P1) 🎯 MVP

**Goal**: 提供舒适的阅读界面，包含适当的字体大小、行高、段落间距

**Independent Test**: 打开任意书籍，验证内容以适当的字体大小、行高、边距和对比度显示

### Implementation for User Story 1

- [ ] T005 [P] [US1] 在 src/styles/ 创建 theme.css 定义 CSS 变量
- [ ] T006 [P] [US1] 在 tailwind.config.ts (或 postcss.config.js) 添加主题颜色配置
- [ ] T007 [US1] 修改 EpubReader.tsx 添加主题 CSS 类到容器 (依赖 T002)
- [ ] T008 [US1] 添加字体大小预设样式到 theme.css
- [ ] T008a [P] [US1] 实现键盘导航支持 (左右箭头键翻页)
- [ ] T008b [P] [US1] 添加焦点指示器样式到 theme.css

**Checkpoint**: User Story 1 完成 - 舒适的阅读体验

---

## Phase 4: User Story 2 - Reading Theme Customization (Priority: P2)

**Goal**: 用户可以在亮色/暗色/护眼色之间切换主题

**Independent Test**: 切换主题并验证背景和文字颜色正确变化

### Tests for User Story 2 (TDD - 测试先行)

- [ ] T012 [P] [US2] 使用 Playwright 验证主题切换功能 - 验证背景色从 #FFFFFF 变为 #1A1A1A (期望失败)

### Implementation for User Story 2

- [ ] T009 [P] [US2] 在 EpubReader.tsx 添加主题切换按钮 UI
- [ ] T010 [US2] 实现主题切换逻辑，调用 preferences.ts 保存 (依赖 T002, T005)
- [ ] T011 [US2] 加载已保存的主题偏好 (依赖 T003)

### Verify for User Story 2

- [ ] T012b [US2] 再次运行 Playwright 验证主题切换功能 - 验证通过

**Checkpoint**: User Story 2 完成 - 主题切换功能

---

## Phase 5: User Story 3 - Improved Navigation Controls (Priority: P3)

**Goal**: 直观且不显眼的导航控制

**Independent Test**: 点击边缘翻页，验证控件自动隐藏

### Implementation for User Story 3

- [ ] T013 [P] [US3] 在 EpubReader.tsx 添加边缘点击区域
- [ ] T014 [US3] 实现自动隐藏逻辑 (3秒无操作后隐藏)
- [ ] T015 [US3] 添加键盘导航支持 (左右箭头键)

**Checkpoint**: User Story 3 完成 - 改进的导航控制

---

## Phase 6: User Story 4 - Progress Visibility (Priority: P3)

**Goal**: 显示阅读进度而不需要用户主动操作

**Independent Test**: 滚动或翻页时，验证进度指示器显示当前位置

### Implementation for User Story 4

- [ ] T016 [P] [US4] 改进 ProgressBar.tsx 组件
- [ ] T017 [US4] 添加百分比和章节信息显示

**Checkpoint**: User Story 4 完成 - 进度可见性

---

## Phase 7: User Story 5 - Clean Navigation (Priority: P2)

**Goal**: 最小化导航，只显示必要的链接

**Independent Test**: 验证导航只显示 Library 和 Reader 链接

### Tests for User Story 5 (TDD - 测试先行)

- [ ] T021 [P] [US5] 使用 Playwright 验证导航清洁 - 验证仅显示 Library 链接 (期望失败)

### Implementation for User Story 5

- [ ] T018 [P] [US5] 检查并移除 src/routes/demo/ 目录
- [ ] T019 [P] [US5] 修改 src/components/Header.tsx 移除 demo 链接
- [ ] T020 [US5] 修改 src/routes/index.tsx 重定向到 /library

### Verify for User Story 5

- [ ] T021b [US5] 再次运行 Playwright 验证导航清洁 - 验证通过

**Checkpoint**: User Story 5 完成 - 清洁导航

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: 跨用户故事的改进

- [ ] T022 [P] 运行 npm test && npm run lint 确保代码质量
- [ ] T023 [P] 使用 Playwright 验证所有 UI 修改 in tests/e2e/reader.spec.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖
- **Foundational (Phase 2)**: 依赖 Setup - 阻塞所有用户故事
- **User Stories (Phase 3-7)**: 依赖 Foundational 完成
  - US1 (P1) 和 US2 (P2) 可并行 (US2 依赖 T005)
  - US3, US4, US5 可在 US1/US2 后开始
- **Polish (Phase 8)**: 依赖所有用户故事完成

### User Story Dependencies

- **US1 (P1)**: 依赖 Foundational (T002-T004)
- **US2 (P2)**: 依赖 Foundational + US1 部分完成 (T005)
- **US3 (P3)**: 依赖 Foundational
- **US4 (P3)**: 依赖 Foundational
- **US5 (P2)**: 依赖 Foundational

### Within Each User Story

- 样式定义先于组件修改
- 服务层先于 UI 层
- 故事完成后再移动到下一个优先级

### Parallel Opportunities

- T002, T003, T004 可并行 (Foundational)
- T005, T006 可并行 (US1 样式)
- T009, T010, T011 可并行 (US2 实现)
- T018, T019 可并行 (US5 清理)
- T012, T021 可并行 (Playwright 测试)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational
3. 完成 Phase 3: User Story 1
4. **停止并验证**: 独立测试 User Story 1

### Incremental Delivery

1. 完成 Setup + Foundational → Foundation 就绪
2. 添加 User Story 1 → 独立测试 → 部署/演示 (MVP!)
3. 添加 User Story 2 → 独立测试 → 部署/演示
4. 添加 User Story 5 → 独立测试 → 部署/演示
5. 添加 User Story 3, 4 → 独立测试 → 部署/演示

---

## Notes

- [P] 任务 = 不同文件，无依赖
- [Story] 标签将任务映射到特定用户故事以实现可追溯性
- 每个用户故事应可独立完成和测试
- 提交每个任务或逻辑组
- 在任何检查点停止以独立验证故事
- 避免: 模糊任务、相同文件冲突、破坏独立性的跨故事依赖
