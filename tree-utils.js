

// 工具函数模块

// 计算树的最大深度
function getMaxDepth(node, currentDepth = 0) {
    if (!node) return currentDepth;
    if (!node.children || node.children.length === 0) {
        return currentDepth;
    }
    let maxDepth = currentDepth;
    node.children.forEach(child => {
        const depth = getMaxDepth(child, currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
    });
    return maxDepth;
}

// 计算树的最大宽度（估算每层的最大节点数）
function getMaxWidth(node) {
    const levelCounts = {};

    function countNodes(n, depth = 0) {
        if (!levelCounts[depth]) {
            levelCounts[depth] = 0;
        }
        levelCounts[depth]++;

        if (n.children) {
            n.children.forEach(child => {
                countNodes(child, depth + 1);
            });
        }
    }

    countNodes(node);

    // 返回最大层级的节点数
    const counts = Object.values(levelCounts);
    return counts.length > 0 ? Math.max(...counts) : 1;
}

// 计算节点缩放比例的辅助函数（根据深度）
function getNodeScale(depth) {
    // 每级缩小15%，根节点为1.0，第一级为0.85，第二级为0.7225，以此类推
    const scaleFactor = 1;
    return Math.pow(scaleFactor, depth);
}

// 计算节点宽度的辅助函数（根据深度缩放）
function getNodeWidth(d) {
    const baseWidth = 120; // Math.max(120, d.data.name.length * 12);
    const scale = getNodeScale(d.depth || 0);
    return baseWidth * scale;
}

// 计算节点高度的辅助函数（根据深度缩放）
function getNodeHeight(depth = 0) {
    const baseHeight = 60;
    const scale = getNodeScale(depth);
    return baseHeight * scale;
}

// 计算节点字体大小的辅助函数（根据深度缩放）
function getNodeFontSize(depth) {
    const baseFontSize = 14;
    const scale = getNodeScale(depth);
    return `${baseFontSize * scale}px`; // 返回带单位的字体大小
}

