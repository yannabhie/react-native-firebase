import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const fb = () => {
  const app = initializeApp(firebaseConfig);  
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  return {
    app,
    auth
  }
}

export default fb