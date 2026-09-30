export function calculateColumnSpan(
    deltaX: number,
    rowWidth: number,
    currentSpan: number,
): number {
    if (rowWidth <= 0) {
        return currentSpan;
    }

    const columnWidth = rowWidth / 12;

    const spanDelta = Math.round(
        deltaX / columnWidth,
    );

    return Math.min(
        11,
        Math.max(
            1,
            currentSpan + spanDelta,
        ),
    );
}