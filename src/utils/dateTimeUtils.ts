export function timePassed(time: [number, number]) {
  const ts = process.hrtime(time);
  return ts[0] * 1000 + ts[1] / 1000000;
}

export function parseDateTime(dateString: string) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    fractionalSecondDigits: 3,
    hour12: false,
  };

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('default', options).format(date);
}

export function getDateTimeNow() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
