import type { BuilderNodeType } from "@/features/builder/types/builder.types";
import { componentRegistry } from "@/features/builder/registry/component-registry";

export function canDropNewComponent(
    componentType: BuilderNodeType,
    targetNodeType: BuilderNodeType,
): boolean {
    const componentDefinition =
        componentRegistry[componentType];

    const targetDefinition =
        componentRegistry[targetNodeType];

    if (!componentDefinition) {
        return false;
    }

    if (!targetDefinition?.canHaveChildren) {
        return false;
    }

    if (
        componentDefinition.allowedParentTypes &&
        !componentDefinition.allowedParentTypes.includes(
            targetNodeType,
        )
    ) {
        return false;
    }

    return true;
}