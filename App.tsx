import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './src/components/Login';
import { Register } from './src/components/Register';
import { VerifyEmail } from './src/components/VerifyEmail';
import Event from './src/components/Event';
import { Text, TouchableOpacity } from 'react-native';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { UpdateFlgAtom } from './src/recoil/UpdateFlgAtom';
import { Home } from './src/components/Home';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: undefined;
  List: { update: number } | undefined;
  Event: { id: number } | undefined;
  Setting: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  // ヘッダーボタンコンポーネントを作成
  const BackButton = () => {
    const navigation = useNavigation();
    const setUpdateFlg = useSetRecoilState(UpdateFlgAtom);
    return (
      <TouchableOpacity
        onPress={() => {
          setUpdateFlg(false);
          navigation.goBack();
        }}
        style={{ marginLeft: 10, marginTop: 2 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>閉じる</Text>
      </TouchableOpacity>
    );
  };

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false, gestureEnabled: false, presentation: 'modal', animation: 'default' }}
          />
          <Stack.Screen
            name='Register'
            component={Register}
            options={{
              headerTitle: 'ユーザー登録',
              headerLeft: () => <BackButton />,
              presentation: 'modal',
              headerTintColor: 'white',
              headerStyle: { backgroundColor: 'deepskyblue' },
            }}
          />
          <Stack.Screen name='VerifyEmail' component={VerifyEmail} options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen
            name='Event'
            component={Event}
            options={{
              presentation: 'modal',
              animation: 'default',
              headerTitle: '貸し借り',
              headerLeft: () => <BackButton />,
              headerTintColor: 'white',
              headerStyle: { backgroundColor: 'deepskyblue' },
            }}
          />
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;
