import type {
    BuilderNode,
    BuilderNodeStyles,
} from "@/features/builder/types/builder.types";

export function updateNodeStyles(
    node: BuilderNode,
    nodeId: string,
    styles: BuilderNodeStyles,
): BuilderNode {
    if (node.id === nodeId) {
        return {
            ...node,
            styles: {
                ...node.styles,
                ...styles,
            },
        };
    }

    return {
        ...node,
        children: node.children.map((child) =>
            updateNodeStyles(child, nodeId, styles),
        ),
    };
}