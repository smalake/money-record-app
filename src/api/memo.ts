import { axiosClient } from './axiosClient';

export const memoApi = {
  register: (params: object) => axiosClient.post('/memo', params),
};
