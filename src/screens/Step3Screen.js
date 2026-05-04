import React from 'react'
import { Alert } from 'react-native'
import StepWrapper from '../components/StepWrapper'
import RadioGroup from '../components/RadioGroup'
import { useFlow } from '../context/FlowContext'
import { useProgress } from '../hooks/useProgress'
import { getNextStep, getPrevStep } from '../utils/navigation'

const DIET_OPTIONS = [
  {
    label: 'No preference',
    value: 'none',
    description: 'I eat everything, keep it balanced',
  },
  {
    label: 'Vegetarian',
    value: 'vegetarian',
    description: 'No meat, dairy and eggs are fine',
  },
  {
    label: 'Vegan',
    value: 'vegan',
    description: 'Fully plant-based',
  },
  {
    label: 'Keto',
    value: 'keto',
    description: 'High fat, very low carb',
  },
  {
    label: 'Intermittent Fasting',
    value: 'if',
    description: 'Time-restricted eating window',
  },
]

export default function Step3Screen({ navigation }) {
  const { answers, updateAnswer, setCurrentStep } = useFlow()
  const { saveProgress } = useProgress()

  const handleNext = async () => {
    if (!answers.dietPreference) {
      Alert.alert('Required', 'Please select a diet preference to continue.')
      return
    }

    const next = getNextStep(3, answers.goal)
    setCurrentStep(next)
    saveProgress(next, answers).catch(() => {})
    navigation.navigate(`Step${next}`)
  }

  const handleBack = () => {
    const prev = getPrevStep(3, answers.goal)
    navigation.navigate(`Step${prev}`)
  }

  return (
    <StepWrapper
      title="Any diet preferences?"
      subtitle="We'll align your nutrition tips and meal ideas around this."
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!answers.dietPreference}
      currentStep={3}
    >
      <RadioGroup
        options={DIET_OPTIONS}
        value={answers.dietPreference}
        onChange={(val) => updateAnswer('dietPreference', val)}
      />
    </StepWrapper>
  )
}