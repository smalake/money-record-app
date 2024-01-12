import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
const getToken = async () => (await AsyncStorage.getItem('accessToken')) ?? '';

// APIを叩く前に前処理を行う
axiosClient.interceptors.request.use(async (config: any) => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${getToken()}`, //リクエストヘッダーにJWTを付けてサーバに渡す
    },
  };
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return err.response;
  }
);
