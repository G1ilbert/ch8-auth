import { useNavigate } from 'react-router-dom'

function Header({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="header">
      {user ? (
        <>
          <span>{user.userName}</span>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </div>
  )
}

export default Header
