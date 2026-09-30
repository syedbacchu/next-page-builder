export function resizeColumnPair(
    spans: number[],
    leftIndex: number,
    newLeftSpan: number,
): number[] {
    const rightIndex = leftIndex + 1;

    if (
        leftIndex < 0 ||
        rightIndex >= spans.length
    ) {
        return spans;
    }

    const leftSpan = spans[leftIndex];
    const rightSpan = spans[rightIndex];

    const pairTotal = leftSpan + rightSpan;

    const safeLeftSpan = Math.min(
        pairTotal - 1,
        Math.max(1, newLeftSpan),
    );

    const safeRightSpan =
        pairTotal - safeLeftSpan;

    const nextSpans = [...spans];

    nextSpans[leftIndex] = safeLeftSpan;
    nextSpans[rightIndex] = safeRightSpan;

    return nextSpans;
}