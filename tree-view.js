// 视图模块（缩放、平移、自动适配）

// 创建zoom行为（需要在autoFitView之前定义）
const zoom = d3.zoom()
    .scaleExtent([0.1, 3]) // 启用缩放，允许0.1到3倍的缩放
    .filter(event => {
        // 对于wheel事件，只有在按住Ctrl/Cmd键时才允许zoom处理（缩放）
        // 否则阻止zoom处理，由自定义wheel处理器处理平移
        if (event.type === "wheel") {
            return event.ctrlKey || event.metaKey;
        }
        return true; // 允许其他事件（鼠标拖拽、触摸等）
    })
    .on("zoom", (event) => {
        // 应用平移和缩放
        // 需要同时应用margin偏移和zoom的变换
        currentTransform = event.transform;
        // D3的zoom transform已经包含了scale，直接应用即可
        svg.attr("transform",
            `translate(${margin.left + event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`);
    });

// 更新SVG尺寸以适应所有节点
function updateSVGSize() {
    const nodes = treeLayout(root).descendants();
    if (nodes.length === 0) return;

    // 计算所有节点的边界（考虑margin偏移）
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    nodes.forEach(d => {
        const nodeWidth = getNodeWidth(d);
        const nodeHeight = getNodeHeight(d.depth);
        // 考虑margin偏移
        const actualX = d.x + margin.left;
        const actualY = d.y + margin.top;
        minX = Math.min(minX, actualX - nodeWidth / 2);
        maxX = Math.max(maxX, actualX + nodeWidth / 2);
        minY = Math.min(minY, actualY);
        maxY = Math.max(maxY, actualY + nodeHeight);
    });

    // 添加足够的边距，确保可以滑动到所有边界
    const padding = 100; // 减小边距，使图像更紧凑
    // 根据实际图案大小计算SVG尺寸，不受屏幕大小影响
    const newWidth = maxX - minX + padding * 2;
    const newHeight = maxY - minY + padding * 2;

    // 更新SVG尺寸
    svgElement
        .attr("width", newWidth)
        .attr("height", newHeight);

    // 只在首次加载时自动调整视图，折叠/展开时保持当前视野位置
    if (isFirstLoad) {
        autoFitView();
        isFirstLoad = false;
    } else {
        // 保持当前的transform，只更新SVG尺寸
        // 应用当前的transform，保持视野位置不变
        svg.attr("transform",
            `translate(${margin.left + currentTransform.x},${margin.top + currentTransform.y}) scale(${currentTransform.k})`);
    }
}

// 自动调整视图，让图像居中并缩放到合适大小
function autoFitView() {
    const nodes = treeLayout(root).descendants();
    if (nodes.length === 0) return;

    // 计算所有节点的边界（在SVG坐标系中，不考虑margin）
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    nodes.forEach(d => {
        const nodeWidth = getNodeWidth(d);
        const nodeHeight = getNodeHeight(d.depth);
        // 节点在svg group中的坐标（已经考虑了margin偏移）
        const nodeX = d.x;
        const nodeY = d.y;
        minX = Math.min(minX, nodeX - nodeWidth / 2);
        maxX = Math.max(maxX, nodeX + nodeWidth / 2);
        minY = Math.min(minY, nodeY);
        maxY = Math.max(maxY, nodeY + nodeHeight);
    });

    // 计算容器的实际大小
    const container = document.getElementById("tree-container");
    if (!container) {
        return; // 如果容器不存在，直接返回
    }
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // 计算内容的大小
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // 如果内容为空或容器为空，不进行调整
    if (contentWidth <= 0 || contentHeight <= 0 || containerWidth <= 0 || containerHeight <= 0) {
        return;
    }

    // 计算缩放比例，留出一些边距（10%）
    let scale;
    if (initialScale !== null) {
        // 使用固定的初始缩放比例
        scale = initialScale;
    } else {
        // 自动计算适合的缩放比例
        const scaleX = (containerWidth * 0.9) / contentWidth;
        const scaleY = (containerHeight * 0.9) / contentHeight;
        scale = Math.min(scaleX, scaleY, 1); // 不放大，只缩小
    }

    // 计算内容的中心点（在svg group坐标系中）
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // 计算需要平移的距离，使内容居中
    // 需要考虑margin偏移和缩放
    const translateX = (containerWidth / 2 - margin.left) - centerX * scale;
    const translateY = (containerHeight / 2 - margin.top) - centerY * scale;

    // 应用变换
    const transform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale);

    currentTransform = transform;
    svgElement
        .transition()
        .duration(750)
        .call(zoom.transform, transform);
}

