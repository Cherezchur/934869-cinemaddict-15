import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);


export const getFilmsOfViews = (films) => films.filter((film) => film.history);

export const getDateFrom = (iterator, periodType) => {
  const periodNumbers = iterator;
  return dayjs().subtract(periodNumbers, periodType).toDate();
};
