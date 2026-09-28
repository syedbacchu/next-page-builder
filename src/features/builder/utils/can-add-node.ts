import type { BuilderNode } from "@/features/builder/types/builder.types";
import { componentRegistry } from "@/features/builder/registry/component-registry";

export function canAddNodeToParent(
    node: BuilderNode,
    parent: BuilderNode,
): boolean {
    const definition = componentRegistry[node.type];

    if (!definition) {
        return false;
    }

    if (!definition.allowedParentTypes) {
        return parent.type !== "page";
    }

    return definition.allowedParentTypes.includes(parent.type);
}