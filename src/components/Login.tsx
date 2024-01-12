import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from 'react-native-elements';
import { SafeAreaView, StyleSheet, BackHandler, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginValidation } from '../util/Validation';
import { authApi } from '../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FormData = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false); // ログインボタンのローディング表示

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(loginValidation) });

  // Androidの戻るボタンを無効化
  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // ログイン処理
      const res = await authApi.loginMail(data);
      await AsyncStorage.setItem('accessToken', res.data.accessToken);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Home');
      }, 3000);
    } catch (error) {
      setLoading(false);
      alert('ログインに失敗しました');
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Controller
          control={control}
          name='email'
          rules={{ required: true }}
          defaultValue=''
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder='メールアドレス'
              leftIcon={{ type: 'font-awesome', name: 'envelope', size: 16 }}
              keyboardType='email-address'
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
            />
          )}
        />
      </View>
      <View style={styles.error}>{errors.email && <Text style={{ color: 'red', textAlign: 'left' }}>{errors.email.message}</Text>}</View>
      <View style={styles.form}>
        <Controller
          control={control}
          name='password'
          rules={{ required: true }}
          defaultValue=''
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder='パスワード'
              leftIcon={{ type: 'font-awesome', name: 'lock' }}
              secureTextEntry={true}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
            />
          )}
        />
      </View>
      <View style={styles.error}>{errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}</View>

      <View style={styles.button}>
        <Button title='ログイン' loading={loading} onPress={handleSubmit(onSubmit)} />
      </View>
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
  form: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  error: {
    marginBottom: 10,
    width: '75%',
  },
  button: {
    marginTop: 10,
    width: '50%',
  },
});
