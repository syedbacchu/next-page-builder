import type { BuilderDocument, BuilderNode } from "@/features/builder/types/builder.types";

export function findFirstContainer(
    document: BuilderDocument,
): BuilderNode | null {
    function search(node: BuilderNode): BuilderNode | null {
        if (node.type === "container") {
            return node;
        }

        for (const child of node.children) {
            const found = search(child);

            if (found) {
                return found;
            }
        }

        return null;
    }

    for (const child of document.children) {
        const found = search(child);

        if (found) {
            return found;
        }
    }

    return null;
}