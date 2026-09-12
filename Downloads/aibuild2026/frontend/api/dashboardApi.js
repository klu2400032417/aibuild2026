import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8080/api/dashboard';

export const getDashboardData = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};
