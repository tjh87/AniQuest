/** Select a random fact without repeating the fact that the user just saw. */
export function randomFactIndex(length: number, previousIndex?: number, random = Math.random) {
  if (length <= 1) return 0;
  if (previousIndex === undefined) return Math.floor(random() * length);
  return (previousIndex + 1 + Math.floor(random() * (length - 1))) % length;
}
