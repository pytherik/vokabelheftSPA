import {urlActionSwitch} from "../config.js";
//info Beim klicken auf ein Wort in den Listen werden die weiteren
// Informationen wie Übersetzungen und Beschreibung geholt und dargestellt
export const getTranslation = async (id, wordclass) => {
  const lang = localStorage.getItem('lang');
  try {
    console.log(id, wordclass);
    const formData = new FormData();
    formData.append('action', 'getTranslation');
    formData.append('id', id);
    formData.append('wordclass', wordclass)
    formData.append('lang', lang);
    const result = await fetch(urlActionSwitch, {
      body: formData,
      method: 'POST'
    })
    return await result.json();
  } catch (error) {
    console.log(error);
  }
}

export const showTranslation = (translation, wordclass, authorName, description) => {
  const lang = localStorage.getItem('lang');
  const vonBy = (lang === 'en') ? 'by': 'von';
  const descriptionTxt = (lang === 'en') ? 'Description:' : 'Beschreibung:';
  if (lang === 'de') {
    if (wordclass === 'verb') wordclass = 'Verb';
    if (wordclass === 'noun') wordclass = 'Substantiv';
    if (wordclass === 'adjective') wordclass = 'Adjektiv';
    if (wordclass === 'other') wordclass = 'Andere';
  }
  const translationsTxt = (lang === 'en') ? 'Translations': 'Überstzungen';
  const modal = document.querySelector('.modal-container');
  modal.style.display = 'block';
  const innerModal = document.querySelector('.inner-modal');
  innerModal.className = 'inner-show-modal';
  let modalContent = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">
                      <div class="modal-author">${vonBy} ${authorName}</div>
                      <div>
                        <span class="modal-word">${translation.word}</span> 
                        <span class="modal-wordclass"> <i>(${wordclass})</i>:</span>
                      </div>
                      <div class="modal-translation">${translationsTxt}:</div>
                        <ul class="translation">`;
  translation.translations.forEach(translation => {
    modalContent += `<li class="modal-word">${translation}</li>`;
  })
  modalContent += `</ul>
                  <div class="modal-description">${descriptionTxt}</div>
                  <div class="modal-description-content">${description}</div>`;
  innerModal.insertAdjacentHTML('beforeend', modalContent);
  const quit = document.getElementById('quit');
  quit.addEventListener('click', () => {
    innerModal.innerHTML = '';
    innerModal.className = 'inner-modal';
    modal.style.display = 'none';
  })
}