import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import album from './album.webp';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const Track = props => {
  return (
    <View style={{flexDirection: 'row', padding: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: 30, height: 30, backgroundColor: 'red'}} />
        <View style={{marginLeft: 25}}>
          <Text style={{color: 'white'}}>Allah Belanı Versin</Text>
          <Text style={{color: 'white', marginTop: 2}}>İsmail YK</Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 32,
          marginTop: -5,
          color: 'white',
          marginLeft: 'auto',
        }}>
        ...
      </Text>
    </View>
  );
};

export default function Example() {
  const BLACK = '#121212';
  const GREEN = '#1DB954';
  const LIGHTERBLACK = '#212121';
  const IMAGE_SIZE = 300;

  const translationY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      'worklet';
      translationY.value = e.contentOffset.y;
    },
  });

  const fixedHeaderStyle = useAnimatedStyle(() => {
    const opacity = (translationY.value - IMAGE_SIZE) / 100;
    const cond = translationY.value > IMAGE_SIZE;
    return {
      opacity: cond ? opacity : 0,
      height: cond ? 100 : 0,
    };
  });

  const pullBackStyle = useAnimatedStyle(() => {
    const scaleX = Math.abs(translationY.value) / 100;
    const scaleY = Math.abs(translationY.value) / 200;
    return {
      transform: [
        {scaleX: translationY.value < -100 ? scaleX : 1},
        {scaleY: translationY.value < -100 ? Math.max(scaleY, 1) : 1},
      ],
    };
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      width: '100%',
      height: IMAGE_SIZE,
    },
    artistName: {
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
      color: 'white',
      fontSize: 60,
    },
  });

  const notScrolledHeaderStyle = useAnimatedStyle(() => {
    const opacity = (translationY.value - IMAGE_SIZE) / 100;
    const cond = translationY.value < IMAGE_SIZE;

    return {
      opacity: Math.abs(translationY.value) < opacity ? opacity : 1,
      height: cond ? 300 : 0,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          fixedHeaderStyle,
          {borderBottomColor: BLACK, borderBottomWidth: 2},
        ]}>
        <LinearGradient
          style={{
            height: 100,
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          colors={[GREEN, BLACK]}>
          <Text style={{fontSize: 20, color: 'white', marginTop: 20}}>
            İsmail YK
          </Text>
        </LinearGradient>
      </Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          backgroundColor: BLACK,
          paddingBottom: 30,
        }}>
        <Animated.View style={notScrolledHeaderStyle}>
          <Animated.Image
            source={album}
            style={[styles.image, pullBackStyle]}
            resizeMode="cover"
          />
          <Text style={styles.artistName}>İsmail YK</Text>
        </Animated.View>
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
      </Animated.ScrollView>
    </View>
  );
}
