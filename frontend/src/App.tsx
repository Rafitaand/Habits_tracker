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
  const [editingId, setEditingId] = useState<number | null>(null)
  const [erro, setErro] = useState('')

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
    setErro('')
    fetch(`http://localhost:8080/habits/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          setHabits(habits.filter((habit) => habit.id !== id))
          return
        }
        if (response.status === 409) {
          response.text().then((mensagem) => setErro(mensagem))
        } else {
          setErro('Não foi possível apagar o hábito. Tente novamente.')
        }
      })
  }

  function editar(habit: Habit) {
    setEditingId(habit.id)
    setName(habit.name)
    setCategory(habit.category)
    setDescription(habit.description ?? '')
    setReason(habit.reason ?? '')
  }

  function salvarEdicao() {
    fetch(`http://localhost:8080/habits/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, description, reason }),
    })
      .then((response) => response.json())
      .then((habitAtualizado) => {
        setHabits(
          habits.map((habit) =>
            habit.id === habitAtualizado.id ? habitAtualizado : habit
          )
        )
        setEditingId(null)
        setName('')
        setCategory('')
        setDescription('')
        setReason('')
      })
  }

  function cancelarEdicao() {
    setEditingId(null)
    setName('')
    setCategory('')
    setDescription('')
    setReason('')
  }

  return (
    <div>
      <h1>Meus hábitos</h1>

      {editingId !== null && <p>Editando o hábito número {editingId}</p>}

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

      {editingId === null ? (
        <button onClick={adicionar}>Adicionar</button>
      ) : (
        <button onClick={salvarEdicao}>Salvar</button>
      )}

      {editingId !== null && <button onClick={cancelarEdicao}>Cancelar</button>}

      {erro && <p>{erro}</p>}

      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>
            {habit.name} - {habit.category}
            <button onClick={() => editar(habit)}>Editar</button>
            <button onClick={() => apagar(habit.id)}>Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}