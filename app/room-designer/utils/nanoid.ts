let counter = 0;

export function nanoid(): string {
  counter++;
  return `item_${Date.now()}_${counter}_${Math.random().toString(36).slice(2, 7)}`;
}
