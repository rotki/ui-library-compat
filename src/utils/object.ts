export function getNestedValue(obj: Record<string, any>, property: string, defaultValue = undefined) {
  return property.split('.').reduce((item, key) => {
    if (item && typeof item === 'object' && key in item)
      return item[key];

    return defaultValue;
  }, obj);
}
