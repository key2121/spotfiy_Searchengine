
let accessToken = "";
const clientID = "3f28f6750d8148f5968e0a08a626b4b5";
/*const redirectURI = "http://localhost:3000/";*/
const redirectURI = "https://www.hmmplaylist.surge.sh";

const Spotify = {
  getAccessToken () {
    if (accessToken) {
      return accessToken
    } 

   const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
   const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
   if(accessTokenMatch && expiresInMatch) {
    accessToken = accessTokenMatch[1]
    const expiresIn = Number(expiresInMatch[1]);
    window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
   } else {
    const accessUrl =`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    window.location = accessUrl;

   }
  },
  search(term){
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
         Authorization: `Bearer ${accessToken}`
       }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if(!jsonResponse.tracks){
            return [];
        }
        return jsonResponse.tracks.items.map(track=> ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    });
  },
  saveplaylist(name,trackURI) {
    if(!name || !trackURI.length){
        return;
    }
    let accessToken = Spotify.getAccessToken();
    const headers ={ Authorization: `Bearer ${accessToken}` };
    let userID = "";
    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
       }).then(response => response.json()
        ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackURI})
        });
     });
  });
  }
};
export default Spotify;