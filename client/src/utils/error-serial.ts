export const errorHelper = (arr?: string[], str?: string) => {
  if (!arr || !str) return;
  if (typeof arr === "string") {
    return arr;
  }
  const result = arr.find((res) => res.includes(str));

  return result;
};
