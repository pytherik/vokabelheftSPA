// import {session, urlActionSwitch} from "../config.js";
//
// export const getUsercontent = async (allUsers) => {
//   const lang = localStorage.getItem('lang');
//   let fetchId = session.userId;
//   if (allUsers) {
//     fetchId = 0;
//   }
//   try {
//     const formData = new FormData();
//     formData.append('action', 'getUserContent');
//     formData.append('userId', fetchId);
//     formData.append('lang', lang);
//     const response = await fetch(urlActionSwitch, {
//       body: formData,
//       method: 'POST'
//     });
//     return await response.json();
//   } catch (error) {
//     console.log(error);
//   }
// }
