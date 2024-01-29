import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { LoginCheck } from './LoginCheck';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { homeValidation } from '../util/Validation';
import { Button, Dialog, Icon, Input } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { memoApi } from '../api/memoApi';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Picker } from '@react-native-picker/picker';
import { useSetRecoilState } from 'recoil';
import { UpdateFlgAtom } from '../recoil/UpdateFlgAtom';

type FormData = {
  amount: string;
  partner: string;
  date?: Date;
  period?: Date;
  memo?: string;
};

type GetData = {
  id: number;
  amount: number;
  partner: string;
  date: string;
  period: string;
  memo: string;
  type: number;
};

const Event: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Event'>>();
  const [loading, setLoading] = useState(false); // 画面読み込み時のローディング表示
  const [buttonLoading, setButtonLoading] = useState(false); // ログインボタンのローディング表示
  const [amount, setAmount] = useState(0);
  const [partner, setPartner] = useState('');
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateVisible, setDateVisible] = useState(false);
  const [period, setPeriod] = useState(new Date());
  const [periodVisible, setPeriodVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState(0);
  const [isCreate, setIsCreate] = useState(true);
  const setUpdateFlg = useSetRecoilState(UpdateFlgAtom);

  const selectedType = ['貸す', '借りる'];

  useEffect(() => {
    if (route.params?.id) {
      const getMemoOne = async () => {
        setLoading(true);
        try {
          const res = await memoApi.getOne(route.params!.id);
          if (res.status === 200) {
            setAmount(res.data.amount);
            setPartner(res.data.partner);
            setMemo(res.data.memo);
            setDate(new Date(res.data.date));
            setPeriod(new Date(res.data.period));
            setType(res.data.type);
            setIsCreate(false);
            reset({ amount: res.data.amount.toString(), partner: res.data.partner });
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
      getMemoOne();
    }
  }, [route.params?.id]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: yupResolver(homeValidation), defaultValues: { amount: amount.toString(), partner: partner } });

  const toggleDate = () => {
    setDateVisible(!dateVisible);
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

  const onSubmit = async (data: FormData) => {
    setButtonLoading(true);
    try {
      const req = { ...data, amount: Number(data.amount), date: date, period: period, type: type };
      const res = await memoApi.register(req);
      if (res.status === 200) {
        setUpdateFlg(true);
        alert('登録しました');
        navigation.push('List');
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
      setButtonLoading(false);
    }
  };

  const onSubmitUpdate = async (data: FormData) => {
    setButtonLoading(true);
    try {
      const req = { ...data, id: route.params?.id, amount: Number(data.amount), date: date, period: period, type: type };
      const res = await memoApi.update(req);
      if (res.status === 200) {
        setUpdateFlg(true);
        alert('登録しました');
        navigation.navigate('List');
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
      setButtonLoading(false);
    }
  };
  return (
    <SafeAreaView>
      <View style={styles.formArea}>
        <View style={styles.form}>
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
        </View>

        <View style={styles.form}>
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
        </View>

        <View style={styles.form}>
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
                  defaultValue={memo}
                  onChangeText={(value) => {
                    onChange(value);
                  }}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.form}>
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
              <DateTimePickerModal isVisible={dateVisible} locale='ja-JP' mode='date' onConfirm={handleConfirm} onCancel={toggleDate} />
            </View>
          </View>
        </View>
        <View style={styles.form}>
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
        </View>
        <View style={styles.form}>
          <View style={styles.formLabel}>
            <Text>タイプ</Text>
          </View>
          <View style={{ borderBottomWidth: 0.5, borderColor: 'black', width: '50%', marginLeft: 10 }}>
            <Button type='clear' titleStyle={{ color: 'black' }} title={selectedType[type]} onPress={() => setIsVisible(true)} />
          </View>
        </View>
        <View style={styles.button}>
          {isCreate ? (
            <Button title='登録' titleStyle={{ fontWeight: 'bold' }} loading={buttonLoading} onPress={handleSubmit(onSubmit)} />
          ) : (
            <Button title='更新' titleStyle={{ fontWeight: 'bold' }} loading={buttonLoading} onPress={handleSubmit(onSubmitUpdate)} />
          )}
        </View>
      </View>
      <Dialog isVisible={isVisible} overlayStyle={{ height: 350 }}>
        <View style={styles.selectedDialog}>
          <View style={{ justifyContent: 'center', width: 300 }}>
            <Picker selectedValue={type} onValueChange={(itemValue, itemIndex) => setType(itemValue)}>
              <Picker.Item label='貸す' value={0} />
              <Picker.Item label='借りる' value={1} />
            </Picker>
          </View>
          <Button title='決定' titleStyle={{ fontWeight: 'bold' }} style={styles.buttonDialog} onPress={() => setIsVisible(false)} />
        </View>
      </Dialog>
    </SafeAreaView>
  );
};

export default LoginCheck(Event);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  date: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
  },
  form: {
    width: '90%',
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
  formArea: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  button: {
    marginTop: 40,
    width: '50%',
    marginBottom: 10,
  },
  error: {
    width: '80%',
    marginLeft: 10,
    position: 'relative',
    top: -15,
  },
  selectedDialog: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDialog: {
    width: 200,
    marginTop: 20,
  },
});
