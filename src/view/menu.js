const createFilterLinkTemplate = (filters) => {
  const {name, count} = filters;

  return (
    `<a href="#${name}" class="main-navigation__item">${name.toUpperCase().slice(0, 1) + name.slice(1)} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export const createMenuTemplate = (filterLinks) => {
  const filterLinksTemplate = filterLinks
    .map((filter, index) => createFilterLinkTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" class="main-navigation__item">All movies</a>
              ${filterLinksTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

