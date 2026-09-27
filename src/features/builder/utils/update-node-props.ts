import type { BuilderNode } from "@/features/builder/types/builder.types";

export function updateNodeProps(
    node: BuilderNode,
    nodeId: string,
    props: Record<string, unknown>,
): BuilderNode {
    if (node.id === nodeId) {
        return {
            ...node,
            props: {
                ...node.props,
                ...props,
            },
        };
    }

    return {
        ...node,
        children: node.children.map((child) =>
            updateNodeProps(child, nodeId, props),
        ),
    };
}