import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';

//import { getDatabase, set, ref } from "firebase/database";
import 'react-native-get-random-values';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import fb from './fb';

fb()

const SignInForm = ({ navigation }) => {
  const [email, setEmail] = useState('juan@yopmail.com');
  const [password, setPassword] = useState('Abc@1234');

  const handleSignUp = () => {
    navigation.navigate('SignUp')
  }

  const handleLogin = async () => {
    
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        navigation.navigate('Dashboard')
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        Alert.alert('Error', errorMessage)
        setEmail('')
        setPassword('')
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles?.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button color="white" title="Submit" onPress={handleLogin} />
      </View>
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    backgroundColor: 'blue',
    borderRadius: 5,
  }
});

export default SignInForm;