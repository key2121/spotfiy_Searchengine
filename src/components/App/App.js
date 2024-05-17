import React, {useState, useCallback} from "react";
import './App.css';

import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

const App = () => {
  const [searchResults, setSearchResults] = useState([
    { id: '1', name: 'Song 1', artist: 'Artist 1', album: 'Album 1' },
    { id: '2', name: 'Song 2', artist: 'Artist 2', album: 'Album 2' },]);
  const [playlistName, setPlaylistName] = useState("New Playlist");

  const [playlistTracks, setPlaylistTracks] = useState([ { id: '4', name: 'Song 4', artist: 'Artist 4', album: 'Album 4' },]);

  const updatePlaylistName = useCallback(
    (name) => {
      setPlaylistName(name)
    },[])

  const savePlaylist = useCallback(() => {
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.saveplaylist(playlistName, trackUris).then(() => {
      setPlaylistName('New Playlist');
      setPlaylistTracks([]);
    });
  },[playlistName, playlistTracks])

  const search = useCallback(
    (term) => {
      Spotify.search(term).then(setSearchResults);
    },[]);

  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;

      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    [playlistTracks]
  );

  const removeTrack = useCallback(
    (track) => {
      setPlaylistTracks((prevTracks) => 
        prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
      );
    }, []
  );


  return (
    <div>
      <div className="header">
        <h1 className='Title' alt='title'>
          <span style={{ color: 'white' }}>H</span>
          <span style={{ color: ' rgba(0, 251, 0, 0.7)' }}>mm</span>
          <span style={{ color: 'white' }}></span>
        </h1>
        <SearchBar onSearch={search} />
      </div> 
      <div className="App">
       <div className="App-playlist">
        <SearchResults 
        searchResults={searchResults}
         onAdd={addTrack} 
         />
        <Playlist
         playlistName={playlistName} 
        playlistTracks={playlistTracks}
         onRemove={removeTrack} 
         onNameChange={updatePlaylistName} 
         onSave={savePlaylist} 
         />

       </div>
      </div>
    </div>
  );
}

export default App;
