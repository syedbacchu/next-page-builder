import type {
    BuilderDocument,
    BuilderNode,
} from "@/features/builder/types/builder.types";

export function duplicateNode(
    document: BuilderDocument,
    nodeId: string,
): {
    document: BuilderDocument;
    duplicatedNode: BuilderNode | null;
} {
    let duplicatedNode: BuilderNode | null = null;

    function cloneNode(source: BuilderNode): BuilderNode {
        return {
            ...source,
            id: `${source.type}-${crypto.randomUUID()}`,
            props: { ...source.props },
            styles: source.styles
                ? { ...source.styles }
                : undefined,
            children: source.children.map(cloneNode),
        };
    }

    function processNode(node: BuilderNode): BuilderNode {
        const children: BuilderNode[] = [];

        for (const child of node.children) {
            children.push(child);

            if (child.id === nodeId) {
                const copy = cloneNode(child);

                duplicatedNode = copy;
                children.push(copy);
            } else {
                children[children.length - 1] = processNode(child);
            }
        }

        return {
            ...node,
            children,
        };
    }

    return {
        document: {
            ...document,
            children: document.children.map(processNode),
        },
        duplicatedNode,
    };
}