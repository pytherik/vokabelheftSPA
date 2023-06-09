export const headerElements = (page) => {
  const mainHeader = (localStorage.getItem('lang') === 'en') ? 'My Vocabulary book': 'Mein Vokabelheft';
  const container = document.querySelector('.container');
  const header = `<h1 class="heading">${mainHeader}</h1>`
  const subHeader = `<h3 class="sub-heading">${page}</h3>`

  container.insertAdjacentHTML('beforeend', header);
  container.insertAdjacentHTML('beforeend', subHeader);
}
