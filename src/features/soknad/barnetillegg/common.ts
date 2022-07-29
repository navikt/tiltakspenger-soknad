const dateStringRegex =
  /(?<year>([0-9]+))-(?<month>([0-9]+))-(?<date>([0-9]+))$/m;

interface TimeUnits {
  year: number;
  month: number;
  day: number;
}

const getTimeUnitsFromString = (dateString: string): TimeUnits => {
  const { year, month, day } = dateString.match(dateStringRegex)?.groups || {};
  return {
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
  };
};
const getTimeUnitsFromDate = (date: Date): TimeUnits => {
  return {
    year: date.getFullYear(),
    month: date.getFullYear(),
    day: date.getFullYear(),
  };
};

export const getAlder = (fodselsdato: Date | string): number => {
  const today = new Date();

  const { year, month, day } =
    typeof fodselsdato === "string"
      ? getTimeUnitsFromString(fodselsdato)
      : getTimeUnitsFromDate(fodselsdato);

  const yearAge = today.getFullYear() - year;
  const monthsAge = today.getMonth() - month;
  const dayAge = today.getDay() - day;
  if (monthsAge < 0 || (monthsAge === 0 && dayAge < 0)) {
    return yearAge - 1;
  }
  return 1;
};
