# Auto Parts Theme — Shopify 主题

基于 **Dawn v15.4.1**，仅支持 Online Store 2.0。详细设计系统见 `DESIGN.md`（颜色、排版、布局、组件样式、动画等）。

## 架构概览

Shopify Online Store 2.0 采用**模板驱动渲染**：

- **`layout/theme.liquid`** — 页面外壳，包含 `{{ content_for_header }}`（Shopify 注入）和 `{{ content_for_layout }}`（模板内容）。Swiper CSS/JS 通过 CDN 在此加载
- **`templates/*.json`** — 定义页面由哪些 section 组成及排列顺序
  - `index.json`：首页，引用自定义 section
  - 其余模板（product / collection / cart / search / page / blog / article / 404）统一引用 `template-content` section
  - 自定义产品模板格式：`product.模板名.json`，必须在本地 `templates/` 目录下创建对应文件
- **`sections/*.liquid`** — 可复用 UI 组件。每个 section 含 Liquid 模板 + `{% schema %}` 块
  - 基于 Dawn 的 50+ sections（main-product, header, footer, slideshow, video, image-banner, collage, multicolumn, rich-text, newsletter, blog-posts 等）
  - **通用降级渲染器** `template-content.liquid`：通过 `{% if template == '...' %}` 分支处理 8+ 种模板类型
- **`assets/`** — 静态资源：CSS、JS、SVG 图标
- **`snippets/`** — 38 个可复用片段（card-product, price, buy-buttons, icon-* 等）
- **`config/settings_schema.json`** — 主题设置项定义
- **设计系统**：颜色方案通过 CSS custom properties + RGB channel values 实现，5 个预定义 `color-scheme`，详见 `DESIGN.md`

## 自定义 Sections（在 Dawn 基础上新增）

| Section | 用途 | 特殊说明 |
|---------|------|---------|
| `hero.liquid` | 全屏背景图 hero | 从 `assets/hero-bg.jpg` 加载，硬编码 |
| `featured-collection.liquid` | 展示前 8 个商品 | 2 列桌面 / 1 列移动 |
| `low-stock-slider.liquid` | 低库存商品 Swiper 轮播 | 库存 ≤ 5，响应式 1→2→4 张 |
| `anchor-navigation.liquid` | 锚点导航菜单 | 粘性导航 + 平滑滚动 + 高亮跟踪 |
| `template-content.liquid` | 通用模板渲染 | 分支处理所有非首页模板类型 |

## 本地 ↔ 线上主题同步工作流

```
编辑器创建模板 → theme pull 拉到本地 → 本地开发 → theme push 推回未发布版本
```

**关键规则：** `shopify theme dev` 是**单向**推送（本地→线上），编辑器修改不会自动拉回本地。编辑器改了必须手动 `theme pull`。

## 开发命令

```bash
# 本地开发预览（自动推送修改到临时开发主题）
shopify theme dev

# 校验主题（检测 Liquid 错误、Schema 问题）
shopify theme check

# push dev to live

**拉取dev更新, 再push**
shopify theme pull -d --only config/settings_data.json --only templates/*.json

shopify theme push --theme autoparts --allow-live

# 拉取线上发布主题到本地
shopify theme pull

# 拉取指定名称的未发布主题
shopify theme pull --theme autoparts

# 推送到未发布版本时保留线上有但本地没有的文件
shopify theme push --unpublished --theme autoparts

# 推送到已发布的主题
shopify theme push

# 锚点导航用法：在 anchor-navigation section 中添加 anchor_link block，
# anchor_id 填写目标元素的 HTML id（如 "contact-form"、"description"、"reviews"）
```

## Blocks 设计原则

Blocks and flexibility
To balance simplicity and flexibility, you should carefully consider when to add blocks and what each block should contain. Too many blocks creates clutter and complexity. You can use the following principles to understand how to define your blocks.

Group settings into blocks to simplify the editing experience and declutter the editor sidebar. For example, you can nest theme settings to customize an image block inside of the block.
When elements follow a specific hierarchy, group elements together and optionally allow block insertion points before and after. For example, you might create a single block that controls cart page line items.
Avoid providing blocks that are too granular. Granularity adds complexity to the theme code and to the merchant editing experience. For example, you should group the author, date, and comments into a single block or into settings, rather than introducing these attributes as three separate blocks.

## Sections 设计原则
Sections are available on all pages.

When building theme templates, you should ensure that your template's default content is available in a main template section, and that sections can be added, removed, and reordered. You can use sections to do the following:

To add, remove, or reorder content at the template or section group level
To control theme settings that are scoped to the entire section's layout and content
