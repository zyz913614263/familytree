# 树形结构可视化项目

一个基于 D3.js 的交互式树形结构可视化工具，支持家谱、组织架构等层级数据的展示。

## 功能特性

### 🎨 可视化功能
- **垂直树形布局**：采用垂直方向的树形结构展示数据
- **自适应节点尺寸**：根据节点深度自动调整节点大小和字体
- **智能布局**：自动计算节点位置，避免重叠
- **Z型连接线**：使用折线连接父子节点，清晰展示层级关系

### 🖱️ 交互功能
- **节点选择**：单击节点进行选中/取消选中
- **折叠/展开**：双击节点可以折叠或展开子树
- **路径高亮**：选中或悬浮节点时，高亮显示从该节点到根节点的完整路径
- **叠加效果**：同时选中和悬浮时，显示叠加的高亮效果（绿色）

### 🔍 视图控制
- **缩放功能**：按住 Ctrl/Cmd + 滚轮进行缩放（0.1x - 3x）
- **平移功能**：滚轮（无修饰键）或拖拽进行平移
- **自动适配**：首次加载时自动调整视图，使树形结构居中显示
- **触摸支持**：支持移动设备的触摸手势操作

### 🎯 高亮效果
- **选中高亮**：选中节点时，节点和路径显示橙红色高亮
- **悬浮高亮**：鼠标悬浮时，节点和路径显示天蓝色高亮
- **叠加高亮**：同时选中和悬浮时，显示绿色叠加效果
- **动画效果**：选中的节点具有闪烁动画效果

## 项目结构

```
familytree/
├── tree.html              # 主 HTML 文件
├── styles.css             # 样式文件
├── data.js                # 数据文件（树形数据）
├── tree-utils.js          # 工具函数模块
├── tree-config.js         # 配置和常量模块
├── tree-layout.js         # 布局模块
├── tree-view.js           # 视图控制模块（缩放、平移）
├── tree-interaction.js    # 交互模块（点击、高亮）
├── tree-render.js         # 渲染模块（节点和连线绘制）
└── tree-main.js           # 主文件（初始化）
```

## 文件说明

### 核心文件

- **tree.html**：主页面，包含 HTML 结构和脚本引用
- **styles.css**：所有样式定义，包括节点样式、连线样式、高亮效果和动画

### JavaScript 模块

#### tree-utils.js
工具函数模块，提供：
- `getMaxDepth()` - 计算树的最大深度
- `getMaxWidth()` - 计算树的最大宽度
- `getNodeScale()` - 计算节点缩放比例
- `getNodeWidth()` - 计算节点宽度
- `getNodeHeight()` - 计算节点高度
- `getNodeFontSize()` - 计算节点字体大小

#### tree-config.js
配置模块，包含：
- 树形数据引用
- 尺寸和边距配置
- 初始缩放比例设置

#### tree-layout.js
布局模块，负责：
- D3 tree 布局配置
- 根节点初始化

#### tree-view.js
视图控制模块，提供：
- `zoom` - D3 zoom 行为配置
- `updateSVGSize()` - 更新 SVG 尺寸以适应内容
- `autoFitView()` - 自动调整视图，使内容居中显示

#### tree-interaction.js
交互模块，处理：
- `highlightPathToRoot()` - 高亮从节点到根节点的路径
- `removeSelectedHighlight()` - 移除选中高亮
- `removeHoverHighlight()` - 移除悬浮高亮
- `click()` - 节点点击事件处理（选中功能）
- `dblclick()` - 节点双击事件处理（折叠/展开）

#### tree-render.js
渲染模块，负责：
- `update()` - 主更新函数，处理节点和连线的创建、更新、删除
- 连接线生成器（Z型折线）

#### tree-main.js
主文件，包含：
- 全局变量声明
- `init()` - 初始化函数
- DOM 加载处理
- 事件绑定（滚轮、触摸）

## 使用方法

### 1. 准备数据

在 `data.js` 文件中定义树形数据，格式如下：

```javascript
const data = {
    name: "根节点",
    children: [
        {
            name: "子节点1",
            children: [
                { name: "孙节点1" },
                { name: "孙节点2" }
            ]
        },
        {
            name: "子节点2"
        }
    ]
};
```

### 2. 打开页面

直接在浏览器中打开 `tree.html` 文件即可。

### 3. 交互操作

- **单击节点**：选中/取消选中节点
- **双击节点**：折叠/展开子树
- **鼠标悬浮**：查看节点到根节点的路径高亮
- **Ctrl/Cmd + 滚轮**：缩放视图
- **滚轮（无修饰键）**：平移视图
- **拖拽**：平移视图

## 配置选项

### 初始缩放比例

在 `tree-config.js` 中修改 `initialScale` 变量：

```javascript
const initialScale = 0.5; // 0.5 = 50%，1.0 = 100%，设置为 null 自动计算
```

### 节点尺寸

在 `tree-utils.js` 中修改基础尺寸：

```javascript
// 节点宽度
const baseWidth = 120;

// 节点高度
const baseHeight = 60;

// 字体大小
const baseFontSize = 14;
```

### 布局间距

在 `tree-config.js` 中修改间距配置：

```javascript
// y坐标每层增加的固定值
const fixedYSpacing = 120 * 2;

// 节点之间的间距
const nodeSpacing = 50;
```

## 技术栈

- **D3.js v7**：数据驱动的可视化库
- **HTML5**：页面结构
- **CSS3**：样式和动画
- **原生 JavaScript**：业务逻辑

## 浏览器兼容性

- Chrome（推荐）
- Firefox
- Safari
- Edge

支持现代浏览器，需要支持 ES6+ 语法。

## 开发说明

### 代码组织

项目采用模块化设计，将功能拆分为多个独立的 JavaScript 文件：

1. **工具函数**（tree-utils.js）：纯函数，无副作用
2. **配置**（tree-config.js）：常量和配置项
3. **布局**（tree-layout.js）：D3 布局配置
4. **视图**（tree-view.js）：缩放和平移控制
5. **交互**（tree-interaction.js）：用户交互处理
6. **渲染**（tree-render.js）：DOM 操作和可视化
7. **主文件**（tree-main.js）：初始化和入口

### 全局变量

- `svgElement` - SVG 容器元素
- `svg` - SVG 内部 group 元素
- `currentTransform` - 当前变换状态
- `isFirstLoad` - 是否首次加载标志
- `selectedNode` - 当前选中的节点
- `i` - 节点 ID 计数器

### 扩展开发

如需添加新功能：

1. **新增工具函数**：在 `tree-utils.js` 中添加
2. **新增交互**：在 `tree-interaction.js` 中添加事件处理函数
3. **修改样式**：在 `styles.css` 中添加或修改样式规则
4. **调整布局**：在 `tree-layout.js` 或 `tree-render.js` 中修改布局逻辑

## 注意事项

1. **数据格式**：确保 `data.js` 中的数据格式正确，必须包含 `name` 属性
2. **文件顺序**：在 `tree.html` 中，脚本文件的加载顺序很重要，不要随意调整
3. **DOM 加载**：代码使用 `DOMContentLoaded` 确保 DOM 完全加载后再执行
4. **性能优化**：对于大型树结构，可能需要优化渲染性能

## 许可证

本项目仅供学习和研究使用。

## 更新日志

### 最新版本
- ✅ 代码模块化拆分
- ✅ 支持节点选中和路径高亮
- ✅ 支持折叠/展开功能
- ✅ 支持缩放和平移
- ✅ 支持触摸设备
- ✅ 优化视图自动适配

---

如有问题或建议，欢迎反馈！

