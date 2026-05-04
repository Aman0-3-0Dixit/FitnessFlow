// Returns the ordered list of step numbers based on user's goal
// This is the ONLY place the conditional logic lives - easy to maintain
export const getStepOrder = (goal) => {
  if (goal === 'Weight Loss') {
    return [1, 2, 3, 4, 5]   // include diet step
  }
  return [1, 2, 4, 5]         // skip step 3
}

// Given current step number, return the NEXT step number
export const getNextStep = (currentStep, goal) => {
  const order = getStepOrder(goal)
  const idx = order.indexOf(currentStep)
  return order[idx + 1] ?? null   // null means we're at the end
}

// Given current step number, return the PREVIOUS step number
export const getPrevStep = (currentStep, goal) => {
  const order = getStepOrder(goal)
  const idx = order.indexOf(currentStep)
  return order[idx - 1] ?? null   // null means we're at step 1
}

// Total steps shown to THIS user (4 or 5 depending on goal)
export const getTotalSteps = (goal) => getStepOrder(goal).length

// What position is the user at? (for progress bar - "Step 2 of 4")
export const getStepPosition = (currentStep, goal) => {
  const order = getStepOrder(goal)
  return order.indexOf(currentStep) + 1
}