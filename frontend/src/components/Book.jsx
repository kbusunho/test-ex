import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Book.css'

const Book = () => {
  const API = import.meta.env.VITE_API_URL

  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  // 책 목록 불러오기
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/api/books`)
      const data = Array.isArray(res.data) ? res.data : res.data.books ?? []
      setBooks(data)
    } catch (error) {
      console.log(error, "불러오기 실패")
      setErr("책 목록을 불러오는 데 실패했습니다.")
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // 책 등록
  const onCreate = async () => {
    if (!title.trim() || !author.trim()) return alert("제목과 작가는 필수입니다.")
    try {
      setLoading(true)
      await axios.post(`${API}/api/books`, { title, author, description })
      setTitle('')
      setAuthor('')
      setDescription('')
      await fetchBooks()
    } catch (error) {
      alert("등록 실패")
    } finally {
      setLoading(false)
    }
  }

  // 책 수정
  const onUpdate = async (book) => {
    const id = book._id ?? book.id
    const nextTitle = prompt('새 제목', book.title ?? '')
    if (nextTitle == null) return
    const nextAuthor = prompt('새 작가', book.author ?? '')
    if (nextAuthor == null) return
    const nextDescription = prompt('새 설명', book.description ?? '')
    if (nextDescription == null) return

    try {
      setLoading(true)
      await axios.put(`${API}/api/books/${id}`, {
        title: nextTitle.trim(),
        author: nextAuthor.trim(),
        description: nextDescription.trim()
      })
      await fetchBooks()
    } catch (error) {
      alert('수정 실패')
    } finally {
      setLoading(false)
    }
  }

  // 책 삭제
  const onDelete = async (id) => {
    if (!confirm('정말 삭제할까요?')) return

    try {
      setLoading(true)
      await axios.delete(`${API}/api/books/${id}`)
      await fetchBooks()
    } catch (error) {
      alert('삭제 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='book-wrap'>
      <h2>Books</h2>
      <div className="book-controls">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder='도서명 (필수)'
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          type="text"
          placeholder='작가명 (필수)'
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='간단한 설명을 입력하세요'
          rows={3}
        ></textarea>
        <div className="book-buttons">
          <button className="btn" onClick={onCreate} disabled={loading}>등록</button>
          <button className="btn" onClick={fetchBooks} disabled={loading}>새로고침</button>
        </div>
      </div>

      {loading && <p>불러오는중....</p>}
      {err && <p>{err}</p>}

      <ul className='book-list'>
        {books.map((book) => (
          <li key={book._id}>
            <h4>{book.title}</h4>
            <p><b>작가:</b> {book.author}</p>
            <p>{book.description.trim() ? book.description : "설명 없음"}</p>
            <button className="update btn" onClick={() => onUpdate(book)}>수정</button>
            <button className="delete btn" onClick={() => onDelete(book._id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Book
