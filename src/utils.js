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

export function load_venues() {
  const endPoint = 'https://api.foursquare.com/v2/venues/search?';

   function auth() {
    const keys = {
      client_id: 'U52AQWDBBAP4AJQY1XVYYK3DK1OJWPAOF1ORDWWCKNPNOJR2',
      client_secret: 'WTGQCC1PT3R3HPKHBFU4VH5TAOYAJQKIVO0SCDGO20XNIFDD',
      v: '20180323'
    };
    return Object.keys(keys)
      .map(key => `${key}=${keys[key]}`)
      .join('&');
  }

  function urlParams() {
    const parameters = {
      limit: '50',
      near: 'Cleveland',
      query: 'brewery'
    }
    return Object.keys(parameters)
    .map(parameter => `${parameter}=${parameters[parameter]}`)
    .join('&');
  }

  return fetch(`${endPoint}${auth()}&${urlParams()}`)
    .then(console.log(`${endPoint}${auth()}&${urlParams()}`))
    .then(resp => resp.json)
    .catch(error => {
      alert(`FourSquare data could not be retrieved. ${error}`)
    })
}