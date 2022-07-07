import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {Track as TrackType} from '../types';

export const Track = ({name, cover, artists}: TrackType) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: 'center',
    },
    cover: {
      width: 54,
      height: 54,
    },
    infoContainer: {
      marginLeft: 18,
      width: '72%',
    },
    trackName: {
      color: 'white',
      fontSize: 16,
      fontFamily: 'CircularStd-Medium',
    },
    artistName: {
      fontSize: 14,
      color: '#c4c4c4',
      marginTop: 2,
      fontFamily: 'CircularStd-Medium',
    },
  });

  return (
    <View style={styles.container}>
      <Image style={{width: 54, height: 54}} source={{uri: cover}} />
      <View style={styles.infoContainer}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.trackName}>
          {name}
        </Text>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.artistName}>
          {artists}
        </Text>
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
