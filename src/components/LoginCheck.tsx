import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginCheck = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const HOCComponent: React.FC<P> = (props) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
      // ログイン状態を確認する関数
      const checkLoggedIn = async () => {
        try {
          const token = await AsyncStorage.getItem('accessToken');
          if (token === null) {
            // ログインされていない場合はLoginページにリダイレクト
            navigation.navigate('Login');
          }
        } catch (error) {
          alert(error);
        }
      };
      checkLoggedIn();
    }, [navigation]);

    // ログインチェックが完了したら、WrappedComponentをレンダリング
    return <WrappedComponent {...props} />;
  };

  return HOCComponent;
};
