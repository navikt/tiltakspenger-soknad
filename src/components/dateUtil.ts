const twoDigits = (number: number) =>
  number.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

export const toDateString = (date: Date) => {
  return `${date.getFullYear()}-${twoDigits(date.getMonth())}-${twoDigits(
    date.getDate()
  )}`;
};
