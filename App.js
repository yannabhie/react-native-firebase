

import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import Dashboard from './Dashboard';

import { getAuth, signOut } from 'firebase/auth';
import { Button } from 'react-native';
import { useEffect } from 'react';
import History from './History';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInForm}
        options={{
          title: 'Sign In',
          headerTitleStyle: {
            color: '#9beaec',
          },
        }}
      />
        <Stack.Screen
          name="SignUp"
          component={SignUpForm}
          options={{
            title: 'Sign Up',
            headerTitleStyle: {
              color: '#9beaec',
            },
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={({ navigation }) => ({
            title: 'Dashboard',
            headerTitleStyle: {
              color: '#9beaec',
            }, 
            headerBackVisible: false,
            headerRight: () => {
              return (
                <Button
                  title="Logout"
                  onPress={async () => {
                    const auth = getAuth();
                    await signOut(auth)
                    navigation.navigate('SignIn')
                  }}
                />
              )
            }
          })}
        />
        <Stack.Screen
          name="History"
          component={History}
          options={({ navigation }) => ({
            title: 'History', 
            headerTitleStyle: {
              color: '#9beaec',
            },
            headerBackVisible: false,
            headerRight: () => {
              return (
                <Button
                  title="Logout"
                  onPress={async () => {
                    const auth = getAuth();
                    await signOut(auth)
                    navigation.navigate('SignIn')
                  }}
                />
              )
            }
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

