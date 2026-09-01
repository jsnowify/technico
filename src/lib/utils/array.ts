/**
 * Splits `items` into `columns` sequential groups, e.g. for laying a
 * flat list into an N-column grid.
 */
export function chunkIntoColumns<T>(
  items: readonly T[],
  columns: number,
): T[][] {
  const size = Math.ceil(items.length / columns);

  return Array.from({ length: columns }, (_, i) =>
    items.slice(i * size, i * size + size),
  );
}
