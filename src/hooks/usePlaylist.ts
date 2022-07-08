import axios from 'axios';
import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {Track} from '../types';
import {playlistTrackParser} from '../utils/parsers/contentParsers';
import {SPOTIFY_ACCESS_TOKEN, SPOTIFY_PLAYLIST_ID} from 'react-native-dotenv';

export const usePlaylist = () => {
  const [playlistData, setPlaylistData] = useState<Track[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const bearerToken = SPOTIFY_ACCESS_TOKEN;

  const fetchPlaylist = async () => {
    setIsLoading(true);
    try {
      const {data} = await axios.get(
        `https://api.spotify.com/v1/playlists/${SPOTIFY_PLAYLIST_ID}?fields=tracks(items)`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );

      setPlaylistData(playlistTrackParser(data.tracks.items));
      setIsLoading(false);
    } catch (e) {
      console.log('e :>> ', e);
      Alert.alert(
        'Error',
        'Something went wrong, Create a new spotify access token',
      );
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  return {data: playlistData, isLoading};
};
