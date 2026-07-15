// src/services/posts.js
import axios from 'axios'

const API = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '')

export const fetchPosts = async ({ page = 0, size = 5, q = '' } = {}) => {
  const params = { page, size }
  if (q) params.q = q
  const res = await axios.get(`${API}/posts`, { params })
  return res.data
}

export const fetchPost = async (id) => {
  const res = await axios.get(`${API}/posts/${id}`)
  return res.data
}

export const createPost = async ({ title, content, category, password }) => {
  const res = await axios.post(`${API}/posts`, { title, content, category, password })
  return res.data
}

export const updatePost = async (id, { title, content, category, password }) => {
  const res = await axios.put(`${API}/posts/${id}`, { title, content, category, password })
  return res.data
}

export const deletePost = async (id, password) => {
  const res = await axios.delete(`${API}/posts/${id}`, { data: { password } })
  return res.data
}