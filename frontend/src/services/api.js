export const API_URL = 'http://localhost:3000'

// header สำหรับ request ที่ต้อง login: Authorization: Bearer <token>
export const authHeader = () => ({
  headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
})
