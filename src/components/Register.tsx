import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from 'react-native-elements';
import { SafeAreaView, StyleSheet, BackHandler, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerValidation } from '../util/Validation';
import { authApi } from '../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

export const Register: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false); // ログインボタンのローディング表示

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(registerValidation) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // 新規登録処理
      const res = await authApi.register({ ...data, register_type: 1 });
      await AsyncStorage.setItem('email', data.email);
      alert('登録いただいたメールアドレス宛に認証コードを送信しました');
      navigation.navigate('VerifyEmail');
    } catch (error: any) {
      setLoading(false);
      if (error.response && error.response.status) {
        switch (error.response.status) {
          case 400:
            alert('リクエストが不正です');
            break;
          case 409:
            alert('すでに使用されているメールアドレスです');
            break;
          default:
            alert('サーバーエラーが発生しました');
        }
      } else {
        alert('サーバーエラーが発生しました');
      }
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
              keyboardType='visible-password'
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

      <View style={styles.form}>
        <Controller
          control={control}
          name='confirmPassword'
          rules={{ required: true }}
          defaultValue=''
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder='パスワード(確認用)'
              keyboardType='visible-password'
              leftIcon={{ type: 'font-awesome-5', name: 'redo', size: 16 }}
              secureTextEntry={true}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
            />
          )}
        />
      </View>
      <View style={styles.error}>{errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword.message}</Text>}</View>

      <View style={styles.form}>
        <Controller
          control={control}
          name='name'
          rules={{ required: true }}
          defaultValue=''
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder='表示名'
              leftIcon={{ type: 'font-awesome', name: 'user', size: 22 }}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
            />
          )}
        />
      </View>
      <View style={styles.error}>{errors.name && <Text style={{ color: 'red' }}>{errors.name.message}</Text>}</View>

      <View style={styles.button}>
        <Button title='登録' loading={loading} onPress={handleSubmit(onSubmit)} />
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
