import api from './api';

export const getUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const createConversation = async (userId: number) => {
  const res = await api.post('/conversations', {
    userId,
  });

  return res.data;
};