import 'react-native-get-random-values'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FlowProvider } from './src/context/FlowContext'

import WelcomeScreen from './src/screens/WelcomeScreen'
import Step1Screen from './src/screens/Step1Screen'
import Step2Screen from './src/screens/Step2Screen'
import Step3Screen from './src/screens/Step3Screen'
import Step4Screen from './src/screens/Step4Screen'
import Step5Screen from './src/screens/Step5Screen'
import SummaryScreen from './src/screens/SummaryScreen'
import AdminScreen from './src/screens/AdminScreen'
import { db } from './firebase'
console.log('DB INSTANCE:', db)

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <FlowProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome"  component={WelcomeScreen} />
          <Stack.Screen name="Step1"    component={Step1Screen} />
          <Stack.Screen name="Step2"    component={Step2Screen} />
          <Stack.Screen name="Step3"    component={Step3Screen} />
          <Stack.Screen name="Step4"    component={Step4Screen} />
          <Stack.Screen name="Step5"    component={Step5Screen} />
          <Stack.Screen name="Summary"  component={SummaryScreen} />
          <Stack.Screen name="Admin"    component={AdminScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FlowProvider>
  )
}