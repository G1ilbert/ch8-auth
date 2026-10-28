import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../services/api'
import './auth.css'

function Login() {
  const [inputs, setInputs] = useState({ userName: '', password: '' })
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/authen/login`, inputs)
      if (response.status === 200) {
        alert(response.data.message)
        localStorage.setItem('token', response.data.token)
        navigate('/')
      }
    } catch (err) {
      // 404 = ไม่พบ username หรือรหัสผ่านผิด
      alert(err.response ? err.response.data.message : 'Cannot connect to server')
    }
    setInputs({ userName: '', password: '' })
  }

  return (
    <div className="auth-page">
      <form className="auth-card small" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="auth-body">
          <input type="text" name="userName" placeholder="Username" value={inputs.userName} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />
          <button type="submit">ส่ง</button>
          <div className="auth-link">
            No Account ? <Link to="/register">Register Here</Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
