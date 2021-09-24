import AbstractObserver from '../utils/abstract-observer.js';
import dayjs from 'dayjs';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films.slice();
  }

  updateFilm(updateType, update) {

    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {

    let adaptedFilm = new Object;

    if(film.movie) {
      adaptedFilm = Object.assign(
        {},
        film,
        {
          id: film.movie.id,
          actors: film.movie['film_info'].actors.join(', '),
          ageRating: `${film.movie['film_info']['age_rating']}+`,
          country: film.movie['film_info'].release['release_country'],
          description: film.movie['film_info'].description,
          director: film.movie['film_info'].director,
          duration: film.movie['film_info'].runtime,
          genres: film.movie['film_info'].genre,
          movieName: film.movie['film_info'].title,
          originalName: film.movie['film_info']['alternative_title'],
          poster: film.movie['film_info'].poster,
          productionYear: dayjs(film.movie['film_info'].release.date).format('YYYY'),
          rating: film.movie['film_info']['total_rating'],
          relizeDate: dayjs(film.movie['film_info'].release.date).format('D MMMM YYYY'),
          writers: film.movie['film_info'].writers.join(', '),
          watchlist: film.movie['user_details'].watchlist,
          history: film.movie['user_details']['already_watched'],
          favorites: film.movie['user_details'].favorite,
          watchingDate: dayjs(film.movie['user_details']['watching_date']).format('YYYY/MM/DD HH:mm'),
          serverFormatDate: film.movie['user_details']['watching_date'],
          serverRelizeDateFormat: film.movie['film_info'].release.date,
        },
      );

      delete adaptedFilm.movie;

      return adaptedFilm;
    }

    adaptedFilm = Object.assign(
      {},
      film,
      {
        actors: film['film_info'].actors.join(', '),
        ageRating: `${film['film_info']['age_rating']}+`,
        country: film['film_info'].release['release_country'],
        description: film['film_info'].description,
        director: film['film_info'].director,
        duration: film['film_info'].runtime,
        genres: film['film_info'].genre,
        movieName: film['film_info'].title,
        originalName: film['film_info']['alternative_title'],
        poster: film['film_info'].poster,
        productionYear: dayjs(film['film_info'].release.date).format('YYYY'),
        rating: film['film_info']['total_rating'],
        relizeDate: dayjs(film['film_info'].release.date).format('D MMMM YYYY'),
        writers: film['film_info'].writers.join(', '),
        watchlist: film['user_details'].watchlist,
        history: film['user_details']['already_watched'],
        favorites: film['user_details'].favorite,
        watchingDate: dayjs(film['user_details']['watching_date']).format('YYYY/MM/DD HH:mm'),
        serverFormatDate: film['user_details']['watching_date'],
        serverRelizeDateFormat: film['film_info'].release.date,
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(film) {

    const userDetails = {
      watchlist: film.watchlist,
      'already_watched': film.history,
      favorite: film.favorites,
      'watching_date': film.serverFormatDate,
    };

    const relizeData = {
      date: film.serverRelizeDateFormat,
      'release_country': film.country,
    };

    const filmInfo = {
      actors: film.actors.split(', '),
      'age_rating': +film.ageRating.slice(0, Array.from(film.ageRating).length - 1),
      'alternative_title': film.originalName,
      description: film.description,
      director: film.director,
      genre: film.genres,
      poster: film.poster,
      release: relizeData,
      runtime: film.duration,
      title: film.movieName,
      'total_rating': film.rating,
      writers: film.writers.split(', '),
    };

    const getCommentsId = () => {

      if(film.comments.length === 0) {
        return [];
      }

      const commentsId = new Array;

      if(film.comments[0].id) {
        film.comments.forEach((comment) => {
          commentsId.push(comment.id);
        });
        return commentsId;
      }

      film.comments.forEach((comment) => {
        commentsId.push(comment);
      });
      return commentsId;
    };

    const adaptedFilm = Object.assign(
      {},
      {
        id: film.id,
      },
      {
        'user_details': userDetails,
      },
      {
        comments: getCommentsId(),
      },
      {
        'film_info': filmInfo,
      },
    );

    delete adaptedFilm.watchlist;
    delete adaptedFilm.history;
    delete adaptedFilm.favorites;

    delete adaptedFilm.actors;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.country;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.duration;
    delete adaptedFilm.genres;
    delete adaptedFilm.movieName;
    delete adaptedFilm.poster;
    delete adaptedFilm.productionYear;
    delete adaptedFilm.rating;
    delete adaptedFilm.relizeDate;
    delete adaptedFilm.writers;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.noComments;
    delete adaptedFilm.originalName;
    delete adaptedFilm.serverFormatDate;
    delete adaptedFilm.serverRelizeDateFormat;

    return adaptedFilm;
  }
}
