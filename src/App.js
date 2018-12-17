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
      let google = values[0];
      let venues = values[1].response.venues;
      let geometry = values[1].response.geocode.feature.geometry;
      // console.log(values);

      this.google = google;
      this.markers = [];

      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        scrollwheel: true,
        center: { lat: geometry.center.lat, lng: geometry.center.lng }
      })

      venues.forEach(venue => {
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          map: this.map,
          venue: venue,
          id: venue.id,
          name: venue.name,
          animation: google.maps.Animation.DROP,
        });
      });


    })
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
