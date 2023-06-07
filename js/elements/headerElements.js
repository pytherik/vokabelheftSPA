export const headerElements = (page) => {
  const container = document.querySelector('.container');

  const header = `<h1 class="heading">Vokabelheft</h1>`
  const subHeader = `<h3 class="sub-heading">${page}</h3>`

  container.insertAdjacentHTML('beforeend', header);
  container.insertAdjacentHTML('beforeend', subHeader);
}
