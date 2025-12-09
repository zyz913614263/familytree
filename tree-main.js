// 主文件 - 初始化和全局变量

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
// 声明全局变量（将在初始化函数中赋值）
let svgElement;
let svg;
let currentTransform = d3.zoomIdentity;

// 标记是否是首次加载（用于决定是否自动调整视图）
let isFirstLoad = true;

// 当前选中的节点
let selectedNode = null;

// 节点ID计数器
let i = 0;

// 布局模块

// 创建树布局
let treeLayout = d3.tree()
    .size([height, width])

// 创建层级数据
const root = d3.hierarchy(treeData);
root.x0 = width / 2;
root.y0 = 0;

// 初始化函数
function init() {
    // 创建SVG容器（初始尺寸，后续会根据实际图案大小更新）
    svgElement = d3.select("#tree-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg = svgElement
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 初始化变换状态
    currentTransform = d3.zoomIdentity;

    // 将zoom绑定到SVG元素上
    svgElement.call(zoom);

    // 处理双指滑动（平移）- 当没有按住Ctrl/Cmd键时
    svgElement.on("wheel", function (event) {
        // 如果没有按住Ctrl/Cmd键，处理为平移（双指滑动）
        if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            event.stopPropagation();

            // 检测是否有平移值
            const hasDelta = Math.abs(event.deltaX) > 0 || Math.abs(event.deltaY) > 0;
            if (hasDelta) {
                // 更新transform，实现平移
                // 注意：deltaX和deltaY需要取反，因为SVG坐标系
                currentTransform = currentTransform.translate(-event.deltaX, -event.deltaY);

                // 直接应用transform，不通过zoom.transform，避免触发zoom事件
                svg.attr("transform",
                    `translate(${margin.left + currentTransform.x},${margin.top + currentTransform.y}) scale(${currentTransform.k})`);
            }
        }
    }, { passive: false });

    // 添加触摸事件支持（移动设备）
    // 禁用默认触摸行为，使用D3的zoom处理触摸手势
    svgElement
        .style("touch-action", "none") // 禁用默认触摸行为，使用自定义手势
        .on("touchstart", function (event) {
            // 阻止默认行为，避免页面滚动
            // D3的zoom会自动处理单指和双指触摸
            if (event.touches.length >= 1) {
                event.preventDefault();
            }
        })
        .on("touchmove", function (event) {
            // 阻止默认行为，让D3的zoom处理滑动
            // 支持单指和双指滑动
            if (event.touches.length >= 1) {
                event.preventDefault();
            }
        })
        .on("touchend", function (event) {
            // 触摸结束时也阻止默认行为
            event.preventDefault();
        });

    // 点击背景区域取消选中节点
    /*svgElement.on("click", function (event) {
        // 检查点击的目标是否是节点、连接线或它们的子元素
        const target = event.target;
        const isNode = target.classList.contains("node") ||
            target.closest(".node") !== null;
        const isLink = target.classList.contains("link") ||
            target.closest(".link") !== null;

        // 如果点击的不是节点也不是连接线（即背景区域），取消选中
        if (!isNode && !isLink && selectedNode) {
            selectedNode = null;
            removeSelectedHighlight();
            // 更新视图以移除选中状态
            update(root);
        }
    });*/

    // 初始化树
    i = 0;
    update(root);
}

// 等待DOM加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM已经加载完成
    init();
}

