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
let map, mapEvent;
// Functions
// Reset the form values and hide form
function resetForm() {
  form.classList.add('hidden');
  inputDistance.value = inputCadence.value = inputDuration.value = '';
}

if (myGeolocation) {
  myGeolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const coords = [latitude, longitude];
      map = L.map('map').setView(coords, 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // My Current Location
      // L.marker(coords).addTo(map).bindPopup('My Current Location').openPopup();
      // Handle clicks on Map
      map.on('click', function (mapE) {
        form.classList.remove('hidden');
        inputDistance.focus();
        mapEvent = mapE;
      });
    },
    () => {
      alert('Turn on your location');
    }
  );
}

form.addEventListener('submit', function (e) {
  //Display Marker
  e.preventDefault();
  console.log(e);
  const { lat: latitude, lng: longitude } = mapEvent.latlng;
  const coords = [latitude, longitude];
  const popup = L.popup({
    maxWidth: 250,
    minWidth: 100,
    autoClose: false,
    closeOnClick: false,
    className: 'running-popup',
  });
  if (inputDistance.value && inputCadence.value && inputDuration.value) {
    resetForm();
    L.marker(coords)
      .addTo(map)
      .bindPopup(popup)
      .openPopup()
      .setPopupContent('WorkOut');
  }
});

// change event on input type (cycling || running)
inputType.addEventListener('change', () => {
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
});
