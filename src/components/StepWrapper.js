import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import ProgressBar from './ProgressBar'
import { useFlow } from '../context/FlowContext'
import { getStepPosition, getTotalSteps } from '../utils/navigation'

export default function StepWrapper({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextDisabled = false,
  isLastStep = false,
  currentStep,
}) {
  const { answers } = useFlow()
  const position = getStepPosition(currentStep, answers.goal)
  const total = getTotalSteps(answers.goal)

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.stepCount}>Step {position} of {total}</Text>
            <ProgressBar progress={position / total} />
          </View>

          {/* Title block */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <View style={styles.content}>
            {children}
          </View>

          {/* Navigation buttons */}
          <View style={styles.navRow}>
            {onBack ? (
              <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backPlaceholder} />
            )}

            <TouchableOpacity
              style={[styles.nextBtn, nextDisabled && styles.nextBtnDisabled]}
              onPress={onNext}
              disabled={nextDisabled}
              activeOpacity={0.8}
            >
              <Text style={styles.nextText}>
                {isLastStep ? 'See Summary →' : 'Next →'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0F14',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  stepCount: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  titleBlock: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F2F2F2',
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    marginBottom: 40,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  backBtn: {
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  backPlaceholder: {
    width: 80,
  },
  nextBtn: {
    backgroundColor: '#7C6EF8',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    minWidth: 160,
    alignItems: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: '#2A2A35',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
})