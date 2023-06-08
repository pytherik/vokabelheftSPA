export const getDescription = async (id, userId, lang) => {
  try {
    const formData = new FormData();
    formData.append('action', 'getDescription');
    formData.append('wordId', id);
    formData.append('userId', userId);
    formData.append('lang', lang);
    const result = await fetch('http://localhost:63342/vokabelheftSPA/actionSwitch.php', {
      body: formData,
      method: 'POST'
    })
    return await result.json();
  } catch (error) {
    console.log(error);
  }
}