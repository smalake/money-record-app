import { axiosClient } from './axiosClient';

export const authApi = {
  loginMail: (params: object) => axiosClient.post('/login-mail', params),
  loginGoogle: (params: object) => axiosClient.post('/login-google', params),
};
