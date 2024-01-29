import { axiosClient } from './axiosClient';

export const authApi = {
  loginMail: (params: object) => axiosClient.post('/login-mail', params),
  loginGoogle: (params: object) => axiosClient.post('/login-google', params),
  register: (params: object) => axiosClient.post('/register', params),
  verifyEmail: (params: object) => axiosClient.post('/auth-code', params),
  logout: () => axiosClient.post('/api/v1/logout'),
};
