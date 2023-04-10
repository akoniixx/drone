import moment from 'moment';
export const momentExtend = {
  toBuddhistYear: (date: string | Date, format = 'DD MMMM YYYY') => {
    const christianYear = moment(date).format('YYYY');
    const buddhishYear = (parseInt(christianYear) + 543).toString();
    return moment(date)
      .format(
        format
          .replace('YYYY', buddhishYear)
          .replace('YY', buddhishYear.substring(2, 4)),
      )
      .replace(christianYear, buddhishYear);
  },
};
