export const getTranslation = async (id, wordclass) => {
  try {
    const formData = new FormData();
    formData.append('action', 'getTranslation');
    formData.append('id', id);
    formData.append('wordclass', wordclass)
    formData.append('lang', localStorage.getItem('lang'));
    const result = await fetch('http://localhost:63342/vokabelheftSPA/actionSwitch.php', {
      body: formData,
      method: 'POST'
    })
    return await result.json();
  } catch (error) {
    console.log(error);
  }
}

export const showTranslation = (translation, wordclass, authorName) => {
  console.log(translation)
  const modal = document.querySelector('.modal-container');
  const innerModal = document.querySelector('.inner-modal');
  modal.style.display = 'block';
  let modalContent = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">`;
  modalContent += `<div class="modal-author">von <i>${authorName}</i></div>`;
  modalContent += `<div class="modal-wordclass">${translation.word} <i>(${wordclass})</i>:</div>
                   <ul class="translation">`;
  translation.translations.forEach(translation => {
    modalContent += `<li>${translation}</li>`;
  })
  modalContent += `</ul>`;

  innerModal.insertAdjacentHTML('beforeend', modalContent);

  const quit = document.getElementById('quit');
  quit.addEventListener('click', () => {
    innerModal.innerHTML = '';
    modal.style.display = 'none';
  })
}