import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { LoginCheck } from './LoginCheck';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { homeValidation } from '../util/Validation';
import { Button, Dialog, Icon, Input } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type FormData = {
  amount: string;
  partner: string;
  date?: Date;
  period?: string;
  memo?: string;
};
const Home: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false); // ログインボタンのローディング表示
  const [date, setDate] = useState(new Date());
  const [dateVasible, setDateVisible] = useState(false);
  const [period, setPeriod] = useState(new Date());
  const [periodVisible, setPeriodVisible] = useState(false);
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
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text>Home</Text>
      <View>
        <Button title='Open Simple Dialog' onPress={toggleDialog} buttonStyle={styles.button} />
      </View>
      <Dialog isVisible={visible} overlayStyle={{ paddingTop: 50 }}>
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
            rules={{ required: true }}
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
      </Dialog>
    </SafeAreaView>
  );
};

export default LoginCheck(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 20,
  },
  error: {
    width: '80%',
    marginLeft: 10,
    position: 'relative',
    top: -15,
  },
});
