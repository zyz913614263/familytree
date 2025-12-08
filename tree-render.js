// 渲染模块

// 更新函数
function update(source) {
    // 重新计算树布局（只考虑可见节点，折叠的节点会被自动排除）
    const treeData = treeLayout(root);

    // 获取所有可见节点（descendants会自动排除折叠的节点）
    const nodes = treeData.descendants();
    const links = treeData.links();

    // 如果是从根节点更新，重新初始化根节点位置
    if (source === root || source.depth === 0) {
        root.x0 = width / 2;
        root.y0 = 0;
    }

    // 只基于可见节点重新计算位置

    // 设置节点新位置（垂直方向间距，根据深度调整）
    // 计算每层的间距，考虑节点高度和缩放
    const baseNodeHeight = getNodeHeight(0);

    // D3 tree布局会自动计算x坐标（垂直位置），无需手动设置

    // 计算并设置每个节点的y坐标（水平位置）
    // y值以根节点的y为初值，根据层数依次增加固定值
    const rootNode = nodes.find(d => d.depth === 0);
    const rootY = rootNode ? rootNode.y : width / 2; // 根节点的y坐标作为初值
    const fixedYSpacing = 120; // y坐标每层增加的固定值

    nodes.forEach(d => {
        // y坐标 = 根节点的y + 层数 * 固定值
        d.y = rootY + d.depth * fixedYSpacing * 2;
    });

    // 调整节点位置以避免重叠（只调整可见节点）
    // adjustNodePositions函数内部会递归处理，只处理可见的子节点
    //adjustNodePositions(nodes);

    // 添加节点
    const node = svg.selectAll(".node")
        .data(nodes, d => d.id || (d.id = ++i));

    // 添加新节点
    const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .on("click", click)
        .on("dblclick", dblclick)
        .on("mouseover", function (event, d) {
            // 鼠标悬浮时高亮路径（悬浮高亮，可以与选中高亮叠加）
            highlightPathToRoot(d, false);
        })
        .on("mouseout", function (event, d) {
            // 鼠标移开时，移除悬浮高亮，保留选中高亮
            removeHoverHighlight();
            // 如果有选中的节点，恢复选中节点的路径高亮
            if (selectedNode) {
                highlightPathToRoot(selectedNode, true);
            }
        })
        .style("cursor", "pointer");

    // 添加长方形节点（根据深度缩放）
    nodeEnter.append("rect")
        .attr("width", d => getNodeWidth(d))
        .attr("height", d => getNodeHeight(d.depth))
        .attr("x", d => -getNodeWidth(d) / 2)
        .attr("y", d => -getNodeHeight(d.depth) / 2)
        .style("fill", d => {
            if (d === selectedNode) return "#ffd700";
            return d._children ? "lightsteelblue" : "#fff";
        })
        .style("stroke", d => d === selectedNode ? "#ff8c00" : "#4a6fa5")
        .style("stroke-width", d => d === selectedNode ? "4px" : "3px");

    // 添加节点文本（根据深度缩放字体）
    nodeEnter.append("text")
        .attr("dy", ".35em")
        .attr("font-size", d => getNodeFontSize(d.depth))
        .text(d => d.data.name);

    // 更新节点位置和尺寸
    const nodeUpdate = node.merge(nodeEnter);

    // 设置选中状态的class（在transition之前）
    nodeUpdate.classed("selected", d => d === selectedNode)
        .style("cursor", "pointer")
        .on("click", click)
        .on("dblclick", dblclick)
        .on("mouseover", function (event, d) {
            // 鼠标悬浮时高亮路径（悬浮高亮，可以与选中高亮叠加）
            highlightPathToRoot(d, false);
        })
        .on("mouseout", function (event, d) {
            // 鼠标移开时，移除悬浮高亮，保留选中高亮
            removeHoverHighlight();
            // 如果有选中的节点，恢复选中节点的路径高亮
            if (selectedNode) {
                highlightPathToRoot(selectedNode, true);
            }
        });

    // 应用位置变换动画
    nodeUpdate
        .transition()
        .duration(500)
        .attr("transform", d => `translate(${d.y},${d.x})`);

    // 更新节点矩形尺寸和样式
    nodeUpdate.select("rect")
        .transition()
        .duration(500)
        .attr("width", d => getNodeWidth(d))
        .attr("height", d => getNodeHeight(d.depth))
        .attr("x", d => -getNodeWidth(d) / 2)
        .attr("y", d => -getNodeHeight(d.depth) / 2)
        .style("fill", function (d) {
            // 检查是否有路径高亮
            const node = d3.select(this.parentNode);
            if (node.classed("path-selected") && node.classed("path-hover")) {
                return "#e6ffe6"; // 叠加效果（绿色）
            }
            if (node.classed("path-selected")) {
                return "#fff4e6"; // 选中路径
            }
            if (node.classed("path-hover")) {
                return "#e6f7ff"; // 悬浮路径
            }
            // 默认样式
            if (d === selectedNode) return "#ffd700";
            return d._children ? "lightsteelblue" : "#fff";
        })
        .style("stroke", function (d) {
            const node = d3.select(this.parentNode);
            if (node.classed("path-selected") && node.classed("path-hover")) {
                return "#00cc00"; // 叠加效果（绿色）
            }
            if (node.classed("path-selected")) {
                return "#ff4500"; // 选中路径
            }
            if (node.classed("path-hover")) {
                return "#00bfff"; // 悬浮路径
            }
            // 默认样式
            return d === selectedNode ? "#ff8c00" : "#4a6fa5";
        })
        .style("stroke-width", function (d) {
            const node = d3.select(this.parentNode);
            if (node.classed("path-selected") && node.classed("path-hover")) {
                return "5px"; // 叠加效果
            }
            if (node.classed("path-selected")) {
                return "4px"; // 选中路径
            }
            if (node.classed("path-hover")) {
                return "3.5px"; // 悬浮路径
            }
            // 默认样式
            return d === selectedNode ? "4px" : "3px";
        });

    // 更新节点文本字体大小
    nodeUpdate.select("text")
        .transition()
        .duration(500)
        .attr("font-size", d => getNodeFontSize(d.depth));

    // 移除退出节点
    const nodeExit = node.exit()
        .transition()
        .duration(500)
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .remove();

    // 添加连接线
    const link = svg.selectAll(".link")
        .data(links, d => d.target.id);

    // 创建折线连接器（Z形：先水平，再垂直，再水平）
    // 在D3 v7中，使用d3.line()来创建折线
    const line = d3.line()
        .curve(d3.curveStepAfter) // 使用折线
        .x(d => d[0])  // x坐标
        .y(d => d[1]); // y坐标

    // 创建Z型折线路径的函数
    const linkGenerator = (d) => {
        // 检查数据是否有效
        if (!d || !d.source || !d.target) {
            return "M 0 0";
        }

        // 获取节点宽度
        const parentWidth = getNodeWidth(d.source);
        const parentHeight = getNodeHeight(d.source);
        const childWidth = getNodeWidth(d.target);

        // 计算起点：父节点右边中点
        // 注意：在垂直树中，x是垂直方向（上下），y是水平方向（左右）
        const startX = d.source.x;                    // 父节点垂直中心
        const startY = d.source.y + parentWidth / 2;  // 父节点右边

        // 计算终点：子节点左边中点
        const endX = d.target.x;                      // 子节点垂直中心
        const endY = d.target.y;     // 子节点左边

        // 计算中间转折点

        const midY = startY + parentWidth / 2;   // 水平方向的中间位置

        // Z型路径的4个点：起点 -> 水平移动 -> 垂直移动 -> 终点
        const points = [
            [startY, startX],    // 1. 起点：父节点右边
            [midY, startX],      // 2. 水平移动到中间（垂直位置不变）
            [midY, endX],        // 3. 垂直移动到中间，水平移动到子节点位置
            [endY, endX]         // 4. 终点：子节点左边
        ];
        return line(points);
    };

    // 添加新连接线（在节点之前插入，确保连接线在节点下方）
    const linkEnter = link.enter().insert("path", ".node")
        .attr("class", "link")
        .attr("d", d => {
            // 初始状态：从源节点位置开始
            const o = { x: source.x0, y: source.y0 };
            return linkGenerator({ source: o, target: o });
        });

    // 更新连接线位置
    const linkUpdate = link.merge(linkEnter);
    linkUpdate
        .transition()
        .duration(500)
        .attr("d", d => linkGenerator(d));

    // 移除退出连接线
    link.exit()
        .transition()
        .duration(500)
        .remove();

    // 保存旧位置
    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // 更新SVG尺寸以适应所有节点
    updateSVGSize();

    // 如果有选中的节点，高亮其路径（选中高亮）
    if (selectedNode) {
        highlightPathToRoot(selectedNode, true);
    }
}

