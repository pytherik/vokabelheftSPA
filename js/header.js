export const header = () => {
  const container = document.querySelector('.container');
  const header = document.createElement('h1');
  header.className = 'heading';
  header.textContent = 'Vokabelheft'
  const subHeader = document.createElement('h3');
  subHeader.className = 'sub-heading';
  subHeader.textContent = 'Anmeldung';
  container.insertAdjacentElement('beforeend', header);
  container.insertAdjacentElement('beforeend', subHeader);
}
