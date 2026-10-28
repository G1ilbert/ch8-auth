import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL, authHeader } from '../services/api'
import Header from '../components/Header'
import MenuList from '../components/MenuList'
import FoodForm from '../components/FoodForm'
import UserList from '../components/UserList'

function Home() {
  const [user, setUser] = useState(null) // null = guest
  const [menus, setMenus] = useState([])
  const [view, setView] = useState('menu') // admin สลับ 'menu' / 'user'
  const navigate = useNavigate()

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/menu`)
      setMenus(response.data)
    } catch (err) {
      console.error('Error fetching menu:', err)
    }
  }

  // มี token → ถาม backend ว่าเป็นใคร (token ผิด/หมดอายุ → เป็น guest)
  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem('token')) return
      try {
        const response = await axios.get(`${API_URL}/authen/home`, authHeader())
        setUser(response.data.user[0])
      } catch {
        localStorage.removeItem('token')
      }
    }
    fetchData()
  }, [])

  // Real-time: ดึงเมนูใหม่ทุก 5 วินาที
  useEffect(() => {
    fetchMenus()
    const intervalId = setInterval(fetchMenus, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const rateMenu = async (menuId, score) => {
    try {
      await axios.post(`${API_URL}/api/menu/${menuId}/rating`, { score }, authHeader())
      fetchMenus()
    } catch (err) {
      alert(err.response.data.message)
    }
  }

  const addMenu = async (item) => {
    try {
      await axios.post(`${API_URL}/api/menu`, item, authHeader())
      fetchMenus()
    } catch (err) {
      alert(err.response.data.message)
    }
  }

  const deleteMenu = async (menuId) => {
    try {
      await axios.delete(`${API_URL}/api/menu/${menuId}`, authHeader())
      fetchMenus()
    } catch (err) {
      alert(err.response.data.message)
    }
  }

  const mode = user ? user.role : 'guest' // guest / user / admin

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <div className="content">
        {mode === 'admin' && (
          <div className="view-switch">
            <button onClick={() => setView(view === 'menu' ? 'user' : 'menu')}>
              {view === 'menu' ? 'user' : 'menu'}
            </button>
          </div>
        )}

        {mode === 'admin' && view === 'user' ? (
          <UserList />
        ) : (
          <>
            <h1>Our menu</h1>
            <MenuList menus={menus} mode={mode} onRate={rateMenu} onDelete={deleteMenu} />
            {mode === 'admin' && <FoodForm addItem={addMenu} />}
          </>
        )}
      </div>
    </>
  )
}

export default Home
