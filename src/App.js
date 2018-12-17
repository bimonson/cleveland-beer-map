import React, { Component } from 'react';
import './App.css';

import {
  load_google_maps,
  load_venues
} from './utils.js';

import MapDiv from './components/MapDiv.js';

class App extends Component {
  componentDidMount() {
    let googleMapsPromise = load_google_maps();
    let venuesPromise = load_venues();

    Promise.all([
      googleMapsPromise,
      venuesPromise
    ])
    .then(values => {
      console.log(values);
    })
    // .then(values => {
    //   let google = values[0];

    //   this.google = google;
    //   this.map = new google.maps.Map(document.getElementById('map'), {
    //     zoom: 9,
    //     scrollwheel: true,
    //     center: { lat: -31, lng: 151 }
    //   })
    // })
  }

  render() {
    return (
      <div id="app-container">
        <MapDiv />
      </div>
    );
  }
}

export default App;
