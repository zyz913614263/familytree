# 数据管理使用指南

## 数据结构

树形节点数据结构：
```javascript
{
  id: string,             // 节点唯一ID（自动生成，格式：node_1, node_2...）
  name: string,          // 节点名称（必需）
  children?: Array       // 子节点数组（可选）
}
```

**注意**：
- ID会在添加节点时自动生成，格式为 `node_1`, `node_2`, `node_3` 等
- 首次使用时，需要为现有数据添加ID（会自动执行）
- 建议使用ID而不是名称来操作节点（名称可能重复，ID唯一）

## 数据操作方法

### 0. 初始化ID（首次使用）

如果数据还没有ID，需要先为数据添加ID：

```javascript
// 为整个树添加ID（如果还没有）
addIdsToTree(data);

// 强制重新生成所有ID
addIdsToTree(data, true);
```

**注意**：`data.js` 文件会在加载时自动为数据添加ID，通常不需要手动调用。

### 1. 查找节点

#### 根据ID查找节点（推荐）
```javascript
// 查找ID为 "node_1" 的节点
const node = findNodeById(data, "node_1");
```

#### 根据路径查找节点

#### 根据路径查找节点
```javascript
// 查找路径为 [0, 1, 2] 的节点（根节点的第0个子节点的第1个子节点的第2个子节点）
const node = findNodeByPath(data, [0, 1, 2]);
```

#### 根据名称查找节点
```javascript
// 查找名称为 "主要分支1" 的节点
const node = findNodeByName(data, "主要分支1");
```

#### 查找节点路径
```javascript
// 查找名称为 "子主题1" 的节点的路径
const path = findNodePath(data, "子主题1");
// 返回: [0, 0] 表示根节点的第0个子节点的第0个子节点
```

### 2. 添加节点

#### 根据父节点ID添加节点（推荐）
```javascript
// 在ID为 "node_1" 的节点下添加子节点
addNodeById(data, "node_1", { name: "新节点" });

// 在指定位置插入
addNodeById(data, "node_1", { name: "新节点" }, 0);

// 添加带子节点的节点（子节点会自动生成ID）
addNodeById(data, "node_1", {
    name: "新节点",
    children: [
        { name: "子节点1" },
        { name: "子节点2" }
    ]
});
```

**注意**：新节点会自动生成ID，无需手动指定。

#### 直接添加子节点
```javascript
// 在某个节点对象上添加子节点
const parentNode = findNodeByName(data, "主要分支1");
addChildNode(parentNode, { name: "新节点" });

// 在指定位置插入
addChildNode(parentNode, { name: "新节点" }, 0); // 插入到第一个位置
```

#### 根据路径添加节点
```javascript
// 在路径 [0] 的节点下添加子节点
addNodeByPath(data, [0], { name: "新节点" });

// 在指定位置插入
addNodeByPath(data, [0], { name: "新节点" }, 0);
```

#### 根据名称添加节点
```javascript
// 在名称为 "主要分支1" 的节点下添加子节点
addNodeByName(data, "主要分支1", { name: "新节点" });

// 添加带子节点的节点
addNodeByName(data, "主要分支1", {
    name: "新节点",
    children: [
        { name: "子节点1" },
        { name: "子节点2" }
    ]
});
```

### 3. 修改节点

#### 根据ID修改节点名称（推荐）
```javascript
// 修改ID为 "node_1" 的节点名称
updateNodeNameById(data, "node_1", "新名称");
```

#### 修改节点名称（直接修改）
```javascript
const node = findNodeByName(data, "主要分支1");
updateNodeName(node, "新名称");
```

#### 根据路径修改节点名称
```javascript
// 修改路径 [0, 0] 的节点名称
updateNodeNameByPath(data, [0, 0], "新名称");
```

#### 根据名称修改节点名称
```javascript
// 将名称为 "主要分支1" 的节点改为 "新名称"
updateNodeNameByName(data, "主要分支1", "新名称");
```

### 4. 删除节点

