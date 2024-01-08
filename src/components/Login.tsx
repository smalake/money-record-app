import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

export const Login: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Input placeholder='メールアドレス' keyboardType='email-address' returnKeyType='next' value={email} onChangeText={(value) => setEmail(value)} />
      <Input
        placeholder='パスワード'
        keyboardType='visible-password'
        returnKeyType='next'
        value={password}
        onChangeText={(value) => setPassword(value)}
      />
      <Button
        title='ログイン'
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
      <StatusBar style='auto' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
