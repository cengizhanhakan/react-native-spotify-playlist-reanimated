import React from 'react';
import {Text, View} from 'react-native';

export const TrackListItem = props => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 20,
    },
    albumCover: {
      width: 30,
      height: 30,
      backgroundColor: 'red',
    },
    whiteText: {
      color: 'white',
    },
    moreInfoText: {
      fontSize: 32,
      marginTop: -5,
      color: 'white',
      marginLeft: 'auto',
    },
  });
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.albumCover} />
        <View style={{marginLeft: 25}}>
          <Text style={styles.whiteText}>Allah Belanı Versin</Text>
          <Text style={{...styles.whiteText, marginTop: 2}}>İsmail YK</Text>
        </View>
      </View>
      <Text style={styles.moreInfoText}>...</Text>
    </View>
  );
};
