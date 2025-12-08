// 布局模块

// 创建树布局（使用函数来动态获取尺寸）
// 固定水平间距值（节点之间的最小距离）
let treeLayout = d3.tree()
    .size([height, width])
/*.separation((a, b) => {
    // 水平间距设置为两个节点中较大的宽度
    const widthA = getNodeWidth(a);
    const widthB = getNodeWidth(b);
    const spacing = Math.max(widthA, widthB); // 使用较大的节点宽度作为间距
    // 返回间距对应的比例值
    // 注意：D3 tree布局的size是[height, width]，所以这里需要根据实际宽度来调整
    // 使用一个较大的除数，让间距更紧凑
    return spacing / 200;
});*/

// 创建层级数据
const root = d3.hierarchy(treeData);
root.x0 = width / 2;
root.y0 = 0;