#### 根据ID删除节点（推荐）
```javascript
// 删除ID为 "node_2" 的节点
removeNodeById(data, "node_2");
```

**注意**：不能删除根节点。

#### 直接删除子节点
```javascript
const parentNode = findNodeByName(data, "主要分支1");
removeChildNode(parentNode, 0); // 删除第一个子节点
```

#### 根据路径删除节点
```javascript
// 删除路径 [0, 0] 的节点
removeNodeByPath(data, [0, 0]);
```

#### 根据名称删除节点
```javascript
// 删除名称为 "子主题1" 的节点
removeNodeByName(data, "子主题1");
```

### 5. 移动和复制节点

#### 移动节点
```javascript
// 将路径 [0, 0] 的节点移动到路径 [1] 的节点下，插入到位置 0
moveNode(data, [0, 0], [1], 0);
```

#### 复制节点
```javascript
// 复制路径 [0, 0] 的节点到路径 [1] 的节点下
copyNode(data, [0, 0], [1], 0);
```

### 6. 统计和查询

#### 获取节点总数（递归）
```javascript
// 获取整个树的节点总数
const totalCount = getNodeCount(data);

// 获取某个子树的节点总数
const node = findNodeByName(data, "主要分支1");
const subtreeCount = getNodeCount(node);
```

#### 获取节点深度
```javascript
const node = findNodeByName(data, "子主题1");
const depth = getNodeDepth(node, data);
```

#### 扁平化树结构
```javascript
// 获取所有节点的扁平化数组
const allNodes = flattenTree(data);
// 返回格式: [{ node: {...}, path: [0, 1], name: "节点名称" }, ...]
```

## 完整示例

### 基于ID的操作（推荐）

```javascript
// 1. 查找节点
const parentNode = findNodeById(data, "node_1");

// 2. 根据父节点ID添加新节点
addNodeById(data, "node_1", { name: "新添加的节点" });

// 3. 根据ID修改节点名称
updateNodeNameById(data, "node_1", "修改后的名称");

// 4. 根据ID删除节点
removeNodeById(data, "node_2");

// 5. 获取统计信息
console.log("总节点数:", getNodeCount(data));
console.log("所有节点:", flattenTree(data));
```

### 基于名称的操作

```javascript
// 1. 添加新节点到 "主要分支1"
addNodeByName(data, "主要分支1", { name: "新添加的节点" });

// 2. 修改节点名称
updateNodeNameByName(data, "主要分支1", "修改后的名称");

// 3. 删除节点
removeNodeByName(data, "子主题2");
```

### 基于路径的操作

```javascript
// 1. 在指定位置添加节点
const parentPath = findNodePath(data, "主要分支1");
addNodeByPath(data, parentPath, { name: "插入的节点" }, 0);

// 2. 移动节点
const fromPath = findNodePath(data, "子主题1");
const toPath = findNodePath(data, "主要分支2");
if (fromPath && toPath) {
    moveNode(data, fromPath, toPath, 0);
}
```

## 注意事项

1. **路径索引**：路径数组中的数字表示子节点在父节点的 `children` 数组中的索引，从 0 开始
2. **根节点**：根节点不能删除，删除根节点会返回错误
3. **节点名称唯一性**：如果树中有多个同名节点，`findNodeByName` 和 `findNodePath` 会返回第一个找到的节点
4. **数据修改后刷新**：修改数据后，需要调用 `update(root)` 函数来刷新可视化视图
5. **深拷贝**：移动和复制节点时使用深拷贝，不会影响原始节点

## 与可视化集成

修改数据后，需要重新初始化树形结构：

```javascript
// 修改数据后
addNodeByName(data, "主要分支1", { name: "新节点" });

// 重新初始化（如果已经初始化过）
if (typeof update !== 'undefined') {
    // 重新创建层级数据
    const root = d3.hierarchy(data);
    root.x0 = width / 2;
    root.y0 = 0;
    
    // 更新视图
    update(root);
}
```

