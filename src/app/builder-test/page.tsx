import type { BuilderDocument } from "@/features/builder/types/builder.types";
import { BuilderProvider } from "@/features/builder/store/BuilderProvider";
import { SelectedNodeInspector } from "@/features/builder/components/SelectedNodeInspector";
import { BuilderCanvas } from "@/features/builder/components/BuilderCanvas";
import { BuilderSidebar } from "@/features/builder/components/BuilderSidebar";
import { BuilderKeyboardShortcuts } from "@/features/builder/components/BuilderKeyboardShortcuts";
import { BuilderHeader } from "@/features/builder/components/BuilderHeader";
import { BuilderNavigatorContainer } from "@/features/builder/components/navigator/BuilderNavigatorContainer";

const testDocument: BuilderDocument = {
    id: "page-1",
    type: "page",
    props: {},
    children: [
        {
            id: "section-1",
            type: "section",
            props: {},
            styles: {
                backgroundColor: "#f8fafc",
            },
            children: [
                {
                    id: "container-1",
                    type: "container",
                    props: {},
                    children: [
                        {
                            id: "heading-1",
                            type: "heading",
                            props: {
                                text: "My First Page Builder",
                                level: 1,
                            },
                            styles: {
                                color: "#2563eb",
                            },
                            children: [],
                        },
                        {
                            id: "text-1",
                            type: "text",
                            props: {
                                text: "This content is rendered from Builder JSON.",
                            },
                            children: [],
                        },
                        {
                            id: "button-1",
                            type: "button",
                            props: {
                                text: "Get Started",
                                href: "#",
                            },
                            children: [],
                        },
                        {
                            id: "image-1",
                            type: "image",
                            props: {
                                src: "https://placehold.co/600x400",
                                alt: "Demo Image",
                            },
                            children: [],
                        },
                    ],
                },
            ],
        },
    ],
};

export default function BuilderTestPage() {
    return (
        <BuilderProvider document={testDocument}>
            <BuilderKeyboardShortcuts />

            <div className="flex min-h-screen flex-col">
                <BuilderHeader />

                <div className="flex flex-1">
                    <BuilderSidebar />

                    <BuilderNavigatorContainer />

                    <BuilderCanvas />

                    <SelectedNodeInspector />
                </div>
            </div>
        </BuilderProvider>
    );
}