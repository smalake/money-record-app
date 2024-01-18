import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableHighlight, FlatList } from 'react-native';
import { LoginCheck } from './LoginCheck';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { homeValidation } from '../util/Validation';
import { Button, Dialog, Icon, Input, Overlay } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { memoApi } from '../api/memo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type FormData = {
  amount: string;
  partner: string;
  date?: Date;
  period?: Date;
  memo?: string;
};
const Home: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false); // ログインボタンのローディング表示
  const [date, setDate] = useState(new Date());
  const [dateVasible, setDateVisible] = useState(false);
  const [period, setPeriod] = useState(new Date());
  const [periodVisible, setPeriodVisible] = useState(false);
  const testData = [
    { id: 1, amount: 1000, partner: 'test', date: '2021-10-01', period: '2021-10-31', memo: 'test' },
    { id: 2, amount: 2000, partner: 'test2', date: '2021-10-01', period: '2021-10-31', memo: 'test2' },
    { id: 3, amount: 3000, partner: 'test3', date: '2021-10-01', period: '2021-10-31', memo: 'test3' },
    { id: 4, amount: 4000, partner: 'test4', date: '2021-10-01', period: '2021-10-31', memo: 'test4' },
  ];
  const testHeader = ['取引相手', '金額', '取引日', '期限日', 'メモ'];
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(homeValidation) });

  const toggleDate = () => {
    setDateVisible(!dateVasible);
  };
  const togglePeriod = () => {
    setPeriodVisible(!periodVisible);
  };

  const handleConfirm = (date: Date) => {
    setDate(date);
    toggleDate();
  };
  const handlePeriodConfirm = (date: Date) => {
    setPeriod(date);
    togglePeriod();
  };

  const toggleDialog = () => {
    setVisible(!visible);
  };
  const onPushed = (id: number) => {
    console.log(id);
  };
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const req = { ...data, amount: Number(data.amount), date: date, period: period };
      const res = await memoApi.register(req);
      if (res.status === 200) {
        alert('登録しました');
      } else if (res.status === 401) {
        alert('再ログインしてください');
        navigation.navigate('Login');
      } else {
        alert('登録に失敗しました');
      }
    } catch (error) {
      alert('登録に失敗しました');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listStyle}>
        <Text style={styles.listItemPartner}>取引相手</Text>
        <Text style={styles.listItemAmount}>金額</Text>
        <Text style={styles.listItemDate}>取引日</Text>
        <Text style={styles.listItemPeriod}>期限日</Text>
        <Text style={styles.listItemMemo}>メモ</Text>
      </View>
      <FlatList
        data={testData}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress={() => {
              onPushed(item.id);
            }}
            underlayColor={'blue'}
          >
            <View style={styles.listStyle}>
              <Text style={styles.listItemPartner}>{item.partner}</Text>
              <Text style={styles.listItemAmount}>{item.amount}</Text>
              <Text style={styles.listItemDate}>{item.date}</Text>
              <Text style={styles.listItemPeriod}>{item.period}</Text>
              <Text style={styles.listItemMemo}>{item.memo}</Text>
            </View>
          </TouchableHighlight>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.addButton}>
        <Icon name='plus-circle' size={50} color={'skyblue'} type='font-awesome-5' onPress={toggleDialog} />
      </View>
      <Overlay isVisible={visible} overlayStyle={{ paddingTop: 100 }} fullScreen={true}>
        <View style={styles.formLabel}>
          <Text>金額</Text>
        </View>
        <View>
          <Controller
            control={control}
            name='amount'
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder='金額を入力'
                keyboardType='number-pad'
                onBlur={onBlur}
                value={value}
                onChangeText={(value) => {
                  // 数字以外の入力を無効化
                  const numericValue = value.replace(/[^0-9]/g, '');
                  onChange(numericValue);
                }}
              />
            )}
          />
        </View>
        <View style={styles.error}>{errors.amount && <Text style={{ color: 'red', textAlign: 'left' }}>{errors.amount.message}</Text>}</View>
        <View style={styles.formLabel}>
          <Text>取引相手</Text>
        </View>
        <View>
          <Controller
            control={control}
            name='partner'
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder='取引相手を入力'
                onBlur={onBlur}
                value={value}
                onChangeText={(value) => {
                  onChange(value);
                }}
              />
            )}
          />
        </View>
        <View style={styles.error}>{errors.partner && <Text style={{ color: 'red', textAlign: 'left' }}>{errors.partner.message}</Text>}</View>
        <View style={styles.formLabel}>
          <Text>メモ</Text>
        </View>
        <View>
          <Controller
            control={control}
            name='memo'
            // rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder='メモを入力'
                onBlur={onBlur}
                value={value}
                onChangeText={(value) => {
                  onChange(value);
                }}
              />
            )}
          />
        </View>
        <View style={styles.formLabel}>
          <Text>登録日</Text>
        </View>
        <View style={styles.date}>
          <View style={styles.dateInput}>
            <Controller
              control={control}
              name='date'
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  disabled
                  style={{ color: 'black' }}
                  onBlur={onBlur}
                  value={date.toLocaleDateString()}
                  onChangeText={(value) => {
                    onChange(value);
                  }}
                />
              )}
            />
          </View>
          <View style={styles.dateButton}>
            <Icon name='calendar' type='font-awesome-5' onPress={toggleDate} />
            <DateTimePickerModal isVisible={dateVasible} locale='ja-JP' mode='date' onConfirm={handleConfirm} onCancel={toggleDate} />
          </View>
        </View>
        <View style={styles.formLabel}>
          <Text>期限日</Text>
        </View>
        <View style={styles.date}>
          <View style={styles.dateInput}>
            <Controller
              control={control}
              name='period'
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  disabled
                  style={{ color: 'black' }}
                  onBlur={onBlur}
                  value={period.toLocaleDateString()}
                  onChangeText={(value) => {
                    onChange(value);
                  }}
                />
              )}
            />
          </View>
          <View style={styles.dateButton}>
            <Icon name='calendar' type='font-awesome-5' onPress={togglePeriod} />
            <DateTimePickerModal isVisible={periodVisible} locale='ja-JP' mode='date' onConfirm={handlePeriodConfirm} onCancel={togglePeriod} />
          </View>
        </View>
        <View style={styles.buttonArea}>
          <View style={styles.button}>
            <Button title='登録' titleStyle={{ fontWeight: 'bold' }} loading={loading} onPress={handleSubmit(onSubmit)} />
          </View>
          <View style={styles.button}>
            <Button
              title='キャンセル'
              buttonStyle={{
                backgroundColor: 'gainsboro',
                borderRadius: 3,
              }}
              titleStyle={{ color: 'black' }}
              onPress={toggleDialog}
            />
          </View>
        </View>
      </Overlay>
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
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    backgroundColor: 'skyblue',
  },
  listItemPartner: {
    flexGrow: 2,
    textAlign: 'center',
    fontSize: 17,
  },
  listItemAmount: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 17,
  },
  listItemDate: {
    flexGrow: 2,
    textAlign: 'center',
    fontSize: 17,
  },
  listItemPeriod: {
    flexGrow: 2,
    textAlign: 'center',
    fontSize: 17,
  },
  listItemMemo: {
    flexGrow: 5,
    textAlign: 'center',
    fontSize: 17,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    zIndex: 100,
  },
  date: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
  },
  formLabel: {
    position: 'relative',
    left: 5,
    top: 3,
  },
  dateInput: {
    width: '100%',
  },
  dateButton: {
    position: 'absolute',
    right: 22,
    top: 7,
  },
  buttonArea: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
});
