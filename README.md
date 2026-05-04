# FitnessFlow

A guided fitness onboarding app built with React Native and Expo. Users answer a few questions about their goals and schedule, and the app builds a profile around their answers.

Built this as part of a React Native assignment. The brief asked for a multi-step flow with conditional navigation, Firebase integration, and resume capability — so that's what this is.


## What it does

- 4–5 step onboarding flow depending on your goal selection
- If you pick **Weight Loss**, an extra step appears asking about diet preferences. Any other goal skips it entirely.
- Progress saves after every step — both locally and to Firestore
- Close the app midway, reopen it, and it asks if you want to continue where you left off
- Final summary screen shows all your answers with the option to go back and edit any of them
- Admin screen that fetches all saved sessions live from Firestore


## Screens

| Screen | What happens |
| Welcome | Checks for a saved session and shows a resume option if found |
| Step 1 | Age range (radio) |
| Step 2 | Primary goal (card selection) |
| Step 3 | Diet preference — only shown if goal is Weight Loss |
| Step 4 | Workout days (multi-select chips) |
| Step 5 | Experience level (radio) |
| Summary | Full review with edit buttons per answer |
| Admin | Live feed of all Firestore sessions |


## Tech

- React Native + Expo (SDK 54)
- React Navigation — native stack
- React Context for state management
- Firebase Firestore for backend
- AsyncStorage for local persistence
- UUID for session identification


## How the conditional flow works

The step order is controlled by a single function in `src/utils/navigation.js`:

export const getStepOrder = (goal) => {
  if (goal === 'Weight Loss') return [1, 2, 3, 4, 5]
  return [1, 2, 4, 5]
}

Everything — next step, previous step, progress bar position, step count — is derived from this one function. Changing the flow means changing one array.


## State management

Used React Context over Redux because the state here is shallow and flows in one direction. There's no async middleware needed, no complex selectors. FlowContext holds three things: the current step, the answers object, and the session ID. That's it.

The `useProgress` hook handles all I/O so screens stay clean. Each step screen is under 80 lines.

One edge case worth mentioning — if a user picks Weight Loss, answers the diet step, then goes back and changes their goal to something else, the diet answer gets cleared automatically:

const updateGoal = (value) => {
  setAnswers(prev => ({
    ...prev,
    goal: value,
    dietPreference: value === 'Weight Loss' ? prev.dietPreference : null,
  }))
}

Without this, the summary screen would show a diet preference that's no longer relevant.


## Persistence

Two layers:

1. **AsyncStorage** — saves after every step, works offline, instant
2. **Firestore** — syncs in the background, used to restore on relaunch

Local save always runs first. If Firebase is unreachable mid-flow, the user never sees an error — their data is safe locally. The only place Firebase failure is surfaced to the user is the final submission screen, which has a retry button.


## Error handling

- Mid-flow Firebase failures: silent, user keeps going
- Final submission failure: error card appears with a Retry button
- Session restore failure: app falls back to a fresh session gracefully
- All async operations wrapped in try/catch


## Running locally

git clone https://github.com/boredape03/FitnessFlow
cd FitnessFlow
npm install

Create a `.env` file in the root:

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

Fill in your own Firebase project values, then:

npx expo start


Scan the QR with Expo Go on your phone.


## Folder structure


src/
├── context/
│   └── FlowContext.js       global state
├── hooks/
│   └── useProgress.js       save/load logic
├── screens/
│   ├── WelcomeScreen.js
│   ├── Step1Screen.js
│   ├── Step2Screen.js
│   ├── Step3Screen.js       conditional
│   ├── Step4Screen.js
│   ├── Step5Screen.js
│   ├── SummaryScreen.js
│   └── AdminScreen.js
├── components/
│   ├── StepWrapper.js       shared layout shell
│   ├── ProgressBar.js       animated
│   ├── RadioGroup.js
│   └── MultiSelect.js
└── utils/
    └── navigation.js        step order logic


## Assumptions

- One session per device. The session ID is generated on first launch and stored in AsyncStorage.
- No authentication. In production the session ID would be tied to a Firebase Auth UID and the Firestore rules would enforce that.
- Firestore rules are currently open (`allow read, write: if true`) for demo purposes.