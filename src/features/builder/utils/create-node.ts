import type {
    BuilderNode,
    BuilderNodeType,
} from "@/features/builder/types/builder.types";

export function createBuilderNode(
    type: BuilderNodeType,
): BuilderNode {
    return {
        id: `${type}-${crypto.randomUUID()}`,
        type,
        props: {},
        children: [],
    };
}