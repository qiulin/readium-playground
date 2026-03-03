# Data Model: Reader UI Redesign

**Feature**: 002-reader-ui-redesign
**Date**: 2026-03-03

## Entities

### UserPreferences

用户阅读偏好设置

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| theme | 'light' \| 'dark' \| 'sepia' | Yes | 当前主题 |
| fontSize | 'small' \| 'medium' \| 'large' | Yes | 字体大小预设 |

**Default Values**:
- theme: 'light'
- fontSize: 'medium'

### ReadingState

当前阅读状态 (内存中)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| currentLocation | string | Yes | 当前阅读位置 (href) |
| percentage | number | Yes | 阅读进度百分比 (0-100) |
| controlsVisible | boolean | Yes | 导航控件是否可见 |

## Theme Colors

### Light Theme (亮色)

| Element | Color |
|---------|-------|
| Background | #FFFFFF |
| Text | #1F2937 |
| Accent | #3B82F6 |

### Dark Theme (暗色)

| Element | Color |
|---------|-------|
| Background | #1A1A1A |
| Text | #E5E5E5 |
| Accent | #60A5FA |

### Sepia Theme (护眼色)

| Element | Color |
|---------|-------|
| Background | #F4ECD8 |
| Text | #5B4636 |
| Accent | #8B7355 |

## Font Sizes

| Preset | Base Font Size | Line Height |
|--------|----------------|-------------|
| small | 14px | 1.6 |
| medium | 16px | 1.7 |
| large | 20px | 1.8 |

## State Transitions

### Theme Switching

```
Light → Dark → Sepia → Light
  ↑_______↓________↓_______|
```

### Controls Visibility

```
Visible → Auto-hide (3s) → Hidden → User interaction → Visible
```

## Storage

使用现有 IndexedDB 存储 UserPreferences，与阅读进度共享存储。

**Key**: `user-preferences`
