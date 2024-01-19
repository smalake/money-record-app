import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './src/components/Login';
import Home from './src/components/Home';
import { Register } from './src/components/Register';
import { VerifyEmail } from './src/components/VerifyEmail';
import Event from './src/components/Event';
import { Text, TouchableOpacity } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: undefined;
  Home: undefined;
  Event: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  // ヘッダーボタンコンポーネントを作成します
  const BackButton = () => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{ marginLeft: 10 }}
      >
        <Text style={{ color: '#1e90ff' }}>閉じる</Text>
      </TouchableOpacity>
    );
  };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ headerShown: false, gestureEnabled: false, presentation: 'modal', animation: 'default' }}
        />
        <Stack.Screen name='Register' component={Register} options={{ headerTitle: 'ユーザー登録' }} />
        <Stack.Screen name='VerifyEmail' component={VerifyEmail} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen
          name='Event'
          component={Event}
          options={{
            presentation: 'modal',
            animation: 'default',
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
