import React, { Component } from 'react';
import './App.css';

// APIs
import { load_google_maps } from './utils.js';
import SquareAPI from './utils.js';

// Components
import MapDiv from './components/MapDiv.js';
import ResponsiveDrawer from './components/ResponsiveDrawer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      mobileOpen: false,
    }
  }

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
      this.venues = values[1].response.venues;
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

      this.venues.forEach(venue => {
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          map: this.map,
          venue: venue,
          id: venue.id,
          name: venue.name,
          animation: google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => { marker.setAnimation(null) }, 1500);

          let venueDetailsPromise = SquareAPI.getVenueDetails(venue.id);

          Promise.resolve(venueDetailsPromise)
          .then(values => {
            let venueDetails = values.response.venue;

            let infoWindowContent = `<div id="info-window-content">
                <h3>${venueDetails && venueDetails.name}</h3>
                ${venueDetails && venueDetails.bestPhoto ? (
                  `<img
                    alt="${venueDetails.name} photo"
                    src="${venueDetails.bestPhoto.prefix}300x169${venueDetails.bestPhoto.suffix}"
                  />`
                ) : ''}
              </div>`

            this.infoWindow.setContent(infoWindowContent);
          }).catch(this.infoWindow.setContent(`<h3>${venue.name}</h3>`));

          this.map.setCenter(marker.position);
          this.map.panBy(0, -48);
          this.infoWindow.open(this.map, marker);
        });

        this.markers.push(marker);
      });

      this.setState({ filtered: this.venues });

    }).catch(error => {
      console.log(error);
      alert(`Error loading page. ${error}`);
    })
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  liClick = (venue) => {
    let marker = this.markers.filter(m => m.id === venue.id)[0];

    marker.setAnimation(this.google.maps.Animation.BOUNCE);
    setTimeout(() => { marker.setAnimation(null) }, 1500);

    let venueDetailsPromise = SquareAPI.getVenueDetails(venue.id);

    Promise.resolve(venueDetailsPromise)
    .then(values => {
      let venueDetails = values.response.venue;

      let infoWindowContent = `<div id="info-window-content">
          <h3>${venueDetails && venueDetails.name}</h3>
          ${venueDetails && venueDetails.bestPhoto ? (
            `<img
              alt="${venueDetails.name} photo"
              src="${venueDetails.bestPhoto.prefix}300x169${venueDetails.bestPhoto.suffix}"
            />`
          ) : ''}
        </div>`

      this.infoWindow.setContent(infoWindowContent);
    }).catch(this.infoWindow.setContent(`<h3>${venue.name}</h3>`));

    if (window.matchMedia('(max-width: 599px)').matches) {
      this.handleDrawerToggle();
    }

    this.map.setCenter(marker.position);
    this.map.panBy(0, -48);
    this.infoWindow.open(this.map, marker);

  }

  filterVenues = (query) => {
    let f = this.venues.filter(venue => venue.name.toLowerCase().includes((query).toLowerCase()));
    this.markers.forEach(marker => {
      marker.name.toLowerCase().includes((query).toLowerCase()) === true ?
      marker.setVisible(true) :
      marker.setVisible(false)
    });

    this.setState({ filtered: f, query });
  }

  render() {
    return (
      <div id="app-container">
        <ResponsiveDrawer
          query={this.state.query}
          filterVenues={this.filterVenues}
          filtered={this.state.filtered}
          liClick={this.liClick}
          handleDrawerToggle={this.handleDrawerToggle}
          mobileOpen={this.state.mobileOpen}
        />
        <MapDiv />
      </div>
    );
  }
}

export default App;
