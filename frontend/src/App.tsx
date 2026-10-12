import { useState, useEffect } from 'react'

const API = 'http://localhost:8080'

type Habit = {
  id: number
  name: string
  category: string
  description: string | null
  reason: string | null
}

type DailyLog = {
  id: number
  completed: boolean
  date: string
  habit: { id: number }
}

function hoje() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [reason, setReason] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])

  useEffect(() => {
    fetch(`${API}/habits`)
      .then((response) => response.json())
      .then((data) => setHabits(data))

    fetch(`${API}/daily-logs`)
      .then((response) => response.json())
      .then((data) => setDailyLogs(data))
  }, [])

  function limparFormulario() {
    setName('')
    setCategory('')
    setDescription('')
    setReason('')
  }

  function adicionar() {
    fetch(`${API}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, description, reason }),
    })
      .then((response) => response.json())
      .then((novoHabito) => {
        setHabits([...habits, novoHabito])
        limparFormulario()
      })
  }

  function apagar(id: number) {
    setErro('')
    fetch(`${API}/habits/${id}`, { method: 'DELETE' })
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
    fetch(`${API}/habits/${editingId}`, {
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
        limparFormulario()
      })
  }

  function cancelarEdicao() {
    setEditingId(null)
    limparFormulario()
  }

  function registroDeHoje(habitId: number) {
    return dailyLogs.find(
      (log) => log.habit.id === habitId && log.date === hoje()
    )
  }

  function marcarHoje(habitId: number) {
    setErro('')
    fetch(`${API}/daily-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true, date: hoje(), habit: { id: habitId } }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((novoLog) => setDailyLogs([...dailyLogs, novoLog]))
          return
        }
        if (response.status === 409) {
          response.text().then((mensagem) => setErro(mensagem))
        } else {
          setErro('Não foi possível registrar. Tente novamente.')
        }
      })
  }

  function desmarcarHoje(registro: DailyLog) {
    setErro('')
    fetch(`${API}/daily-logs/${registro.id}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          setDailyLogs(dailyLogs.filter((log) => log.id !== registro.id))
        } else {
          setErro('Não foi possível desmarcar. Tente novamente.')
        }
      })
  }

  function alternarHoje(habitId: number) {
    const registro = registroDeHoje(habitId)
    if (registro) {
      desmarcarHoje(registro)
    } else {
      marcarHoje(habitId)
    }
  }

  return (
    <div>
      <h1>Meus hábitos</h1>

      <p>{formatarData(hoje())}</p>

      {/* RETIRÁVEL: só servia para conferir se a busca dos registros funcionava
      <p>Registros carregados: {dailyLogs.length}</p>
      */}

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
            <input
              type="checkbox"
              checked={registroDeHoje(habit.id) !== undefined}
              onChange={() => alternarHoje(habit.id)}
            />
            {habit.name} - {habit.category}
            <button onClick={() => editar(habit)}>Editar</button>
            <button onClick={() => apagar(habit.id)}>Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}