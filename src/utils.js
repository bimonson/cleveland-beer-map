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

  // The following code comes from Using Fetch by Zell Liew
  // https://css-tricks.com/using-fetch/#article-header-id-5
  static handleResponse (response) {
    let contentType = response.headers.get('content-type')
    if (contentType.includes('application/json')) {
      return Helper.handleJSONResponse(response)
    } else if (contentType.includes('text/html')) {
      return Helper.handleTextResponse(response)
    } else {
      // Other response types as necessary. I haven't found a need for them yet though.
      throw new Error(`Sorry, content-type ${contentType} not supported`)
    }
  }

  static handleJSONResponse (response) {
    return response.json()
      .then(json => {
        if (response.ok) {
          return json
        } else {
          return Promise.reject(Object.assign({}, json, {
            status: response.status,
            statusText: response.statusText
          }))
        }
      })
  }

  static handleTextResponse (response) {
    return response.text()
      .then(text => {
        if (response.ok) {
          return text
        } else {
          return Promise.reject({
            status: response.status,
            statusText: response.statusText,
            err: text
          })
        }
      })
  }

  static simpleFetch(endPoint, urlParams) {
    return fetch(`${Helper.startURL()}${endPoint}?${Helper.auth()}&${Helper.urlBuilder(urlParams)}`)
    .then(Helper.handleResponse)
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

