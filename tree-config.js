// 配置和常量模块

// 树形数据
const treeData = data;

// 根据数据计算树的深度和宽度
const maxDepth = getMaxDepth(treeData);
const maxWidthNodes = getMaxWidth(treeData);

// 设置尺寸和边距
const margin = { top: 50, right: 120, bottom: 50, left: 120 };

// 根据层数动态计算尺寸
// 注意：D3 tree布局的size是[height, width]，其中height对应x坐标（垂直方向），width对应y坐标（水平方向）
// 但y坐标是手动设置的，每层增加240像素

// height: 用于D3 tree布局的x坐标范围（垂直方向），需要足够大以容纳所有节点
// 根据最大节点数和节点宽度估算（每个节点约120像素宽，加上间距）
const nodeWidth = 120;
const nodeSpacing = 50; // 节点之间的间距
const estimatedHeight = maxWidthNodes * (nodeWidth + nodeSpacing);
const baseHeight = 1000; // 基础高度
let height = Math.max(baseHeight, estimatedHeight);

// width: 用于D3 tree布局的y坐标范围（水平方向），但y坐标是手动设置的
// 根据y坐标间距计算（每层240像素）
const fixedYSpacing = 120 * 2; // y坐标每层增加的固定值
const baseWidth = 200; // 基础宽度
let width = baseWidth + maxDepth * fixedYSpacing;

// 初始缩放比例设置（1.0 = 100%，0.5 = 50%，2.0 = 200%）
// 如果设置为 null，则自动计算适合的缩放比例
const initialScale = 0.5; // 设置为 null 自动计算，或设置为具体数值如 0.8, 1.0, 1.5 等

