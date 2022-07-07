import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import album from './src/assets/images/albumcover.jpeg';
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
import {Track} from './src/components/Track';
import {Track as TrackType} from './src/types';
import {Colors, Sizes, Fonts} from './src/constants';
import {playlistTrackParser} from './src/utils/parsers/contentParsers';

const playlistId = '37i9dQZF1EpjkVvtHAtmpC';

const bearerToken =
  'BQATS5IzP39l85OrBAF4JIf-ecQ7VYeiOHrgc6MdMTocDyri8YHnjuB0p6mzaRGeyYKsRr1w_ivSgW0UwYOKNQH0qSDTcEsj1S3uLoTuI3NMh2ucVN0agSVFeP049xXSKN1biMXlc1Ud3Z2W5RdHsTntmWBLcHoRpTfOBjDXWFhT5HqgNm1g5z5eIIlp';
export default function App() {
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [playlistData, setPlaylistData] = useState<TrackType[]>([]);

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
        'Something went wrong, Its highly likely that you need a Spotify Access Token',
      );
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

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
      backgroundColor: Colors.BLACK,
    },
    image: {
      marginTop: 50,
      marginBottom: 20,
      width: '100%',
      height: Sizes.PLAYLIST_COVER_SIZE,
    },
    shuffleIconContainer: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      borderRadius: 50,
      width: 14,
      padding: 2,
      height: 14,
      backgroundColor: Colors.LIGHTBLACK,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerItem: {
      borderRadius: 4,
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: 10,
      alignItems: 'center',
    },
  });

  const headerImageStyle = useAnimatedStyle(() => {
    if (!searchBarVisible) {
      const disappearence =
        translationY.value > 0
          ? 1 -
            Math.abs(
              searchBarVisible
                ? translationY.value / (Sizes.PLAYLIST_COVER_SIZE + 50)
                : translationY.value / Sizes.PLAYLIST_COVER_SIZE,
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
              ? translationY.value / (Sizes.PLAYLIST_COVER_SIZE + 50)
              : translationY.value / Sizes.PLAYLIST_COVER_SIZE,
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
    const opacity = (translationY.value - Sizes.PLAYLIST_COVER_SIZE) / 21;

    return {
      opacity,
    };
  });

  const fixedHeaderShuffleTextStyle = useAnimatedStyle(() => {
    const cond = translationY.value > Sizes.PLAYLIST_COVER_SIZE + 170;
    return {
      display: cond ? 'flex' : 'none',
    };
  });

  const searchBarVisibility = useAnimatedStyle(() => {
    const opacity = searchBarVisible
      ? 1 - Math.abs(translationY.value) / 100
      : 0;

    return {
      opacity,
      //causes crash because of reanimated...
      //marginTop: opacity > 0 ? 100 : 0,
      //marginBottom: opacity > 0 ? 50 : 0,
    };
  });

  if (isLoading) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {position: 'absolute', zIndex: 5, top: 60, right: 20},
          fixedHeaderShuffleTextStyle,
        ]}>
        <Ionicons name="play-circle-sharp" color={Colors.GREEN} size={60} />
        <View style={styles.shuffleIconContainer}>
          <Entypo name="shuffle" color={Colors.GREEN} size={10} />
        </View>
      </Animated.View>
      <Animated.View
        style={[
          fixedHeaderStyle,
          {
            position: 'absolute',
            top: 0,
            zIndex: 1,
            width: '100%',
          },
        ]}>
        <LinearGradient
          style={{
            height: 100,
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: -1,
          }}
          colors={[
            Colors.LIGHTCORNFLOWERBLUE,
            Colors.LIGHTCORNFLOWERBLUE,
            Colors.CORNFLOWERBLUE,
            Colors.CORNFLOWERBLUE,
          ]}>
          <Text
            style={{
              color: Colors.WHITE,
              marginTop: 24,
              fontSize: 18,
              fontFamily: Fonts.BLACK,
            }}>
            On Repeat
          </Text>
        </LinearGradient>
      </Animated.View>
      <Ionicons
        style={{left: 15, top: 50, position: 'absolute', zIndex: 5}}
        name="chevron-back-sharp"
        color="white"
        size={24}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          backgroundColor: Colors.BLACK,
          paddingBottom: 30,
        }}>
        <LinearGradient colors={[Colors.LIGHTCORNFLOWERBLUE, Colors.BLACK]}>
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
                  width: '80%',
                  flexDirection: 'row',
                  ...styles.headerItem,
                }}>
                <Ionicons name="search-sharp" color="white" size={18} />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 14,
                    color: Colors.WHITE,
                    fontFamily: Fonts.BLACK,
                  }}>
                  Find in playlist
                </Text>
              </View>
              <View
                style={{
                  width: '15%',
                  justifyContent: 'center',
                  ...styles.headerItem,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.WHITE,
                    fontFamily: Fonts.BLACK,
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
                color: Colors.GREY,
                fontSize: 16,
                fontFamily: Fonts.MEDIUM,
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
                  color: Colors.GREY,
                  fontSize: 16,
                  fontFamily: Fonts.MEDIUM,
                }}>
                Made for
              </Text>
              <Text
                style={{
                  color: Colors.WHITE,
                  fontSize: 16,
                  fontFamily: Fonts.BLACK,
                  marginLeft: 4,
                }}>
                Cengizhan Hakan
              </Text>
            </View>
            <Text
              style={{
                color: Colors.WHITE,
                fontSize: 16,
                fontFamily: Fonts.MEDIUM,
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
            <AntDesign color={Colors.GREEN} name="heart" size={24} />
            <MaterialCommunityIcons
              style={{marginLeft: 20}}
              color={Colors.GREEN}
              name="download-circle"
              size={24}
            />
            <Entypo
              name="dots-three-horizontal"
              color={Colors.GREY}
              style={{marginLeft: 20}}
              size={24}
            />
            <View style={{marginLeft: 'auto'}}>
              <Ionicons
                name="play-circle-sharp"
                color={Colors.GREEN}
                size={60}
              />
              <View style={styles.shuffleIconContainer}>
                <Entypo name="shuffle" color={Colors.GREEN} size={10} />
              </View>
            </View>
          </View>
        </LinearGradient>
        {playlistData.map(item => (
          <Track
            id={item.id}
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
