import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { LoginCheck } from './LoginCheck';
import { Icon, Dialog } from 'react-native-elements';
import { memoApi } from '../api/memoApi';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useRecoilState } from 'recoil';
import { UpdateFlgAtom } from '../recoil/UpdateFlgAtom';

type Data = {
  id: number;
  amount: number;
  partner: string;
  date: string;
  period: string;
  memo: string;
  type: number;
};

const Home: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const [loading, setLoading] = useState(false); // データ取得時のローディング表示
  const [data, setData] = useState<Data[]>([]); // メモ一覧
  const [updateFlg, setUpdateFlg] = useRecoilState<boolean>(UpdateFlgAtom);

  const typeValue = ['貸し', '借り'];

  const toggleDialog = () => {
    navigation.navigate('Event');
  };

  const getMemo = async () => {
    setLoading(true);
    try {
      const res = await memoApi.getAll();
      if (res.status === 200) {
        setData(res.data);
      } else if (res.status === 401) {
        alert('再ログインしてください');
        navigation.navigate('Login');
      } else {
        alert('サーバーエラーが発生しました');
      }
    } catch (error: any) {
      alert('サーバーエラーが発生しました');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // // イベント一覧を取得
  // useEffect(() => {
  //   getMemo();
  // }, [navigation]);

  // メモの登録・更新後に一覧を更新
  useFocusEffect(
    React.useCallback(() => {
      console.log(updateFlg);
      if (updateFlg) {
        console.log('Home screen was focused');
        getMemo();
        setUpdateFlg(false);
      }
    }, [])
  );

  // イベント更新画面へ遷移
  const onPushed = (id: number) => {
    navigation.navigate('Event', { id: id });
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Dialog.Loading />
      ) : (
        <>
          <FlatList
            data={data}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  onPushed(item.id);
                }}
              >
                <View style={styles.listStyle}>
                  <View style={styles.listItemDate}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {item.date.split('T')[0]} 〜 {item.period.split('T')[0]}
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                      <View>
                        {item.type === 0 ? (
                          <Image source={require('../../assets/kasi.png')} style={styles.icon} />
                        ) : (
                          <Image source={require('../../assets/kari.png')} style={styles.icon} />
                        )}
                      </View>
                      <View>
                        <Text style={styles.listItemAmount}>{item.amount}</Text>
                      </View>
                    </View>
                    <View style={{ alignSelf: 'flex-end' }}>
                      <Text>
                        {item.partner}に{typeValue[item.type]}
                      </Text>
                      <Text style={{ textAlign: 'right' }}>{item.memo}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />

          <View style={styles.addButton}>
            <Icon name='plus-circle' size={50} color={'skyblue'} type='font-awesome-5' onPress={toggleDialog} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default LoginCheck(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
  },
  listStyle: {
    paddingHorizontal: 15,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#bcbcbc',
    paddingBottom: 8,
  },
  listItemDate: {
    alignItems: 'flex-end',
    fontSize: 17,
  },
  listItem: {
    alignItems: 'flex-end',
  },
  listItemAmount: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    zIndex: 100,
  },
  button: {
    marginTop: 10,
    width: '50%',
    marginBottom: 10,
  },
  error: {
    width: '80%',
    marginLeft: 10,
    position: 'relative',
    top: -15,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
    marginTop: 3,
  },
});
