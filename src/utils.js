// Load Google Maps Function provided by Ryan Waite
// https://github.com/ryanwaite28/script-store/blob/master/js/react_resolve_google_maps.js
export function load_google_maps() {
  return new Promise(function(resolve, reject) {
    // define the global callback that will run when google maps is loaded
    window.resolveGoogleMapsPromise = function() {
      // resolve the google object
      resolve(window.google);
      // delete the global callback to tidy up since it is no longer needed
      delete window.resolveGoogleMapsPromise;
    }
    // Now, Load the Google Maps API
    const script = document.createElement("script");
    const API_KEY = 'AIzaSyAbowsPLrNXWzvxBgYRsMTD0yngIeXygCA';
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
    script.async = true;
    document.body.appendChild(script);
  });
}

// Access FourSquare API. Derrived from Forrest Walker's youtube walkthrough
class Helper {
  static startURL() {
    return 'https://api.foursquare.com/v2/'
  }

  static auth() {
    const keys = {
      client_id: 'U52AQWDBBAP4AJQY1XVYYK3DK1OJWPAOF1ORDWWCKNPNOJR2',
      client_secret: 'WTGQCC1PT3R3HPKHBFU4VH5TAOYAJQKIVO0SCDGO20XNIFDD',
      v: '20180323'
    };
    return Object.keys(keys)
      .map(key => `${key}=${keys[key]}`)
      .join('&');
  }

  static urlBuilder(urlParams) {
    if(!urlParams) {
      return '';
    }
    return Object.keys(urlParams)
    .map(key => `${key}=${urlParams[key]}`)
    .join('&');
  }

  static simpleFetch(endPoint, urlParams) {
    return fetch(`${Helper.startURL()}${endPoint}?${Helper.auth()}&${Helper.urlBuilder(urlParams)}`)
    .then(response => response.json())
    .catch(error => {
      alert(`FourSquare data could not be retrieved. ${error}`)
    })
  }
}

export default class SquareAPI {
  static loadVenues(urlParams) {
    return Helper.simpleFetch('/venues/search', urlParams);
  }

  static getVenueDetails(VENUE_ID) {
    return Helper.simpleFetch(`/venues/${VENUE_ID}`);
  }

  static getVenuePhotos(VENUE_ID) {
    return Helper.simpleFetch(`/venues/${VENUE_ID}/photos`);
  }
}

