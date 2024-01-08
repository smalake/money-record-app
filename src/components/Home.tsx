import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { LoginCheck } from './LoginCheck';

const Home: React.FC = () => {
  return (
    <SafeAreaView>
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default LoginCheck(Home);
