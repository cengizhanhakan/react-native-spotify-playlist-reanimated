import axios from 'axios';
import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {Track} from '../types';
import {playlistTrackParser} from '../utils/parsers/contentParsers';

export const usePlaylist = () => {
  const [playlistData, setPlaylistData] = useState<Track[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const playlistId = '37i9dQZF1EpjkVvtHAtmpC';

  const bearerToken =
    'BQD1ikJQiIFRnRhP4J-ZeuopXZ_SGM0aHyb3g6FkpZJ-lppQ81ucUlp3RWDd4nZPyNsprHUFn3x_Gw41IFzvjzVEEKtzETtPpMQMAxmWjvArZgLzDv2i_rKHM5410cYnIpqYFaj04QjRypTjdUwTJ_j4Jg1dFBNOM8xszlRP8EQ1LAxExPTOGBGFjS2y';

  const fetchPlaylist = async () => {
    setIsLoading(true);
    try {
      const {data} = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}?fields=tracks(items)`,
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
