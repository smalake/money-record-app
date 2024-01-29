import { SafeAreaView, View } from 'react-native';
import { Button } from 'react-native-elements';
import { authApi } from '../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LoginCheck } from './LoginCheck';

const Setting: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const logout = async () => {
    try {
      const res = await authApi.logout();
      if (res.status === 200) {
        await AsyncStorage.removeItem('accessToken');
        alert('ログアウトしました');
        navigation.navigate('Login');
      } else {
        console.log(res);
        alert('サーバーエラーが発生しました');
      }
    } catch (error) {
      console.log(error);
      alert('サーバーエラーが発生しました');
    }
  };
  return (
    <SafeAreaView>
      <View>
        <Button title='ログアウト' onPress={logout} />
      </View>
    </SafeAreaView>
  );
};

export default LoginCheck(Setting);
