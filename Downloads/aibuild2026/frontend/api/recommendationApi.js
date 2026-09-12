import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8080/api/recommendations';

export const generateRecommendation = async (data) => {
  const res = await axios.post(API_BASE, data);
  return res.data;
};

export const getRecentRecommendations = async (productId) => {
  const res = await axios.get(`${API_BASE}/product/${productId}`);
  return res.data;
};

export const approveRecommendation = async (id) => {
  const res = await axios.post(`${API_BASE}/${id}/approve`);
  return res.data;
};
