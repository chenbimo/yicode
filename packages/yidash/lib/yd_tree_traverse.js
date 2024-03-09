// 数结构递归函数
export function yd_tree_traverse(tree, mapFunction) {
    function preorder(node, index, parent) {
        const newNode = Object.assign({}, mapFunction(node, index, parent));

        if ('children' in node) {
            newNode.children = node.children.map(function (child, index) {
                return preorder(child, index, node);
            });
        }

        return newNode;
    }

    return preorder(tree, null, null);
}
