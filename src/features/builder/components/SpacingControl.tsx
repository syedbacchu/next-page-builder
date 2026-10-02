"use client";

import { useEffect, useState } from "react";

type SpacingControlProps = {
    label: string;
    values: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    onChange: (
        side: "top" | "right" | "bottom" | "left",
        value: string,
    ) => void;
};

const sides = [
    { key: "top", label: "T" },
    { key: "right", label: "R" },
    { key: "bottom", label: "B" },
    { key: "left", label: "L" },
] as const;

export function SpacingControl({
                                   label,
                                   values,
                                   onChange,
                               }: SpacingControlProps) {
    const [linked, setLinked] = useState(false);

    const [unit, setUnit] = useState(() => {
        const match = values.top.match(/[a-z%]+$/i);
        return match?.[0] ?? "px";
    });

    useEffect(() => {
        const match = values.top.match(/[a-z%]+$/i);

        if (match?.[0]) {
            setUnit(match[0]);
        }
    }, [values.top]);

    function getNumber(value: string) {
        return value.replace(/[a-z%]+$/i, "");
    }

    function handleChange(
        side: "top" | "right" | "bottom" | "left",
        rawValue: string,
    ) {
        const value = rawValue === "" ? "" : `${rawValue}${unit}`;

        if (linked) {
            for (const currentSide of sides) {
                onChange(currentSide.key, value);
            }

            return;
        }

        onChange(side, value);
    }

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">
                    {label}
                </label>

                <button
                    type="button"
                    onClick={() => setLinked((current) => !current)}
                    className={[
                        "rounded border px-2 py-1 text-[10px] font-medium",
                        linked
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-slate-200 bg-white text-slate-500",
                    ].join(" ")}
                >
                    {linked ? "Linked" : "Unlinked"}
                </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {sides.map(({ key, label: sideLabel }) => (
                    <div key={key}>
                        <span className="mb-1 block text-center text-[10px] text-slate-400">
                            {sideLabel}
                        </span>

                        <input
                            type="number"
                            value={getNumber(values[key])}
                            onChange={(event) =>
                                handleChange(
                                    key,
                                    event.target.value,
                                )
                            }
                            className="h-8 w-full rounded border border-slate-200 px-2 text-center text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                ))}
            </div>

            <select
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                className="mt-2 h-8 rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-500"
            >
                <option value="px">px</option>
                <option value="%">%</option>
                <option value="em">em</option>
                <option value="rem">rem</option>
            </select>
        </div>
    );
}