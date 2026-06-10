# PetExpress — Shopify 主题 MVP

## 基于 Dawn 结构，仅支持 Online Store 2.0

### 首页包含

1. **Hero Section** (`sections/hero.liquid`)
   - 全屏背景图（从 `assets/hero-bg.jpg` 加载）
   - 图片叠加 + 渐变蒙层
   - 店铺名称 + 副标题 + 按钮
   - 无设置项，直接硬编码

2. **Featured Collection** (`sections/featured-collection.liquid`)
   - 展示 `collections.all` 的前 8 个商品
   - 桌面端 2 列网格，移动端 1 列
   - 商品卡片：图片 + 标题 + 价格

3. **Low Stock Slider** (`sections/low-stock-slider.liquid`)
   - 使用 Swiper 横向滚动
   - 仅显示库存 ≤ 5 的商品（`variant.inventory_quantity`）
   - 响应式：移动 1 张 → 平板 2 → 桌面 4

### 架构概览

Shopify Online Store 2.0 采用**模板驱动渲染**：

- **`layout/theme.liquid`** — 页面外壳，包含 `{{ content_for_header }}`（Shopify 注入）和 `{{ content_for_layout }}`（模板内容）。Swiper CSS/JS 通过 CDN 在此加载
- **`templates/*.json`** — 定义页面由哪些 section 组成及排列顺序
  - `index.json`：首页，引用 3 个自定义 section
  - 其余 8 个模板（product / collection / cart / search / page / blog / article / 404）统一引用 `template-content` section
- **`sections/*.liquid`** — 可复用 UI 组件。每个 section 含 Liquid 模板 + `{% schema %}` 块
  - **首页专用**：`hero.liquid`、`featured-collection.liquid`、`low-stock-slider.liquid`
  - **通用降级渲染器**：`template-content.liquid` — 通过 `{% if template == '...' %}` 分支处理 8 种模板类型，使用 Shopify 原生 Liquid 对象（`product`、`collection`、`cart`、`page`、`article`、`blog`、`search`）渲染对应内容
- **`assets/`** — 静态资源：`theme.css`（系统字体栈，无外部依赖）、`theme.js`（Swiper 初始化）
- **`config/settings_schema.json`** — 仅 `theme_info`，无用户可调设置项

### 产品页说明

产品页 (`templates/product.json`) 引用 `sections/template-content.liquid`，在该 section 中通过 `{% if template == 'product' %}` 分支渲染：
- 商品标题和价格
- 商品描述（`product.description`）

如需更丰富的产品页（图片库、选款、加购按钮），可新建 `sections/main-product.liquid`，然后在 `templates/product.json` 中引用。

### 技术约束

- 纯 Liquid + 原生 CSS（系统字体栈，不引入外部字体）
- Swiper 11 通过 CDN 引入（唯一第三方依赖）
- 所有 section 无 `settings` 属性，内容直接硬编码

### 开发命令

```bash
# 本地开发预览
shopify theme dev

# 校验主题（检测 Liquid 错误、Schema 问题）
shopify theme check

# 部署到 Shopify 商店（需先配置 store）
shopify theme push --store your-store.myshopify.com

# 部署到临时环境（不发布）
shopify theme push --store your-store.myshopify.com --unpublished

# 添加 hero 图片：将 xxx.jpg 放入 assets/ 目录，section 会自动加载
# Swiper 通过 CDN 加载，本地开发无需额外安装
```
