import {format} from 'date-fns';

export function formatMoney(value) {
  return '$' + value.toLocaleString();
}

export function formatDate(date) {
  return format(date, 'MMMM d, yyyy');
}
