import React, { Component } from 'react';
import './App.css';

import { load_google_maps } from './utils.js';
import SquareAPI from './utils.js';

import MapDiv from './components/MapDiv.js';

class App extends Component {
  componentDidMount() {
    let googleMapsPromise = load_google_maps();
    let venuesPromise = SquareAPI.loadVenues({
      limit: '10',
      near: 'Cleveland',
      query: 'brewery'
    });

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
      this.infoWindow = new google.maps.InfoWindow();

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
          animation: google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          let venueDetailsPromise = SquareAPI.getVenueDetails(venue.id);

          Promise.resolve(venueDetailsPromise)
          .then(values => {
            let venueDetails = values.response.venue;

            let infoWindowContent = `<div>
                <h3>${venue.name}</h3>
                ${venueDetails && venueDetails.bestPhoto ? (
                  `<img
                    alt="${venueDetails.name} photo"
                    src="${venueDetails.bestPhoto.prefix}100x100${venueDetails.bestPhoto.suffix}"
                  />`
                ) : ''}
              </div>`

            this.infoWindow.setContent(infoWindowContent);
        });

          this.map.setCenter(marker.position);
          this.infoWindow.open(this.map, marker);
        });

        // google.maps.event.addListener(marker, 'click', () => {

        // })

        this.markers.push(marker);
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
