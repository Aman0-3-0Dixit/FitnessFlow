import React from 'react'
import { Alert } from 'react-native'
import StepWrapper from '../components/StepWrapper'
import MultiSelect from '../components/MultiSelect'
import { useFlow } from '../context/FlowContext'
import { useProgress } from '../hooks/useProgress'
import { getNextStep, getPrevStep } from '../utils/navigation'

const DAY_OPTIONS = [
  { label: 'Mon', value: 'Monday' },
  { label: 'Tue', value: 'Tuesday' },
  { label: 'Wed', value: 'Wednesday' },
  { label: 'Thu', value: 'Thursday' },
  { label: 'Fri', value: 'Friday' },
  { label: 'Sat', value: 'Saturday' },
  { label: 'Sun', value: 'Sunday' },
]

export default function Step4Screen({ navigation }) {
  const { answers, updateAnswer, setCurrentStep } = useFlow()
  const { saveProgress } = useProgress()

  const handleNext = async () => {
    if (!answers.workoutDays || answers.workoutDays.length === 0) {
      Alert.alert('Required', 'Pick at least one day you can commit to.')
      return
    }

    const next = getNextStep(4, answers.goal)
    setCurrentStep(next)
    saveProgress(next, answers).catch(() => {})
    navigation.navigate(`Step${next}`)
  }

  const handleBack = () => {
    const prev = getPrevStep(4, answers.goal)
    navigation.navigate(`Step${prev}`)
  }

  return (
    <StepWrapper
      title="Which days work for you?"
      subtitle="Pick the days you can realistically commit to working out."
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!answers.workoutDays || answers.workoutDays.length === 0}
      currentStep={4}
    >
      <MultiSelect
        options={DAY_OPTIONS}
        values={answers.workoutDays}
        onChange={(val) => updateAnswer('workoutDays', val)}
      />
    </StepWrapper>
  )
}