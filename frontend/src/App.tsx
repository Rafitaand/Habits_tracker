import { useState, useEffect } from 'react'

type Habit = {
  id: number
  name: string
  category: string
  description: string | null
  reason: string | null
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/habits')
      .then((response) => response.json())
      .then((data) => setHabits(data))
  }, [])

  function adicionar() {
    fetch('http://localhost:8080/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, description, reason }),
    })
      .then((response) => response.json())
      .then((novoHabito) => {
        setHabits([...habits, novoHabito])
        setName('')
        setCategory('')
        setDescription('')
        setReason('')
      })
  }

  function apagar(id: number) {
    fetch(`http://localhost:8080/habits/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          setHabits(habits.filter((habit) => habit.id !== id))
        }
      })
  }

  return (
    <div>
      <h1>Meus hábitos</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do hábito"
      />
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Categoria"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição (opcional)"
      />
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Motivo (opcional)"
      />
      <button onClick={adicionar}>Adicionar</button>

      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>
            {habit.name} - {habit.category}
            <button onClick={() => apagar(habit.id)}>Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}