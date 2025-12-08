/**
 * ============================================
 * 数据结构说明
 * ============================================
 * 
 * 树形节点数据结构：
 * {
 *   id: string,             // 节点唯一ID（自动生成，格式：node_1, node_2...）
 *   name: string,           // 节点名称（必需）
 *   children?: Array        // 子节点数组（可选）
 * }
 * 
 * 示例：
 * {
 *   id: "node_1",
 *   name: "根节点",
 *   children: [
 *     { id: "node_2", name: "子节点1" },
 *     { 
 *       id: "node_3",
 *       name: "子节点2",
 *       children: [
 *         { id: "node_4", name: "孙节点1" }
 *       ]
 *     }
 *   ]
 * }
 * 
 * 注意：
 * - ID会在添加节点时自动生成
 * - 可以通过ID快速查找和操作节点
 * - 建议使用ID而不是名称来操作节点（名称可能重复）
 * 
 * ============================================
 */

/**
 * ============================================
 * 数据管理模块
 * ============================================
 * 提供树形数据的增加、修改、删除等操作方法
 */

// ID生成器
let nodeIdCounter = 1;

/**
 * 生成唯一ID
 * @returns {string} 唯一ID，格式为 "node_1", "node_2" 等
 */
function generateNodeId() {
    return `node_${nodeIdCounter++}`;
}

/**
 * 根据ID查找节点
 * @param {Object} root - 根节点
 * @param {string} id - 节点ID
 * @returns {Object|null} 找到的节点，如果不存在则返回null
 */
function findNodeById(root, id) {
    if (!root || !id) return null;

    if (root.id === id) {
        return root;
    }

    if (root.children && Array.isArray(root.children)) {
        for (let child of root.children) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
    }

    return null;
}


/**
 * 根据名称查找节点（深度优先搜索）
 * @param {Object} root - 根节点
 * @param {string} name - 要查找的节点名称
 * @returns {Object|null} 找到的节点，如果不存在则返回null
 */
function findNodeByName(root, name) {
    if (!root) return null;

    if (root.name === name) {
        return root;
    }

    if (root.children && Array.isArray(root.children)) {
        for (let child of root.children) {
            const found = findNodeByName(child, name);
            if (found) return found;
        }
    }

    return null;
}

/**
 * 添加子节点
 * @param {Object} parentNode - 父节点对象
 * @param {Object} newNode - 要添加的新节点 { name: string, id?: string, children?: Array }
 * @param {number} index - 可选，插入位置索引，默认为末尾
 * @returns {boolean} 是否添加成功
 */
function addChildNode(parentNode, newNode) {
    if (!parentNode || !newNode || !newNode.name) {
        console.error('添加节点失败：参数无效');
        return false;
    }

    // 确保children数组存在
    if (!parentNode.children) {
        parentNode.children = [];
    }

    // 验证新节点结构，自动生成ID（如果未提供）
    const validNode = {
        id: newNode.id || generateNodeId(),
        name: newNode.name,
        children: newNode.children || undefined
    };

    // 插入节点
    parentNode.children.push(validNode);
    return true;
}

/**
 * 根据父节点ID添加子节点
 * @param {Object} root - 根节点
 * @param {string} parentId - 父节点ID
 * @param {Object} newNode - 要添加的新节点
 * @returns {boolean} 是否添加成功
 */
function addNodeById(root, parentId, newNode) {
    const parentNode = findNodeById(root, parentId);
    if (!parentNode) {
        console.error(`添加节点失败：找不到ID为"${parentId}"的父节点`);
        return false;
    }
    return addChildNode(parentNode, newNode);
}


/**
 * 获取节点的所有子节点数量（递归）
 * @param {Object} node - 节点对象
 * @returns {number} 子节点总数
 */
function getNodeCount(node) {
    if (!node) return 0;

    let count = 1; // 包括自己

    if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => {
            count += getNodeCount(child);
        });
    }

    return count;
}

/**
 * 获取节点的深度
 * @param {Object} node - 节点对象
 * @param {Object} root - 根节点（用于计算深度）
 * @returns {number} 节点深度
 */
function getNodeDepth(node, root) {
    const path = findNodePath(root, node.name);
    return path ? path.length : 0;
}

/**
 * 导出所有节点为数组（扁平化）
 * @param {Object} root - 根节点
 * @returns {Array} 所有节点的数组
 */
function flattenTree(root) {
    const result = [];

    function traverse(node, path = []) {
        if (!node) return;

        result.push({
            node: node,
            path: path,
            name: node.name
        });

        if (node.children && Array.isArray(node.children)) {
            node.children.forEach((child, index) => {
                traverse(child, [...path, index]);
            });
        }
    }

    traverse(root);
    return result;
}


// 树形数据
const data = {
    id: "node_1",
    name: "一世祖",
    children: [
    ]
};

// 添加子节点
addNodeById(data, "node_1", { name: "二世1" });
addNodeById(data, "node_1", { name: "二世2" });
addNodeById(data, "node_1", { name: "二世3" });
addNodeById(data, "node_1", { name: "二世4" });
addNodeById(data, "node_1", { name: "二世5" });
