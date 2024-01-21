import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { LoginCheck } from './LoginCheck';
import { Icon } from 'react-native-elements';
import { memoApi } from '../api/memo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const Home: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false); // ログインボタンのローディング表示
  const testData = [
    { id: 1, amount: 1000, partner: 'test', date: '2021-10-01', period: '2021-10-31', memo: 'test', type: 0 },
    { id: 2, amount: 2000, partner: 'test2', date: '2021-10-01', period: '2021-10-31', memo: 'test2', type: 1 },
    { id: 3, amount: 3000, partner: 'test3', date: '2021-10-01', period: '2021-10-31', memo: 'test3', type: 0 },
    { id: 4, amount: 4000, partner: 'test4', date: '2021-10-01', period: '2021-10-31', memo: 'test4', type: 1 },
  ];

  const typeValue = ['貸し', '借り'];

  const toggleDialog = () => {
    navigation.navigate('Event');
  };
  const onPushed = (id: number) => {
    console.log(id);
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={testData}
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
