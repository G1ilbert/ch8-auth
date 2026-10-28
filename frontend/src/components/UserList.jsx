import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL, authHeader } from '../services/api'

// admin: ดู user ทั้งหมด และเปลี่ยน role
function UserList() {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`, authHeader())
      setUsers(response.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const changeRole = async (userId, role) => {
    try {
      await axios.put(`${API_URL}/api/users/${userId}/role`, { role }, authHeader())
      fetchUsers()
    } catch (err) {
      alert(err.response.data.message)
    }
  }

  return (
    <>
      <h1>User</h1>
      <ul>
        {users.map((u) => (
          <li key={u.userId}>
            {u.userName} {u.email}{' '}
            <select value={u.role} onChange={(e) => changeRole(u.userId, e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </li>
        ))}
      </ul>
    </>
  )
}

export default UserList
