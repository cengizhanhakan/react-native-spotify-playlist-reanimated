import React from 'react';
import {Dimensions, StyleSheet, View, Alert} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

function Ball() {
  const screenWidth = Dimensions.get('window').width;

  const isPressed = useSharedValue(false);
  const offset = useSharedValue({x: -(screenWidth / 3), y: 0});

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x},
        {translateY: offset.value.y},
        {scale: withSpring(isPressed.value ? 1.2 : 1)},
      ],
      backgroundColor: isPressed.value ? 'yellow' : 'blue',
    };
  });

  const bringSuccess = () => {
    console.log(offset.value.x);
    if (offset.value.x >= Dimensions.get('window').width / 3) {
      console.log('bring success');
      Alert.alert('Success');
    }
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      isPressed.value = true;
    })
    .onChange(e => {
      'worklet';
      offset.value = {
        x: e.changeX + offset.value.x,
        y: 0,
      };
    })
    .onFinalize(() => {
      'worklet';
      if (offset.value.x <= screenWidth / 3) {
        offset.value = {
          x: -(screenWidth / 4),
          y: 0,
        };
      }
      runOnJS(bringSuccess)();
      isPressed.value = false;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.ball, animatedStyles]} />
    </GestureDetector>
  );
}

export default function Example() {
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: 'white',
          height: 120,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ball />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  ball: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    alignSelf: 'center',
  },
});
