export type ConvertNumberToString<T> = {
  [K in keyof T]: T[K] extends number ? string : T[K]
}
export type ConvertStringToNumber<T> = {
  [K in keyof T]: T[K] extends string ? number : T[K]
}
export function convertNumberPropertiesToString<T extends Record<string, any>>(
  obj: T
): ConvertNumberToString<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === 'number' ? value.toString() : value
    ])
  ) as ConvertNumberToString<T>
}

export function convertStringPropertiesToNumber<T extends Record<string, any>>(
  obj: T
): ConvertStringToNumber<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === 'string' ? parseFloat(value) : value
    ])
  ) as ConvertStringToNumber<T>
}
