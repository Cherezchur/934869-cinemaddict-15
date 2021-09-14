import dayjs from 'dayjs';
import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  getFilmsOfViews,
  getDateFrom
} from '../utils/statistics.js';
import { getUsersRank } from '../utils/film-utils.js';

const renderStatisticsChart = (statisticCtx, sortingGenres) => {
  const BAR_HEIGHT = 50;

  const getLebelsGenres = () => {
    const lebelsGenres = new Array;
    for(let count = sortingGenres.length - 1 ; count >= 0 ;count--) {
      lebelsGenres.push(sortingGenres[count][0]);
    }
    return lebelsGenres;
  };

  const getFilmsGanreNumbers = () => {
    const filmsGanreNumbers = new Array;
    for(let count = sortingGenres.length - 1 ; count >= 0 ;count--) {
      filmsGanreNumbers.push(sortingGenres[count][1]);
    }
    return filmsGanreNumbers;
  };

  statisticCtx.height = BAR_HEIGHT * 5;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: getLebelsGenres(),
      datasets: [{
        data: getFilmsGanreNumbers(),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (filmsLength, data, topGenre, statisticPeriod) => {

  const getTotalDuration = () => {
    let totalDuration = 0;

    data.forEach((film) => {
      totalDuration += film.duration;
    });

    return totalDuration;
  };

  const getCheckedAttribute = (imputName) => statisticPeriod === imputName ? 'checked' : '';

  return `<section class="statistic">
            <p class="statistic__rank">
              Your rank
              <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
              <span class="statistic__rank-label">${getUsersRank(filmsLength)}</span>
            </p>

            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
              <p class="statistic__filters-description">Show stats:</p>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${getCheckedAttribute('All time')}>
              <label for="statistic-all-time" class="statistic__filters-label">All time</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${getCheckedAttribute('Today')}>
              <label for="statistic-today" class="statistic__filters-label">Today</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${getCheckedAttribute('Week')}>
              <label for="statistic-week" class="statistic__filters-label">Week</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${getCheckedAttribute('Month')}>
              <label for="statistic-month" class="statistic__filters-label">Month</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${getCheckedAttribute('Year')}>
              <label for="statistic-year" class="statistic__filters-label">Year</label>
            </form>

            <ul class="statistic__text-list">
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">You watched</h4>
                <p class="statistic__item-text">${data.length} <span class="statistic__item-description">movies</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Total duration</h4>
                <p class="statistic__item-text"> ${Math.trunc(getTotalDuration() / 60)} <span class="statistic__item-description">h</span> ${getTotalDuration() % 60} <span class="statistic__item-description">m</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Top genre</h4>
                <p class="statistic__item-text">${topGenre === undefined ? '' : topGenre.join(', ')}</p>
              </li>
            </ul>

            <div class="statistic__chart-wrap">
              <canvas class="statistic__chart" width="1000"></canvas>
            </div>

          </section>`;
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();

    this._data = {
      films: getFilmsOfViews(films),
      dateFrom: getDateFrom('5', 'year'),
      dateTo: dayjs().toDate(),
      statisticPeriod: 'All time',
    };

    this._filters = this.getElement().querySelectorAll('.statistic__filters-input');

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
    this.setDateChangeHandler(this._dateChangeHandler);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    const filmsLength = this._data.films.length;
    const filmsViewed = this._filmsViewedDuringPeriod();
    const topGenre = this._getTopGenre();
    const statisticPeriod = this._data.statisticPeriod;
    return createStatisticsTemplate(filmsLength, filmsViewed, topGenre, statisticPeriod);
  }

  restoreHandlers() {
    this.setDateChangeHandler(this._dateChangeHandler);
  }

  _dateChangeHandler(evt, ...[dateFrom]) {
    const statisticPeriod = evt.target.textContent;

    switch (statisticPeriod) {
      case 'All time':
        dateFrom = getDateFrom('2', 'year');
        break;
      case 'Today':
        dateFrom = getDateFrom('1', 'day');
        break;
      case 'Week':
        dateFrom = getDateFrom('1', 'week');
        break;
      case 'Month':
        dateFrom = getDateFrom('1', 'month');
        break;
      case 'Year':
        dateFrom = getDateFrom('1', 'year');
        break;
    }

    this.updateData({
      dateFrom,
      statisticPeriod,
    });

    this._setCharts();
  }

  setDateChangeHandler(callback) {
    this._callback.dateChangeClick = callback;
    this.getElement().querySelector('.statistic__filters').addEventListener('click', this._dateChangeHandler);
  }

  _filmsViewedDuringPeriod() {
    const filmsViewedArray = new Array;

    const {films, dateFrom, dateTo} = this._data;

    films.forEach((film) => {
      if (film.watchingDate === null) {
        return;
      }

      if (dayjs(film.watchingDate).isBetween(dateFrom, dateTo)) {
        filmsViewedArray.push(film);
      }
    });

    return filmsViewedArray;
  }

  _getAllGenreArray() {
    let allGenres = new Array;

    this._filmsViewedDuringPeriod().forEach((film) => {
      allGenres = allGenres.concat(film.genres);
    });

    const getNumberOfGenres = allGenres.reduce((acc, el) => {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {});

    const getSortingGenres = Object.entries(getNumberOfGenres)
      .sort((ganreA, ganreB) => ganreA[1] - ganreB[1]);

    return getSortingGenres;
  }

  _getTopGenre() {
    const topGenreArray = new Array;
    const allGanreArray = this._getAllGenreArray();

    if(this._getAllGenreArray().length === 0) {
      topGenreArray.push('');
      return;
    }

    topGenreArray.push(allGanreArray[allGanreArray.length - 1][0]);

    for(let count = 0; count <= allGanreArray.length - 2 ; count++) {
      if(allGanreArray[count][1] ===  allGanreArray[allGanreArray.length - 1][1]) {
        topGenreArray.push(allGanreArray[count][0]);
      }
    }

    return topGenreArray;
  }

  _setCharts() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    const sortingGenres = this._getAllGenreArray();

    this._statisticsChart = renderStatisticsChart(statisticCtx, sortingGenres);
  }
}
