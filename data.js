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
addNodeById(data, "node_1", { name: "二世2" });
addNodeById(data, "node_1", { name: "二世3" });
addNodeById(data, "node_1", { name: "二世4" });
addNodeById(data, "node_1", { name: "二世5" });
addNodeById(data, "node_1", { name: "二世6" });

addNodeById(data, "node_2", { name: "三世7" });
addNodeById(data, "node_2", { name: "三世8" });
addNodeById(data, "node_2", { name: "三世9" });
addNodeById(data, "node_2", { name: "三世10" });

addNodeById(data, "node_3", { name: "三世11" });
addNodeById(data, "node_3", { name: "三世12" });
addNodeById(data, "node_4", { name: "三世13" });
addNodeById(data, "node_4", { name: "三世14" });

addNodeById(data, "node_5", { name: "三世15" });
addNodeById(data, "node_6", { name: "三世16" });

addNodeById(data, "node_7", { name: "四世17" });
addNodeById(data, "node_8", { name: "四世18" });
addNodeById(data, "node_9", { name: "四世19" });
addNodeById(data, "node_10", { name: "四世20" });

addNodeById(data, "node_11", { name: "四世21" });
addNodeById(data, "node_12", { name: "四世22" });
addNodeById(data, "node_13", { name: "四世23" });
addNodeById(data, "node_14", { name: "四世24" });

addNodeById(data, "node_15", { name: "四世25" });
addNodeById(data, "node_16", { name: "四世26" });

addNodeById(data, "node_17", { name: "五世27" });
addNodeById(data, "node_18", { name: "五世28" });
addNodeById(data, "node_19", { name: "五世29" });
addNodeById(data, "node_20", { name: "五世30" });

addNodeById(data, "node_21", { name: "五世31" });
addNodeById(data, "node_22", { name: "五世32" });
addNodeById(data, "node_23", { name: "五世33" });
addNodeById(data, "node_24", { name: "五世34" });

addNodeById(data, "node_25", { name: "五世35" });
addNodeById(data, "node_26", { name: "五世36" });

addNodeById(data, "node_27", { name: "六世37" });
addNodeById(data, "node_28", { name: "六世38" });
addNodeById(data, "node_29", { name: "六世39" });
addNodeById(data, "node_30", { name: "六世40" });

addNodeById(data, "node_31", { name: "六世41" });
addNodeById(data, "node_32", { name: "六世42" });
addNodeById(data, "node_33", { name: "六世43" });
addNodeById(data, "node_34", { name: "六世44" });

addNodeById(data, "node_35", { name: "六世45" });
addNodeById(data, "node_36", { name: "六世46" });

addNodeById(data, "node_37", { name: "七世47" });
addNodeById(data, "node_38", { name: "七世48" });
addNodeById(data, "node_39", { name: "七世49" });
addNodeById(data, "node_40", { name: "七世50" });

addNodeById(data, "node_41", { name: "七世51" });
addNodeById(data, "node_42", { name: "七世52" });
addNodeById(data, "node_43", { name: "七世53" });
addNodeById(data, "node_44", { name: "七世54" });

addNodeById(data, "node_45", { name: "七世55" });
addNodeById(data, "node_46", { name: "七世56" });

addNodeById(data, "node_47", { name: "八世57" });
addNodeById(data, "node_48", { name: "八世58" });
addNodeById(data, "node_49", { name: "八世59" });
addNodeById(data, "node_50", { name: "八世60" });

addNodeById(data, "node_51", { name: "八世61" });
addNodeById(data, "node_52", { name: "八世62" });
addNodeById(data, "node_53", { name: "八世63" });
addNodeById(data, "node_54", { name: "八世64" });

addNodeById(data, "node_55", { name: "八世65" });
addNodeById(data, "node_56", { name: "八世66" });

addNodeById(data, "node_57", { name: "九世67" });
addNodeById(data, "node_58", { name: "九世68" });
addNodeById(data, "node_59", { name: "九世69" });
addNodeById(data, "node_60", { name: "九世70" });

addNodeById(data, "node_61", { name: "九世71" });
addNodeById(data, "node_62", { name: "九世72" });
addNodeById(data, "node_63", { name: "九世73" });
addNodeById(data, "node_64", { name: "九世74" });

addNodeById(data, "node_65", { name: "九世75" });
addNodeById(data, "node_66", { name: "九世76" });
addNodeById(data, "node_67", { name: "九世77" });
addNodeById(data, "node_68", { name: "九世78" });
addNodeById(data, "node_69", { name: "九世79" });
addNodeById(data, "node_70", { name: "九世80" });

