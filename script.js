'use strict';
// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const formInputs = document.querySelectorAll('.form__input');
// GeoLocation API
const myGeolocation = navigator.geolocation;
////////////////////////////////
// PARENT WORKPUT CLASS
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-5);
  constructor(coords, distance, duration) {
    // this.date = date;
    // this.id = id;
    this.coords = coords; // [lat, lng]
    this.duration = duration; // in min
    this.distance = distance; // in km
  }
}

///////////////////////////////////////
// CHILD CLASSES
class Running extends Workout {
  constructor(coords, distance, duration, cadance) {
    super(coords, distance, duration);
    this.cadance = cadance;
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const run1 = new Running([39, -12], 5.2, 24, 170);
const cycle1 = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycle1);
///////////////////////////////////
// APPLICATION ARCHITECTURE
class App {
  // private instance properties
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    // this keyword in eventlistener function is the element where we call event
    // so, use bind(this) now this keyword is App class itself
    // always use bind method on every eventlistener inside class
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (myGeolocation) {
      myGeolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert('Turn on your location');
      });
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    console.log(this);
    // Handle clicks on Map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    const { lat: latitude, lng: longitude } = this.#mapEvent.latlng;
    const coords = [latitude, longitude];
    const popup = L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'running-popup',
    });
    if (inputDistance.value && inputCadence.value && inputDuration.value) {
      form.classList.add('hidden');
      inputDistance.value = inputCadence.value = inputDuration.value = '';
      L.marker(coords)
        .addTo(this.#map)
        .bindPopup(popup)
        .openPopup()
        .setPopupContent('WorkOut');
    }
  }
}

const app = new App();
