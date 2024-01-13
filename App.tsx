import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './src/components/Login';
import Home from './src/components/Home';
import { Register } from './src/components/Register';
import { VerifyEmail } from './src/components/VerifyEmail';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='Register' component={Register} options={{ headerTitle: 'ユーザー登録' }} />
        <Stack.Screen name='VerifyEmail' component={VerifyEmail} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='Home' component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
