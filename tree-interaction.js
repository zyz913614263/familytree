// 交互模块（点击、双击、高亮等）

// 高亮从节点到根节点的路径（用于选中状态）
function highlightPathToRoot(node, isSelected = true) {
    if (!node) return;

    // 找到从当前节点到根节点的所有连线和节点
    let currentNode = node;

    // 先高亮当前节点
    const currentNodeElement = svg.selectAll(".node")
        .filter(d => d === currentNode);

    if (currentNodeElement.size() > 0) {
        const rect = currentNodeElement.select("rect");
        if (isSelected) {
            currentNodeElement.classed("path-selected", true);
            // 直接设置样式，确保优先级
            rect.style("fill", "#fff4e6")
                .style("stroke", "#ff4500")
                .style("stroke-width", "4px");
        } else {
            currentNodeElement.classed("path-hover", true);
            // 检查是否已有选中高亮
            const hasSelected = currentNodeElement.classed("path-selected");
            if (hasSelected) {
                // 叠加效果（绿色）
                rect.style("fill", "#e6ffe6")
                    .style("stroke", "#00cc00")
                    .style("stroke-width", "5px");
            } else {
                rect.style("fill", "#e6f7ff")
                    .style("stroke", "#00bfff")
                    .style("stroke-width", "3.5px");
            }
        }
    }

    // 向上遍历到根节点
    while (currentNode && currentNode.parent) {
        // 高亮父节点
        const parentElement = svg.selectAll(".node")
            .filter(d => d === currentNode.parent);

        if (parentElement.size() > 0) {
            const rect = parentElement.select("rect");
            if (isSelected) {
                parentElement.classed("path-selected", true);
                rect.style("fill", "#fff4e6")
                    .style("stroke", "#ff4500")
                    .style("stroke-width", "4px");
            } else {
                parentElement.classed("path-hover", true);
                // 检查是否已有选中高亮
                const hasSelected = parentElement.classed("path-selected");
                if (hasSelected) {
                    // 叠加效果（绿色）
                    rect.style("fill", "#e6ffe6")
                        .style("stroke", "#00cc00")
                        .style("stroke-width", "5px");
                } else {
                    rect.style("fill", "#e6f7ff")
                        .style("stroke", "#00bfff")
                        .style("stroke-width", "3.5px");
                }
            }
        }

        // 找到连接当前节点和父节点的连线
        const link = svg.selectAll(".link")
            .filter(d => d.target === currentNode);

        if (link.size() > 0) {
            if (isSelected) {
                link.classed("selected-highlight", true);
            } else {
                link.classed("hover-highlight", true);
            }
        }

        currentNode = currentNode.parent;
    }
}

// 移除选中高亮
function removeSelectedHighlight() {
    svg.selectAll(".link").classed("selected-highlight", false);
    const nodes = svg.selectAll(".node.path-selected");
    nodes.classed("path-selected", false);
    // 恢复节点样式
    nodes.select("rect").each(function (d) {
        const rect = d3.select(this);
        const node = d3.select(this.parentNode);
        // 检查是否还有悬浮高亮
        if (node.classed("path-hover")) {
            rect.style("fill", "#e6f7ff")
                .style("stroke", "#00bfff")
                .style("stroke-width", "3.5px");
        } else {
            // 恢复默认样式
            if (d === selectedNode) {
                rect.style("fill", "#ffd700")
                    .style("stroke", "#ff8c00")
                    .style("stroke-width", "4px");
            } else {
                rect.style("fill", d._children ? "lightsteelblue" : "#fff")
                    .style("stroke", "#4a6fa5")
                    .style("stroke-width", "3px");
            }
        }
    });
}

// 移除悬浮高亮
function removeHoverHighlight() {
    svg.selectAll(".link").classed("hover-highlight", false);
    const nodes = svg.selectAll(".node.path-hover");
    nodes.classed("path-hover", false);
    // 恢复节点样式
    nodes.select("rect").each(function (d) {
        const rect = d3.select(this);
        const node = d3.select(this.parentNode);
        // 检查是否还有选中高亮
        if (node.classed("path-selected")) {
            rect.style("fill", "#fff4e6")
                .style("stroke", "#ff4500")
                .style("stroke-width", "4px");
        } else {
            // 恢复默认样式
            if (d === selectedNode) {
                rect.style("fill", "#ffd700")
                    .style("stroke", "#ff8c00")
                    .style("stroke-width", "4px");
            } else {
                rect.style("fill", d._children ? "lightsteelblue" : "#fff")
                    .style("stroke", "#4a6fa5")
                    .style("stroke-width", "3px");
            }
        }
    });
}

// 移除所有高亮（兼容旧代码）
function removeHighlight() {
    removeSelectedHighlight();
    removeHoverHighlight();
}

// 点击节点事件（选中功能）
function click(event, d) {
    // 阻止事件冒泡，避免触发其他事件
    event.stopPropagation();

    // 切换选中状态
    if (selectedNode === d) {
        // 如果点击的是已选中的节点，取消选中
        selectedNode = null;
        removeSelectedHighlight(); // 取消选中时移除选中高亮
    } else {
        // 选中新节点
        selectedNode = d;
        highlightPathToRoot(d, true); // 选中时高亮路径（选中高亮）
    }

    // 更新视图以显示选中状态
    update(root);
}

// 双击节点事件（折叠/展开功能）
function dblclick(event, d) {
    // 阻止事件冒泡，避免触发其他事件
    event.stopPropagation();

    // 处理折叠/展开
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    // 折叠/展开后，重新从根节点开始计算整个树的位置
    update(root);
}

