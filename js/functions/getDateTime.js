export const getDateTime = () => {
  let date = new Date().toLocaleDateString();
  let time = new Date().toTimeString();

  date = date.split('.').reverse().join('-');
  time = time.split(' ')[0];
  const dateTime = `${date} ${time}`;
  return dateTime;
}