import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useFlow } from '../context/FlowContext'
import { useProgress } from '../hooks/useProgress'

// Human-readable labels for stored values
const LABELS = {
  ageRange: {
    under_18: 'Under 18', '18_25': '18 – 25', '26_35': '26 – 35',
    '36_50': '36 – 50', '50_plus': '50+',
  },
  dietPreference: {
    none: 'No preference', vegetarian: 'Vegetarian', vegan: 'Vegan',
    keto: 'Keto', if: 'Intermittent Fasting',
  },
  experienceLevel: {
    beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced',
  },
}

const resolve = (map, val) => map?.[val] ?? val ?? '—'

export default function SummaryScreen({ navigation }) {
  const { answers, sessionId } = useFlow()
  const { clearSession } = useProgress()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const rows = [
    { label: 'Age range',         value: resolve(LABELS.ageRange, answers.ageRange),               step: 'Step1' },
    { label: 'Primary goal',      value: answers.goal ?? '—',                                        step: 'Step2' },
    answers.goal === 'Weight Loss'
      ? { label: 'Diet preference', value: resolve(LABELS.dietPreference, answers.dietPreference),  step: 'Step3' }
      : null,
    { label: 'Workout days',      value: (answers.workoutDays ?? []).join(', ') || '—',              step: 'Step4' },
    { label: 'Experience level',  value: resolve(LABELS.experienceLevel, answers.experienceLevel),   step: 'Step5' },
  ].filter(Boolean)

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(false)

    try {
      await setDoc(doc(db, 'userProgress', sessionId), {
        currentStep: 'complete',
        answers,
        completedAt: new Date().toISOString(),
      })
      await clearSession()
      setSubmitted(true)
    } catch (err) {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (stepName) => {
    navigation.navigate(stepName)
  }

  // Success state
  if (submitted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎯</Text>
          <Text style={styles.successTitle}>You're all set!</Text>
          <Text style={styles.successSub}>
            Your fitness profile has been saved. Your personalised plan is being prepared.
          </Text>
          <TouchableOpacity
              style={styles.adminBtn}
              onPress={() => navigation.navigate('Admin')}
          >
               <Text style={styles.adminText}>View all saved sessions</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  <TouchableOpacity
      style={styles.adminBtn}
      onPress={() => navigation.navigate('Admin')}
  >
      <Text style={styles.adminText}>View all saved sessions</Text>
  </TouchableOpacity>

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.heading}>Here's your profile</Text>
        <Text style={styles.sub}>Review everything before we build your plan.</Text>

        {/* Answer cards */}
        <View style={styles.cards}>
          {rows.map((row) => (
            <View key={row.label} style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardLabel}>{row.label}</Text>
                <Text style={styles.cardValue}>{row.value}</Text>
              </View>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => handleEdit(row.step)}
                activeOpacity={0.7}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Error state with retry */}
        {submitError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Couldn't save your plan</Text>
            <Text style={styles.errorText}>
              Check your connection and try again — your answers are safe.
            </Text>
          </View>
        )}

        {/* Submit button */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              {submitError ? 'Retry →' : 'Build my plan →'}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F0F14',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 48,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F2F2F2',
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: '#666',
    marginBottom: 32,
  },
  cards: {
    gap: 10,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#1A1A24',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A38',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    gap: 4,
  },
  cardLabel: {
    fontSize: 12,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 16,
    color: '#F2F2F2',
    fontWeight: '600',
  },
  editBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2A2A38',
    borderRadius: 8,
  },
  editText: {
    fontSize: 13,
    color: '#7C6EF8',
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#1E1218',
    borderWidth: 1,
    borderColor: '#4A1B2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 6,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F08080',
  },
  errorText: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: '#7C6EF8',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  successIcon: {
    fontSize: 64,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F2F2F2',
  },
  successSub: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  adminBtn: {
  marginTop: 24,
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#2A2A38',
  alignItems: 'center',
},
adminText: {
  color: '#7C6EF8',
  fontSize: 14,
  fontWeight: '600',
},
})