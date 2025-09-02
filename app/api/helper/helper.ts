export const safeGet = <T = unknown>(
  obj: unknown,
  path: string,
  defaultValue: T
): T => {
  if (!obj) return defaultValue;

  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;

    // Solo acceder si es un objeto
    if (typeof result === 'object' && result !== null && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return defaultValue;
    }
  }

  return (result !== undefined ? (result as T) : defaultValue);
};
