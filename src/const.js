export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_LIST: 'UPDATE_LIST',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH', // - обновить карточку фильма
  MINOR: 'MINOR', // - обновить карточку фильма + фильтры
  MAJOR: 'MAJOR', // - обновить карточку фильма + фильтры + звание пользователя
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP_OPEN: 'POPUP_OPEN',
};

export const SUBMIT_KEY_CODE = ['Control', 'Enter'];
