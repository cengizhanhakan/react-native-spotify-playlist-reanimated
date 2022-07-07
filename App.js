import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Alert, Image} from 'react-native';
import album from './src/albumcover.jpeg';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const Track = ({name, cover, artists}) => {
  return (
    <View style={{flexDirection: 'row', padding: 20, alignItems: 'center'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{width: 54, height: 54}} source={{uri: cover}} />
        <View style={{marginLeft: 18, width: '75%'}}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'CircularStd-Medium',
            }}>
            {name}
          </Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              fontSize: 14,
              color: '#c4c4c4',
              marginTop: 2,
              fontFamily: 'CircularStd-Medium',
            }}>
            {artists}
          </Text>
        </View>
      </View>
      <Entypo
        name="dots-three-horizontal"
        color="#c4c4c4"
        style={{marginLeft: 'auto'}}
        size={24}
      />
    </View>
  );
};

const playlistId = '37i9dQZF1EpjkVvtHAtmpC';

const bearerToken =
  'BQB-im0NWSYIBckB9IJWjQIMgWYD7Z5X-YwMZHBpvnOcMMX2Cj2SJHQ19soaWvxRcC9bpmHIAHFRfZOqmjKNolLYY4n2ubpYdDwsRqipsd_HqcKyanuGlQr0Bu1IRPHgLHbKrKRUTlFnGNEciket-OVezA_YKQVauf67JXFQqkIYK2XI96bDeDcXVDMR';

