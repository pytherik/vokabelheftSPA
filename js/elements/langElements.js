export const langElements = () => {
  const container = document.querySelector('.container');

  const langContainer = document.createElement('div');
  langContainer.className = 'lang-container';

  const toggleLang = `<div class="toggle-lang">
    <img class="lang-icon inactive" id="lang-de" src="../assets/images/icons/btn-de.png" alt="deutsch" title="umschalten: deutsch">
    <img class="lang-icon" id="lang-en" src="../assets/images/icons/btn-en.png" alt="english" title="switch to english"> 
  </div>`;

  langContainer.insertAdjacentHTML('beforeend', toggleLang);
  container.insertAdjacentElement('beforeend', langContainer);
}
