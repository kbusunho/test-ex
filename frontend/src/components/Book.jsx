import React, { useState } from 'react'
import axios from 'axios'

const PostForm = () => {
  const API = import.meta.env.VITE_API_URL

  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/api/posts`)
      const data = Array.isArray(res.data) ? res.data : res.data.posts ?? []
      setPosts(data)
    } catch (error) {
      console.log(error, '불러오기 실패')
    }
  }
}

export default PostForm