addNodeById(data, "node_71", { name: "九世81" });
addNodeById(data, "node_72", { name: "九世82" });
addNodeById(data, "node_73", { name: "九世83" });
addNodeById(data, "node_74", { name: "九世84" });

addNodeById(data, "node_75", { name: "十世85" });
addNodeById(data, "node_76", { name: "十世86" });
addNodeById(data, "node_77", { name: "十世87" });
addNodeById(data, "node_78", { name: "十世88" });
addNodeById(data, "node_79", { name: "十世89" });
addNodeById(data, "node_80", { name: "十世90" });

addNodeById(data, "node_81", { name: "十世91" });
addNodeById(data, "node_82", { name: "十世92" });
addNodeById(data, "node_83", { name: "十世93" });
addNodeById(data, "node_84", { name: "十世94" });

addNodeById(data, "node_85", { name: "十世95" });
addNodeById(data, "node_86", { name: "十世96" });
addNodeById(data, "node_87", { name: "十世97" });
addNodeById(data, "node_88", { name: "十世98" });
addNodeById(data, "node_89", { name: "十世99" });
addNodeById(data, "node_90", { name: "十世100" });

addNodeById(data, "node_91", { name: "十世101" });
addNodeById(data, "node_92", { name: "十世102" });
addNodeById(data, "node_93", { name: "十世103" });
addNodeById(data, "node_94", { name: "十世104" });

addNodeById(data, "node_95", { name: "十世105" });
addNodeById(data, "node_96", { name: "十世106" });
addNodeById(data, "node_97", { name: "十世107" });
addNodeById(data, "node_98", { name: "十世108" });
addNodeById(data, "node_99", { name: "十世109" });
addNodeById(data, "node_100", { name: "十世110" });

addNodeById(data, "node_101", { name: "十一世111" });
addNodeById(data, "node_102", { name: "十一世112" });
addNodeById(data, "node_103", { name: "十一世113" });
addNodeById(data, "node_104", { name: "十一世114" });

addNodeById(data, "node_105", { name: "十一世115" });
addNodeById(data, "node_106", { name: "十一世116" });
addNodeById(data, "node_107", { name: "十一世117" });
addNodeById(data, "node_108", { name: "十一世118" });
addNodeById(data, "node_109", { name: "十一世119" });
addNodeById(data, "node_110", { name: "十一世120" });

addNodeById(data, "node_111", { name: "十二世121" });
addNodeById(data, "node_112", { name: "十二世122" });
addNodeById(data, "node_113", { name: "十二世123" });
addNodeById(data, "node_114", { name: "十二世124" });

addNodeById(data, "node_115", { name: "十二世125" });
addNodeById(data, "node_116", { name: "十二世126" });
addNodeById(data, "node_117", { name: "十二世127" });
addNodeById(data, "node_118", { name: "十二世128" });
addNodeById(data, "node_119", { name: "十二世129" });
addNodeById(data, "node_120", { name: "十二世130" });

addNodeById(data, "node_121", { name: "十三世131" });
addNodeById(data, "node_122", { name: "十三世132" });
addNodeById(data, "node_123", { name: "十三世133" });
addNodeById(data, "node_124", { name: "十三世134" });

addNodeById(data, "node_125", { name: "十三世135" });
addNodeById(data, "node_126", { name: "十三世136" });
addNodeById(data, "node_127", { name: "十三世137" });
addNodeById(data, "node_128", { name: "十三世138" });
addNodeById(data, "node_129", { name: "十三世139" });
addNodeById(data, "node_130", { name: "十三世140" });

addNodeById(data, "node_131", { name: "十四世141" });
addNodeById(data, "node_132", { name: "十四世142" });
addNodeById(data, "node_133", { name: "十四世143" });
addNodeById(data, "node_134", { name: "十四世144" });

addNodeById(data, "node_135", { name: "十四世145" });
addNodeById(data, "node_136", { name: "十四世146" });
addNodeById(data, "node_137", { name: "十四世147" });
addNodeById(data, "node_138", { name: "十四世148" });
addNodeById(data, "node_139", { name: "十四世149" });
addNodeById(data, "node_140", { name: "十四世150" });

addNodeById(data, "node_141", { name: "十五世151" });
addNodeById(data, "node_142", { name: "十五世152" });
addNodeById(data, "node_143", { name: "十五世153" });
addNodeById(data, "node_144", { name: "十五世154" });

