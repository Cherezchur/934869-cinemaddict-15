import dayjs from 'dayjs';
import {getRandomInteger} from '../utils.js';

const generatePosters = () => {
  const POSTERS_NAMES = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  return `/images/posters/${POSTERS_NAMES[getRandomInteger(0, POSTERS_NAMES.length - 1)]}`;
};

const generateMovieNames = () => {
  const MOVIE_NAMES = [
    'Made for each other',
    'Popeye meets sinbad',
    'Sagebrush trail',
    'Santa claus conquers the martians',
    'The dance of life',
    'The great flamarion',
    'The man with the golden arm',
  ];

  const randomMovieNames = MOVIE_NAMES[getRandomInteger(0, MOVIE_NAMES.length - 1)];

  return randomMovieNames;
};

const getRelizeDate = () => {
  const relizeDay = new Date(`${getRandomInteger(1, 31)}`, `${getRandomInteger(1, 12)}`, `${getRandomInteger(1921, 2021)}`);
  return dayjs(relizeDay).format('D MMMM YYYY');
};

const getDurationFilm = () => {
  const isMoreHour = Boolean(getRandomInteger(0, 1));

  !isMoreHour ? `${getRandomInteger(0,59)}` : `${getRandomInteger(1, 3)}h ${getRandomInteger(0,59)}m`;
};

const generateWritersList = () => {
  const WRITERS = [
    'Anne Wington',
    'Heinz Herrold',
    'Richard Weil',
  ];

  return WRITERS.slice(0, getRandomInteger(1, WRITERS.length - 1)).join(', ');
};

const generateActorList = () => {
  const ACTORS = [
    'Erich von Stroheim',
    'Mary Beth Hughes',
    'Dan Duryea',
    'Mikluha Mac Lie',
    'Kirsten Dans',
    'Jonny Depp',
  ];

  return ACTORS.slice(1, getRandomInteger(1, ACTORS.length - 1)).join(', ');
};

const COUNTRY = [
  'USA',
  'Italy',
  'Russia',
  'Great Britain',
  'France',
];

const generateGenres = () => {
  const GENRES = [
    'Drama',
    'Film-Noir',
    'Mystery',
    'Comedy',
    'Horor movie',
  ];

  return GENRES.slice(0, getRandomInteger(1, GENRES.length - 1)).join(', ');
};

const generateDescription = () => {
  const SENTETCE_COUNT = 5;
  const DESCRIPTIONS = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const generateSentence = () => {
    const indexDescription = getRandomInteger(0, DESCRIPTIONS.length - 1);
    return DESCRIPTIONS[indexDescription];
  };

  return new Array(SENTETCE_COUNT).fill().map(() => generateSentence()).join(' ');
};

const AGE_RATING = [
  '0+',
  '6+',
  '12+',
  '16+',
  '18+',
];

const generateComments = () => {
  const COMMENTS = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?',
    'It\'s funny',
  ];

  const EMOTIONS = [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ];

  const COMMENTS_AUTHOR = [
    'John Doe',
    'Jonny Dillendger',
    'Cortny Cox',
  ];

  const commentsDate = () => {
    const maxDaysGap = 7;
    const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
    const connentDay = dayjs().add(daysGap, 'day').toDate();

    return dayjs(connentDay).format('YYYY/MM/DD HH:mm');
  };

  const commentsData = () => ({
    text: COMMENTS[getRandomInteger(0, COMMENTS.length - 1)],
    emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
    author: COMMENTS_AUTHOR[getRandomInteger(0, COMMENTS_AUTHOR.length - 1)],
    date: commentsDate(),
  });

  return commentsData();
};

export const generateFilm = () => ({
  poster: generatePosters(),
  movieName: generateMovieNames(),
  rating: `${[getRandomInteger(5, 9)]}.${[getRandomInteger(0,9)]}`,
  productionYear: getRandomInteger(1921, 2021),
  writers: generateWritersList(),
  actors: generateActorList(),
  relizeDate: getRelizeDate(),
  genres: generateGenres(),
  duration: getDurationFilm(),
  country: COUNTRY[getRandomInteger(0, COUNTRY.length - 1)],
  description: generateDescription(),
  comments: new Array(getRandomInteger(0, 5)).fill().map(() => generateComments()),
  ageRating: AGE_RATING[getRandomInteger(0, AGE_RATING.length - 1)],
  isAddedWatch: Boolean(getRandomInteger(0, 1)),
  isAddedHistory: Boolean(getRandomInteger(0, 1)),
  isAddedFavorites: Boolean(getRandomInteger(0, 1)),
});
