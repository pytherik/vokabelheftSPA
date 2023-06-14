export const urlActionSwitch = 'http://localhost:63342/vokabelheftSPA/actionSwitch.php';
// export const urlActionSwitch = '//localhost/ebweb/other/vokabelheftSPA/actionSwitch.php';
export const session = {
  'userId': Number(localStorage.getItem('userId')),
  'username': localStorage.getItem('username'),
  'date': localStorage.getItem('date'),
  'lang': localStorage.getItem('lang'),
  'registeredAt': localStorage.getItem('registeredAt')};