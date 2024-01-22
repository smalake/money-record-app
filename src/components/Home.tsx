import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { LoginCheck } from './LoginCheck';
import { Icon, Dialog } from 'react-native-elements';
import { memoApi } from '../api/memoApi';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

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
  const [loading, setLoading] = useState(false); // データ取得時のローディング表示
  const [data, setData] = useState<Data[]>([]); // メモ一覧

  const typeValue = ['貸し', '借り'];

  const toggleDialog = () => {
    navigation.navigate('Event');
  };

  // イベント一覧を取得
  useEffect(() => {
    const getMemo = async () => {
      setLoading(true);
      try {
        const res = await memoApi.getMemo();
        if (res.status === 200) {
          setData(res.data);
        } else if (res.status === 401) {
          alert('再ログインしてください');
          navigation.navigate('Login');
        } else {
          alert('サーバーエラーが発生しました');
        }
        console.log(res);
      } catch (error: any) {
        alert('サーバーエラーが発生しました');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMemo();
  }, []);

  // イベント更新画面へ遷移
  const onPushed = (id: number) => {
    console.log(id);
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
                      {item.date} 〜 {item.period}
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
