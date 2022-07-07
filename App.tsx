import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
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
import {Track} from './src/components/Track';
import {Track as TrackType} from './src/types';
import {Colors, Sizes, Fonts} from './src/constants';
import {usePlaylist} from './src/hooks/usePlaylist';

export default function App() {
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  const {isLoading, data} = usePlaylist();

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

  const pulledBackPlaylistCoverStyle = useAnimatedStyle(() => {
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
    headerItemText: {
      fontSize: 14,
      color: Colors.WHITE,
      fontFamily: Fonts.BLACK,
    },
    headerShuffleIcon: {
      position: 'absolute',
      zIndex: 5,
      top: 60,
      right: 20,
    },
    playlistInfoText: {
      fontSize: 16,
      fontFamily: Fonts.MEDIUM,
    },
    CTAItem: {
      marginLeft: 20,
    },
  });

  const playlistCoverStyle = useAnimatedStyle(() => {
    const offset = searchBarVisible ? 50 : 0;

    const opacity =
      translationY.value > offset
        ? 1 -
          Math.abs(
            searchBarVisible
              ? translationY.value / (Sizes.PLAYLIST_COVER_SIZE + 50)
              : translationY.value / Sizes.PLAYLIST_COVER_SIZE,
          )
        : 1;

    return {
      transform: [
        {scale: Math.max(opacity, 0.8)},
        {
          translateY:
            translationY.value < 0 ? 0 : Math.abs(translationY.value) * 0.8,
        },
      ],
      opacity,
    };
  });

  const fixedHeaderStyle = useAnimatedStyle(() => {
    const opacity = (translationY.value - Sizes.PLAYLIST_COVER_SIZE) / 21;

    return {
      opacity,
    };
  });

  const headerShuffleIconAnimated = useAnimatedStyle(() => {
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
      //wanted to add vertical margins but causes crash because of reanimated...
    };
  });

  if (isLoading) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.headerShuffleIcon, headerShuffleIconAnimated]}>
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
          paddingBottom: 40,
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
                    ...styles.headerItemText,
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
                <Text style={styles.headerItemText}>Sort</Text>
              </View>
            </View>
          </Animated.View>
          <Animated.Image
            source={album}
            style={[
              styles.image,
              pulledBackPlaylistCoverStyle,
              playlistCoverStyle,
            ]}
            resizeMode="contain"
          />
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text
              style={{
                color: Colors.GREY,
                ...styles.playlistInfoText,
              }}>
              Songs you love right now
            </Text>
            <Text
              style={{
                marginVertical: 8,
                color: Colors.GREY,
                ...styles.playlistInfoText,
              }}>
              Made for{' '}
              <Text
                style={{
                  color: Colors.WHITE,
                  fontFamily: Fonts.BLACK,
                }}>
                Cengizhan Hakan
              </Text>
            </Text>
            <Text
              style={{
                color: Colors.WHITE,
                ...styles.playlistInfoText,
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
              style={styles.CTAItem}
              color={Colors.GREEN}
              name="download-circle"
              size={24}
            />
            <Entypo
              name="dots-three-horizontal"
              color={Colors.GREY}
              style={styles.CTAItem}
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
        {data.map((item: TrackType) => (
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
