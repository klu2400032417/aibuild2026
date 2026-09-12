import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8080/api/inventory';

export const getInventory = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getInventoryById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const createInventory = async (data) => {
  const res = await axios.post(API_BASE, data);
  return res.data;
};

export const updateInventory = async (id, data) => {
  const res = await axios.put(`${API_BASE}/${id}`, data);
  return res.data;
};

export const deleteInventory = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};
