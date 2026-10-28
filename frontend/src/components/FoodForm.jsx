import { useState } from 'react'

const emptyInputs = { name: '', price: '', isBestSeller: 'true' }

function FoodForm({ addItem }) {
  const [inputs, setInputs] = useState(emptyInputs)

  function handleChange(e) {
    const { name, value } = e.target
    setInputs((values) => ({ ...values, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await addItem({
      name: inputs.name,
      price: Number(inputs.price),
      isBestSeller: inputs.isBestSeller === 'true',
    })
    setInputs(emptyInputs)
  }

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <h2>New Food</h2>
      <label>
        name : <input type="text" name="name" value={inputs.name} onChange={handleChange} />
      </label>
      <label>
        price : <input type="number" name="price" value={inputs.price} onChange={handleChange} />
      </label>
      <label>
        Best Seller :{' '}
        <select name="isBestSeller" value={inputs.isBestSeller} onChange={handleChange}>
          <option value="true">BestSeller</option>
          <option value="false">Normal</option>
        </select>
      </label>
      <button disabled={inputs.name.trim() === '' || inputs.price === ''}>Add menu</button>
    </form>
  )
}

export default FoodForm
