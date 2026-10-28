// mode: 'guest' ดูอย่างเดียว · 'user' ให้คะแนนได้ · 'admin' ลบได้
function MenuList({ menus, mode, onRate, onDelete }) {
  return (
    <ul>
      {menus.map((item) => (
        <li key={item.menuId}>
          {item.name} (⭐{item.avgRating} )- {item.price} baht {item.isBestSeller && '🏅'}

          {mode === 'user' && (
            <span className="rating">
              Choose rating:{' '}
              <select defaultValue="" onChange={(e) => onRate(item.menuId, e.target.value)}>
                <option value="" disabled>-</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </span>
          )}

          {mode === 'admin' && <button onClick={() => onDelete(item.menuId)}>Del</button>}
        </li>
      ))}
    </ul>
  )
}

export default MenuList
