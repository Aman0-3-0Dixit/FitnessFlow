import { useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useFlow } from '../context/FlowContext'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = '@fitnessflow_session'

export function useProgress() {
  const {
    answers,
    setCurrentStep,
    setSessionId,
    setIsLoading,
    setHasResumableSession,
    updateAnswer,
    sessionId,
  } = useFlow()

  const initSession = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)

      if (stored) {
        const parsed = JSON.parse(stored)
        const { id, step, answers: localAnswers } = parsed

        // Restore session ID
        setSessionId(id)

        // Try Firebase for latest answers
        try {
          const snap = await getDoc(doc(db, 'userProgress', id))
          if (snap.exists()) {
            const data = snap.data()
            const savedAnswers = data.answers ?? {}
            const savedStep = data.currentStep ?? step ?? 1

            // Restore each answer field into context
            Object.entries(savedAnswers).forEach(([key, val]) => {
              updateAnswer(key, val)
            })

            const stepNum = savedStep === 'done' ? 5 : Number(savedStep)
            setCurrentStep(stepNum)

            // Only show resume if past step 1
            if (stepNum > 1 || Object.values(savedAnswers).some(v =>
              Array.isArray(v) ? v.length > 0 : v !== null
            )) {
              setHasResumableSession(true)
            }

          } else if (localAnswers) {
            // Firebase doc missing — use local answers
            Object.entries(localAnswers).forEach(([key, val]) => {
              updateAnswer(key, val)
            })
            const stepNum = Number(step) ?? 1
            setCurrentStep(stepNum)
            if (stepNum > 1) setHasResumableSession(true)
          }

        } catch (firebaseErr) {
          // Firebase unreachable — use local data
          console.warn('Firebase fetch failed, using local:', firebaseErr)
          if (localAnswers) {
            Object.entries(localAnswers).forEach(([key, val]) => {
              updateAnswer(key, val)
            })
          }
          const stepNum = Number(step) ?? 1
          setCurrentStep(stepNum)
          if (stepNum > 1) setHasResumableSession(true)
        }

      } else {
        // Brand new user
        const newId = uuidv4()
        setSessionId(newId)
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          id: newId,
          step: 1,
          answers: {},
        }))
      }

    } catch (err) {
      console.warn('Session init failed:', err)
      const newId = uuidv4()
      setSessionId(newId)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveProgress = async (step, updatedAnswers) => {
    if (!sessionId) return

    const payload = {
      currentStep: step,
      answers: updatedAnswers,
      updatedAt: new Date().toISOString(),
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        id: sessionId,
        step,
        answers: updatedAnswers,
      }))
    } catch (err) {
      console.warn('AsyncStorage save failed:', err)
    }

    try {
      await setDoc(doc(db, 'userProgress', sessionId), payload)
    } catch (err) {
      console.warn('Firebase save failed:', err)
    }
  }

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.warn('Clear session failed:', err)
    }
  }

  return { initSession, saveProgress, clearSession }
}