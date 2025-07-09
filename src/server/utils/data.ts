export function getValueFromNestedField(data: any, fieldPath: string): any {
  return fieldPath.split(".").reduce((acc, part) => {
    if (acc === undefined || acc === null) return undefined;

    const arrayIndexMatch = part.match(/(\w+)\[(\d+)\]/);
    if (arrayIndexMatch) {
      const [, property, index] = arrayIndexMatch;
      return acc[property][parseInt(index, 10)];
    }
    return acc[part];
  }, data);
}
