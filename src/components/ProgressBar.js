import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'

export default function ProgressBar({ progress }) {
  const anim = useRef(new Animated.Value(progress)).current

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 350,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const widthInterpolated = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: widthInterpolated }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: '#1E1E2E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#7C6EF8',
    borderRadius: 4,
  },
})