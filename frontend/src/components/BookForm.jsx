import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './BookForm.css'

const BookForm = () => {
    const API = import.meta.env.VITE_API_URL

    const [books, setBooks] = useState([])
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')          // 
    const [description, setDescription] = useState('')// 
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')

    const fetchBooks = async () => {
        try {
            setLoading(true)
            setErr('')
            const res = await axios.get(`${API}/api/books`)
            const data = Array.isArray(res.data) ? res.data : res.data.books ?? []
            setBooks(data)
        } catch (e) {
            console.error(e)
            setErr('목록을 불러오지 못했습니다.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBooks()
    }, [])

    const onCreate = async () => {
        if (!title.trim() || !author.trim()) {
            alert('제목과 작가는 필수입니다.')
            return
        }
        try {
            setLoading(true)
            setErr('')
            await axios.post(`${API}/api/books`, {
                title: title.trim(),
                author: author.trim(),         
                description: description.trim() 
            })
            setTitle('')
            setAuthor('')
            setDescription('')
            await fetchBooks()
        } catch (e) {
            console.error('POST /api/books', e.response?.status, e.response?.data)
            alert('등록 실패')
        } finally {
            setLoading(false)
        }
    }

    const onUpdate = async (book) => {
        const id = book._id ?? book.id
        const nextTitle = prompt('새 제목', book.title ?? '')
        if (nextTitle == null) return
        const nextAuthor = prompt('새 작가', book.author ?? '')         // ✅ 추가
        if (nextAuthor == null) return
        const nextDesc = prompt('새 설명', book.description ?? '')      // ✅ description 사용
        if (nextDesc == null) return

        try {
            setLoading(true)
            setErr('')
            await axios.put(`${API}/api/books/${id}`, {
                title: nextTitle.trim(),
                author: nextAuthor.trim(),
                description: nextDesc.trim()
            })
            await fetchBooks()
        } catch (e) {
            console.error('PUT /api/books/:id', e.response?.status, e.response?.data)
            alert('수정 실패')
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async (id) => {
        if (!confirm('정말 삭제할까요?')) return
        try {
            setLoading(true)
            setErr('')
            await axios.delete(`${API}/api/books/${id}`)
            await fetchBooks()
        } catch (e) {
            console.error('DELETE /api/books/:id', e.response?.status, e.response?.data)
            alert('삭제 실패')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="wrap">
            <h2>Books</h2>

            <div className="controls">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="제목 (필수)"
                />
                <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    type="text"
                    placeholder="작가 (필수)"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="설명"
                    rows={3}
                />
                <div className="post-buttons">
                    <button className="btn" onClick={onCreate} disabled={loading}>
                        {loading ? '처리 중…' : '등록'}
                    </button>
                    <button className="btn refresh" onClick={fetchBooks} disabled={loading}>
                        새로고침
                    </button>
                </div>
            </div>

            {loading && <p>불러오는 중…</p>}
            {err && <p style={{ color: 'crimson' }}>{err}</p>}

            <ul className="list">
                {books.map((book) => (
                    <li key={book._id || book.id}>
                        <h4>{book.title}</h4>
                        <p><b>작가:</b> {book.author}</p>            
                        <p>{book.description}</p>                   
                        <button className="update btn" onClick={() => onUpdate(book)} disabled={loading}>
                            수정
                        </button>
                        <button
                            className="delete btn"
                            onClick={() => onDelete(book._id || book.id)}
                            disabled={loading}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BookForm