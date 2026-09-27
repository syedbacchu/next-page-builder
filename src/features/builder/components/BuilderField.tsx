"use client";

import type { ComponentField } from "@/features/builder/types/component-schema.types";

interface BuilderFieldProps {
    name: string;
    field: ComponentField;
    value: unknown;
    onChange: (value: unknown) => void;
}

export function BuilderField({
                                 name,
                                 field,
                                 value,
                                 onChange,
                             }: BuilderFieldProps) {
    const inputId = `builder-field-${name}`;

    if (field.type === "text" ||
        field.type === "url" ||
        field.type === "image") {
        return (
            <div>
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-medium"
                >
                    {field.label}
                </label>

                <input
                    id={inputId}
                    type={
                        field.type === "url"
                            ? "url"
                            : "text"
                    }
                    value={
                        typeof value === "string"
                            ? value
                            : ""
                    }
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                />
            </div>
        );
    }

    if (field.type === "textarea") {
        return (
            <div>
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-medium"
                >
                    {field.label}
                </label>

                <textarea
                    id={inputId}
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onChange(event.target.value)}
                    rows={4}
                    className="w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                />
            </div>
        );
    }

    if (field.type === "number") {
        return (
            <div>
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-medium"
                >
                    {field.label}
                </label>

                <input
                    id={inputId}
                    type="number"
                    value={typeof value === "number" ? value : ""}
                    onChange={(event) => {
                        const nextValue = event.target.value;

                        onChange(
                            nextValue === ""
                                ? ""
                                : Number(nextValue),
                        );
                    }}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                />
            </div>
        );
    }
    if (field.type === "color") {
        return (
            <div>
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-medium"
                >
                    {field.label}
                </label>

                <div className="flex items-center gap-2">
                    <input
                        id={inputId}
                        type="color"
                        value={
                            typeof value === "string"
                                ? value
                                : "#000000"
                        }
                        onChange={(event) =>
                            onChange(event.target.value)
                        }
                        className="h-10 w-12 cursor-pointer rounded border p-1"
                    />

                    <input
                        type="text"
                        value={
                            typeof value === "string"
                                ? value
                                : ""
                        }
                        onChange={(event) =>
                            onChange(event.target.value)
                        }
                        className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm"
                    />
                </div>
            </div>
        );
    }

    if (field.type === "select") {
        return (
            <div>
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-sm font-medium"
                >
                    {field.label}
                </label>

                <select
                    id={inputId}
                    value={String(value ?? "")}
                    onChange={(event) => {
                        const selectedOption = field.options?.find(
                            (option) =>
                                String(option.value) ===
                                event.target.value,
                        );

                        onChange(
                            selectedOption?.value ??
                            event.target.value,
                        );
                    }}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                >
                    {field.options?.map((option) => (
                        <option
                            key={String(option.value)}
                            value={String(option.value)}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return null;
}