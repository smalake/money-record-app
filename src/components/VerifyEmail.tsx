import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from 'react-native-elements';
import { SafeAreaView, StyleSheet, BackHandler, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { yupResolver } from '@hookform/resolvers/yup';
import { verifyEmailValidation } from '../util/Validation';
import { authApi } from '../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FormData = {
  authCode: string;
};

export const VerifyEmail: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false); // ログインボタンのローディング表示

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(verifyEmailValidation) });

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
      const email = await AsyncStorage.getItem('email');
      if (email === null) {
        alert('認証に失敗しました');
        return;
      }
      const req = { auth_code: Number(data.authCode), email: email }; // number型に変換
      const res = await authApi.verifyEmail(req);
      switch (res.status) {
        case 200:
          await AsyncStorage.removeItem('email');
          alert('認証に成功しました');
          navigation.navigate('Login');
          break;
        case 400:
          alert('リクエストが不正です');
        case 403:
          alert('認証コードの有効期限が切れています');
          break;
        case 401:
          alert('認証コードが無効です');
          break;
        default:
          alert('サーバーエラーが発生しました');
      }
    } catch (error: any) {
      if (error.response && error.response.status) {
        switch (error.response.status) {
          case 400:
            alert('リクエストが不正です');
            break;
          case 403:
            alert('認証コードの有効期限が切れています');
            break;
          case 401:
            alert('認証コードが無効です');
            break;
          default:
            alert('サーバーエラーが発生しました');
        }
      } else {
        alert('サーバーエラーが発生しました');
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Controller
          control={control}
          name='authCode'
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder='認証コード'
              keyboardType='number-pad'
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => {
                // 数字以外の入力を無効化
                const numericValue = value.replace(/[^0-9]/g, '');
                onChange(numericValue);
              }}
            />
          )}
        />
      </View>
      <View style={styles.error}>{errors.authCode && <Text style={{ color: 'red', textAlign: 'left' }}>{errors.authCode.message}</Text>}</View>
      <View style={styles.button}>
        <Button title='認証' loading={loading} onPress={handleSubmit(onSubmit)} />
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
    marginBottom: 20,
  },
});
