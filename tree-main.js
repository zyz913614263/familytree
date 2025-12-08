// 主文件 - 初始化和全局变量

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

