import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import StepWrapper from '../components/StepWrapper'
import { useFlow } from '../context/FlowContext'
import { useProgress } from '../hooks/useProgress'
import { getNextStep } from '../utils/navigation'

const GOAL_OPTIONS = [
  {
    value: 'Weight Loss',
    label: '⚖️  Weight Loss',
    description: 'Burn fat and reach a healthier weight',
  },
  {
    value: 'Muscle Gain',
    label: '💪  Muscle Gain',
    description: 'Build strength and increase muscle mass',
  },
  {
    value: 'Improve Endurance',
    label: '🏃  Improve Endurance',
    description: 'Run longer, breathe easier, go further',
  },
  {
    value: 'Stay Active',
    label: '🧘  Stay Active',
    description: 'Keep moving and maintain general health',
  },
  {
    value: 'Flexibility',
    label: '🤸  Flexibility',
    description: 'Improve mobility and reduce stiffness',
  },
]

export default function Step2Screen({ navigation }) {
  const { answers, updateGoal, setCurrentStep } = useFlow()
  const { saveProgress } = useProgress()

  const handleNext = async () => {
    if (!answers.goal) {
      Alert.alert('Required', 'Please select your primary goal.')
      return
    }

    // getNextStep knows: if goal is Weight Loss → go to Step 3, else Step 4
    const next = getNextStep(2, answers.goal)
    setCurrentStep(next)
    saveProgress(next, answers).catch(() => {})
    navigation.navigate(`Step${next}`)
  }

  const handleBack = () => {
    navigation.navigate('Step1')
  }

  return (
    <StepWrapper
      title="What's your main goal?"
      subtitle="This shapes everything — your plan is built around this answer."
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!answers.goal}
      currentStep={2}
    >
      <View style={styles.options}>
        {GOAL_OPTIONS.map((opt) => {
          const selected = answers.goal === opt.value
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.card, selected && styles.cardSelected]}
              onPress={() => updateGoal(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.cardLabel, selected && styles.cardLabelSelected]}>
                {opt.label}
              </Text>
              <Text style={styles.cardDesc}>{opt.description}</Text>
              {selected && <View style={styles.checkBadge}><Text style={styles.checkText}>✓</Text></View>}
            </TouchableOpacity>
          )
        })}
      </View>
    </StepWrapper>
  )
}

const styles = StyleSheet.create({
  options: {
    gap: 10,
  },
  card: {
    backgroundColor: '#1A1A24',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2A2A38',
    padding: 18,
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#7C6EF8',
    backgroundColor: '#1E1B38',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#AAAABC',
    marginBottom: 4,
  },
  cardLabelSelected: {
    color: '#F2F2F2',
  },
  cardDesc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  checkBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7C6EF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
})