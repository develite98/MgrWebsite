export function camelCase(str: string) {
  const firstCharLowercase = str.charAt(0).toLowerCase();
  const resultString = firstCharLowercase + str.slice(1);

  return resultString;
}
