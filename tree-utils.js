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

// 计算节点宽度的辅助函数
function getNodeWidth(d) {
    return 120;
}

// 计算节点高度的辅助函数
function getNodeHeight(depth = 0) {
    return 60;
}

// 计算节点字体大小的辅助函数
function getNodeFontSize(depth) {
    return "14px";
}

