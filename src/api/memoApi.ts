import { axiosClient } from './axiosClient';

export const memoApi = {
  register: (params: object) => axiosClient.post('/api/v1/memo', params),
  getAll: () => axiosClient.get('/api/v1/memo'),
  getOne: (id: Number) => axiosClient.get(`/api/v1/memo/${id}`),
  update: (params: object) => axiosClient.put(`/api/v1/memo`, params),
};
