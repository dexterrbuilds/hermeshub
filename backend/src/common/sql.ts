export const camelCase = (value: string) =>
  value.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());

export function camelizeRow<T>(row: Record<string, unknown>): T {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [camelCase(key), value])) as T;
}

export function camelizeRows<T>(rows: Record<string, unknown>[]) {
  return rows.map((row) => camelizeRow<T>(row));
}

export function bookingReference() {
  const value = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `HMS-${value}`;
}
