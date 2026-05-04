import React from 'react'
import { Alert } from 'react-native'
import StepWrapper from '../components/StepWrapper'
import RadioGroup from '../components/RadioGroup'
import { useFlow } from '../context/FlowContext'
import { useProgress } from '../hooks/useProgress'
import { getPrevStep } from '../utils/navigation'

const LEVEL_OPTIONS = [
  {
    label: 'Beginner',
    value: 'beginner',
    description: 'New to working out or getting back into it',
  },
  {
    label: 'Intermediate',
    value: 'intermediate',
    description: 'Training consistently for 6+ months',
  },
  {
    label: 'Advanced',
    value: 'advanced',
    description: 'Training seriously for 2+ years',
  },
]

export default function Step5Screen({ navigation }) {
  const { answers, updateAnswer, setCurrentStep } = useFlow()
  const { saveProgress } = useProgress()

  const handleNext = async () => {
    if (!answers.experienceLevel) {
      Alert.alert('Required', 'Please select your experience level.')
      return
    }

    // Last step — save final answers then go to summary
    await saveProgress('done', answers)
    setCurrentStep(5)
    navigation.navigate('Summary')
  }

  const handleBack = () => {
    const prev = getPrevStep(5, answers.goal)
    navigation.navigate(`Step${prev}`)
  }

  return (
    <StepWrapper
      title="How experienced are you?"
      subtitle="This sets the difficulty and progression pace of your plan."
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!answers.experienceLevel}
      isLastStep={true}
      currentStep={5}
    >
      <RadioGroup
        options={LEVEL_OPTIONS}
        value={answers.experienceLevel}
        onChange={(val) => updateAnswer('experienceLevel', val)}
      />
    </StepWrapper>
  )
}