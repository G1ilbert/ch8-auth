import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../services/api'
import './auth.css'

const emptyInputs = { userName: '', email: '', password: '', cpassword: '' }

function Register() {
  const [inputs, setInputs] = useState(emptyInputs)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (inputs.password != inputs.cpassword) {
      alert('Password mismatch')
      return
    }
    try {
      const response = await axios.post(`${API_URL}/authen/register`, inputs)
      if (response.status === 201) {
        alert(response.data.message)
        navigate('/login')
      }
    } catch (err) {
      // 409 = username หรือ email ซ้ำ, 400 = กรอกไม่ครบ
      alert(err.response ? err.response.data.message : 'Cannot connect to server')
    }
    setInputs(emptyInputs)
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <div className="auth-body">
          <input type="text" name="userName" placeholder="Username" value={inputs.userName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />
          <input type="password" name="cpassword" placeholder="Confirm Password" value={inputs.cpassword} onChange={handleChange} required />
          <button type="submit">Sign Up</button>
          <div className="auth-link">
            Have an Account ? <Link to="/login">Login Here</Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register
