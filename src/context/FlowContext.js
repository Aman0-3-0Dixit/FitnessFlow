import React, { createContext, useContext, useState } from 'react'

const defaultAnswers = {
  ageRange: null,
  goal: null,
  dietPreference: null,
  workoutDays: [],
  experienceLevel: null,
}

const FlowContext = createContext(null)

export function FlowProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState(defaultAnswers)
  const [sessionId, setSessionId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasResumableSession, setHasResumableSession] = useState(false)

  const updateAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const updateGoal = (value) => {
    setAnswers(prev => ({
      ...prev,
      goal: value,
      dietPreference: value === 'Weight Loss' ? prev.dietPreference : null,
    }))
  }

  // Reset everything
  const resetFlow = () => {
    setAnswers(defaultAnswers)
    setCurrentStep(1)
    setHasResumableSession(false)
  }

  return (
    <FlowContext.Provider value={{
      currentStep,
      setCurrentStep,
      answers,
      updateAnswer,
      updateGoal,
      sessionId,
      setSessionId,
      isLoading,
      setIsLoading,
      hasResumableSession,
      setHasResumableSession,
      resetFlow,
    }}>
      {children}
    </FlowContext.Provider>
  )
}

export const useFlow = () => {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used inside FlowProvider')
  return ctx
}