addNodeById(data, "node_145", { name: "十五世155" });
addNodeById(data, "node_146", { name: "十五世156" });
addNodeById(data, "node_147", { name: "十五世157" });
addNodeById(data, "node_148", { name: "十五世158" });
addNodeById(data, "node_149", { name: "十五世159" });
addNodeById(data, "node_150", { name: "十五世160" });

addNodeById(data, "node_151", { name: "十六世161" });
addNodeById(data, "node_152", { name: "十六世162" });
addNodeById(data, "node_153", { name: "十六世163" });
addNodeById(data, "node_154", { name: "十六世164" });

addNodeById(data, "node_155", { name: "十六世165" });
addNodeById(data, "node_156", { name: "十六世166" });
addNodeById(data, "node_157", { name: "十六世167" });
addNodeById(data, "node_158", { name: "十六世168" });
addNodeById(data, "node_159", { name: "十六世169" });
addNodeById(data, "node_160", { name: "十六世170" });

addNodeById(data, "node_161", { name: "十七世171" });
addNodeById(data, "node_162", { name: "十七世172" });
addNodeById(data, "node_163", { name: "十七世173" });
addNodeById(data, "node_164", { name: "十七世174" });

addNodeById(data, "node_165", { name: "十七世175" });
addNodeById(data, "node_166", { name: "十七世176" });
addNodeById(data, "node_167", { name: "十七世177" });
addNodeById(data, "node_168", { name: "十七世178" });
addNodeById(data, "node_169", { name: "十七世179" });
addNodeById(data, "node_170", { name: "十七世180" });

addNodeById(data, "node_171", { name: "十八世181" });
addNodeById(data, "node_172", { name: "十八世182" });
addNodeById(data, "node_173", { name: "十八世183" });
addNodeById(data, "node_174", { name: "十八世184" });

addNodeById(data, "node_175", { name: "十八世185" });
addNodeById(data, "node_176", { name: "十八世186" });
addNodeById(data, "node_177", { name: "十八世187" });
addNodeById(data, "node_178", { name: "十八世188" });
addNodeById(data, "node_179", { name: "十八世189" });
addNodeById(data, "node_180", { name: "十八世190" });

addNodeById(data, "node_181", { name: "十九世191" });
addNodeById(data, "node_182", { name: "十九世192" });
addNodeById(data, "node_183", { name: "十九世193" });
addNodeById(data, "node_184", { name: "十九世194" });

addNodeById(data, "node_185", { name: "十九世195" });
addNodeById(data, "node_186", { name: "十九世196" });
addNodeById(data, "node_187", { name: "十九世197" });
addNodeById(data, "node_188", { name: "十九世198" });
addNodeById(data, "node_189", { name: "十九世199" });
addNodeById(data, "node_190", { name: "十九世200" });

addNodeById(data, "node_191", { name: "二十世201" });
addNodeById(data, "node_192", { name: "二十世202" });
addNodeById(data, "node_193", { name: "二十世203" });
addNodeById(data, "node_194", { name: "二十世204" });

addNodeById(data, "node_195", { name: "二十世205" });
addNodeById(data, "node_196", { name: "二十世206" });
addNodeById(data, "node_197", { name: "二十世207" });
addNodeById(data, "node_198", { name: "二十世208" });
addNodeById(data, "node_199", { name: "二十世209" });
addNodeById(data, "node_200", { name: "二十世210" });

addNodeById(data, "node_191", { name: "二十世201" });
addNodeById(data, "node_192", { name: "二十世202" });
addNodeById(data, "node_193", { name: "二十世203" });
addNodeById(data, "node_194", { name: "二十世204" });

addNodeById(data, "node_195", { name: "二十世205" });
addNodeById(data, "node_196", { name: "二十世206" });
addNodeById(data, "node_197", { name: "二十世207" });
addNodeById(data, "node_198", { name: "二十世208" });
addNodeById(data, "node_199", { name: "二十世209" });
addNodeById(data, "node_200", { name: "二十世210" });

addNodeById(data, "node_201", { name: "二十一世211" });
addNodeById(data, "node_202", { name: "二十一世212" });
addNodeById(data, "node_203", { name: "二十一世213" });
addNodeById(data, "node_204", { name: "二十一世214" });

addNodeById(data, "node_205", { name: "二十一世215" });
addNodeById(data, "node_206", { name: "二十一世216" });
addNodeById(data, "node_207", { name: "二十一世217" });
addNodeById(data, "node_208", { name: "二十一世218" });
addNodeById(data, "node_209", { name: "二十一世219" });
addNodeById(data, "node_210", { name: "二十一世220" });
