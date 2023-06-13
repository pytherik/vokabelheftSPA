export const navElements = () => {
  const container = document.querySelector('.container');
  container.innerHTML = '';
  const createTxt = (localStorage.getItem('lang') === 'en') ? 'create new vocabulary': 'neue Vokabel erstellen';
  const logoutTxt = (localStorage.getItem('lang') === 'en') ? 'logout': 'abmelden';

  const navContainer = document.createElement('div');
  navContainer.className = 'nav-container';

  const toggleLang = `<div class="toggle-lang">
    <img class="lang-icon" id="lang-de" src="./assets/images/icons/btn-de.png" alt="deutsch" title="umschalten auf deutsch">
    <img class="lang-icon" id="lang-en" src="./assets/images/icons/btn-en.png" alt="english" title="switch to english"> 
  </div>`;

  const createButton = document.createElement('button');
  createButton.className = 'btn-create';
  createButton.innerText = createTxt;

  const logoutButton = document.createElement('button');
  logoutButton.className = 'btn-logout';
  logoutButton.innerText = logoutTxt;

  navContainer.insertAdjacentElement('beforeend',createButton);
  navContainer.insertAdjacentHTML('beforeend', toggleLang);
  navContainer.insertAdjacentElement('beforeend', logoutButton);
  container.insertAdjacentElement('beforeend', navContainer);
}
