import React from 'react'
import { Alert } from 'react-native'
import StepWrapper from '../components/StepWrapper'
import RadioGroup from '../components/RadioGroup'
import { useFlow } from '../context/FlowContext'
import { useProgress } from '../hooks/useProgress'
import { getNextStep } from '../utils/navigation'

const AGE_OPTIONS = [
  { label: 'Under 18',  value: 'under_18' },
  { label: '18 – 25',  value: '18_25' },
  { label: '26 – 35',  value: '26_35' },
  { label: '36 – 50',  value: '36_50' },
  { label: '50+',      value: '50_plus' },
]

export default function Step1Screen({ navigation }) {
  const { answers, updateAnswer, setCurrentStep } = useFlow()
  const { saveProgress } = useProgress()

  const handleNext = async () => {
    // must pick an age range
    if (!answers.ageRange) {
      Alert.alert('Required', 'Please select your age range to continue.')
      return
    }

    const next = getNextStep(1, answers.goal)
    setCurrentStep(next)

    // Save progress in background — don't await so UI feels instant
    saveProgress(next, answers).catch(() => {})

    navigation.navigate(`Step${next}`)
  }

  return (
    <StepWrapper
      title="How old are you?"
      subtitle="We use this to tailor intensity and recovery recommendations."
      onNext={handleNext}
      nextDisabled={!answers.ageRange}
      currentStep={1}
    >
      <RadioGroup
        options={AGE_OPTIONS}
        value={answers.ageRange}
        onChange={(val) => updateAnswer('ageRange', val)}
      />
    </StepWrapper>
  )
}