export default function App() {
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [playlistData, setPlaylistData] = useState([]);

  const playlistTrackParser = items => {
    if (!items) return [];

    const result = [];

    for (const item of items) {
      const track = {
        id: item.track.id,
        name: item.track.name,
        cover: item.track.album.images[0].url,
        artists: item.track.artists.map(artist => artist.name).join(', '),
      };
      result.push(track);
    }

    return result;
  };

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
      Alert.alert('Error', 'Something went wrong. You might want to restart.');
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const BLACK = '#121212';
  const GREEN = '#1DB954';
  const LIGHTERBLACK = '#212121';
  const IMAGE_SIZE = 250;

  const translationY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      'worklet';
      translationY.value = e.contentOffset.y;
      if (e.contentOffset.y < -50) {
        if (!searchBarVisible) runOnJS(setSearchBarVisible)(true);
      } else if (e.contentOffset.y > 50) {
        runOnJS(setSearchBarVisible)(false);
      }
    },
  });

  const CORNFLOWERBLUE = '#6495ED';
  const CORNFLOWERBLUE2 = '#5077BE';

  const pullBackStyle = useAnimatedStyle(() => {
    const scaleX = Math.abs(translationY.value) / 180;
    const scaleY = Math.abs(translationY.value) / 200;
    return {
      transform: [
        {scaleX: translationY.value < -100 ? Math.max(scaleX, 1) : 1},
        {
          scaleY:
            translationY.value < -48
              ? Math.min(scaleY > 1 ? scaleY : 1, 1.2)
              : 1,
        },
      ],
    };
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BLACK,
    },
    image: {
      marginTop: 50,
      marginBottom: 20,
      width: '100%',
      height: IMAGE_SIZE,
    },
    artistName: {
      alignSelf: 'center',
      color: 'white',
      fontSize: 60,
    },
  });

  const headerImageStyle = useAnimatedStyle(() => {
    if (!searchBarVisible) {
      const disappearence =
        translationY.value > 0
          ? 1 -
            Math.abs(
              searchBarVisible
                ? translationY.value / (IMAGE_SIZE + 50)
                : translationY.value / IMAGE_SIZE,
            )
          : 1;
      return {
        transform: [
          {scale: Math.max(disappearence, 0.8)},
          {
            translateY:
              translationY.value < 0 ? 0 : Math.abs(translationY.value) * 0.8,
          },
        ],
        opacity: disappearence,
      };
    }

    const disappearence =
      translationY.value > 50
        ? 1 -
          Math.abs(
            searchBarVisible
              ? translationY.value / (IMAGE_SIZE + 50)
              : translationY.value / IMAGE_SIZE,
          )
        : 1;
    return {
      transform: [
        {scale: Math.max(disappearence, 0.8)},
        {
          translateY:
            translationY.value < 0 ? 0 : Math.abs(translationY.value) * 0.8,
        },
      ],
      opacity: disappearence,
    };
  });

  const fixedHeaderStyle = useAnimatedStyle(() => {
    const cond = translationY.value > IMAGE_SIZE + 35;
    return {
      opacity: cond,
      display: cond ? 'flex' : 'none',
    };
  });

  const fixedHeaderShuffleTextStyle = useAnimatedStyle(() => {
    const cond = translationY.value > IMAGE_SIZE + 235;
    return {
      opacity: cond,
      display: cond ? 'flex' : 'none',
    };
  });

  const searchBarVisibility = useAnimatedStyle(() => {
    const opacity = searchBarVisible
      ? 1 - Math.abs(translationY.value) / 100
      : 0;

    return {
      opacity,
      //causes crash idk why
      //marginTop: opacity > 0 ? 100 : 0,
      //marginBottom: opacity > 0 ? 50 : 0,
    };
  });

  if (isLoading) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {position: 'absolute', zIndex: 1, top: 60, right: 20},
          fixedHeaderShuffleTextStyle,
        ]}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons name="play-circle-sharp" color={GREEN} size={60} />
          <View
            style={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              borderRadius: 50,
              width: 14,
              height: 14,
              backgroundColor: LIGHTERBLACK,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Entypo name="shuffle" color={GREEN} size={12} />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[fixedHeaderStyle]}>
        <LinearGradient
          style={{
            opacity: 0.95,
            height: 100,
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          colors={[
            CORNFLOWERBLUE,
            CORNFLOWERBLUE,
            CORNFLOWERBLUE2,
            CORNFLOWERBLUE2,
          ]}>
          <Text
            style={{
              color: 'white',
              marginTop: 24,
              fontSize: 18,
              fontFamily: 'CircularStd-Black',
            }}>
            On Repeat
          </Text>
        </LinearGradient>
      </Animated.View>
      <Ionicons
        style={{left: 15, top: 50, position: 'absolute', zIndex: 1}}
        name="chevron-back-sharp"
        color="white"
        size={24}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          backgroundColor: BLACK,
          paddingBottom: 30,
        }}>
        <LinearGradient colors={[CORNFLOWERBLUE, BLACK]}>
          <Animated.View
            style={[
              searchBarVisibility,
              {marginTop: searchBarVisible ? 100 : 0},
            ]}>
            <View
              style={{
                paddingHorizontal: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  width: '80%',
                  padding: 10,
                  borderRadius: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ionicons name="search-sharp" color="white" size={18} />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 14,
                    color: 'white',
                    fontFamily: 'CircularStd-Black',
                  }}>
                  Find in playlist
                </Text>
              </View>
              <View
                style={{
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  width: '15%',
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'white',
                    fontFamily: 'CircularStd-Black',
                  }}>
                  Sort
                </Text>
              </View>
            </View>
          </Animated.View>
          <Animated.Image
            source={album}
            style={[styles.image, pullBackStyle, headerImageStyle]}
            resizeMode="contain"
          />
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text
              style={{
                color: '#c4c4c4',
                fontSize: 16,
                fontFamily: 'CircularStd-Medium',
              }}>
              Songs you love right now
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 8,
              }}>
              <Text
                style={{
                  color: '#c4c4c4',
                  fontSize: 16,
                  fontFamily: 'CircularStd-Medium',
                }}>
                Made for
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'CircularStd-Black',
                  marginLeft: 4,
                }}>
                Cengizhan Hakan
              </Text>
            </View>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontFamily: 'CircularStd-Medium',
              }}>
              1 like · 1h 41m
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              alignItems: 'baseline',
              marginBottom: 10,
            }}>
            <AntDesign color={GREEN} name="heart" size={24} />
            <MaterialCommunityIcons
              style={{marginLeft: 20}}
              color={GREEN}
              name="download-circle"
              size={24}
            />
            <Entypo
              name="dots-three-horizontal"
              color="#c4c4c4"
              style={{marginLeft: 20}}
              size={24}
            />
            <View style={{flexDirection: 'row', marginLeft: 'auto'}}>
              <Ionicons name="play-circle-sharp" color={GREEN} size={60} />
              <View
                style={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  borderRadius: 50,
                  width: 18,
                  height: 18,
                  backgroundColor: LIGHTERBLACK,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Entypo name="shuffle" color={GREEN} size={12} />
              </View>
            </View>
          </View>
        </LinearGradient>
        {playlistData.map(item => (
          <Track
            key={item.id}
            name={item.name}
            cover={item.cover}
            artists={item.artists}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
