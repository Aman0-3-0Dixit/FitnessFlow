import React, { useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useProgress } from '../hooks/useProgress'
import { useFlow } from '../context/FlowContext'

export default function WelcomeScreen({ navigation }) {
  const { initSession } = useProgress()
  const { isLoading, currentStep, hasResumableSession, resetFlow, setSessionId } = useFlow()
  const { clearSession } = useProgress()

  useEffect(() => {
    initSession()
  }, [])

  const handleStart = async () => {
    // Clear existing session
    await clearSession()
    resetFlow()
    navigation.replace('Step1')
  }

  const handleResume = () => {
    navigation.replace(`Step${currentStep}`)
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C6EF8" />
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🏋️</Text>
        </View>

        <Text style={styles.heading}>Build your{'\n'}fitness plan</Text>
        <Text style={styles.sub}>
          Answer a few quick questions and we'll put together a routine that actually fits your life.
        </Text>

        {hasResumableSession && (
          <View style={styles.resumeCard}>
            <Text style={styles.resumeTitle}>Welcome back 👋</Text>
            <Text style={styles.resumeText}>
              You left off at step {currentStep}. Want to pick up where you stopped?
            </Text>
            <TouchableOpacity
              style={styles.resumeBtn}
              onPress={handleResume}
              activeOpacity={0.8}
            >
              <Text style={styles.resumeBtnText}>Continue where I left off</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.startBtn, hasResumableSession && styles.startBtnSecondary]}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={[styles.startText, hasResumableSession && styles.startTextSecondary]}>
            {hasResumableSession ? 'Start over instead' : 'Get started →'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Takes about 2 minutes</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0F14',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#1A1A28',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  icon: {
    fontSize: 36,
  },
  heading: {
    fontSize: 38,
    fontWeight: '800',
    color: '#F2F2F2',
    lineHeight: 46,
    marginBottom: 16,
  },
  sub: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
    marginBottom: 44,
  },
  resumeCard: {
    backgroundColor: '#1A1A28',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7C6EF830',
    padding: 20,
    marginBottom: 20,
    gap: 10,
  },
  resumeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F2F2F2',
  },
  resumeText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  resumeBtn: {
    backgroundColor: '#7C6EF8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  resumeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  startBtn: {
    backgroundColor: '#7C6EF8',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  startBtnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#2A2A38',
  },
  startText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  startTextSecondary: {
    color: '#666',
  },
  hint: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    marginTop: 16,
  },
})