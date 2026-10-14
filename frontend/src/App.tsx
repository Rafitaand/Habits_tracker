import { useState, useEffect } from 'react'
import { hoje, formatarData } from './datas'
import { buscarHabitos, buscarRegistros, criarHabito, atualizarHabito, apagarHabito, criarRegistro, apagarRegistro } from './api'
import HabitForm from './components/HabitForm'
import HabitItem from './components/HabitItem'
import type { Habit, DailyLog } from './types'

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
    buscarHabitos().then((data) => setHabits(data))
    buscarRegistros().then((data) => setDailyLogs(data))
  }, [])

  function limparFormulario() {
    setName('')
    setCategory('')
    setDescription('')
    setReason('')
  }

  function adicionar() {
    criarHabito({ name, category, description, reason })
      .then((response) => response.json())
      .then((novoHabito) => {
        setHabits([...habits, novoHabito])
        limparFormulario()
      })
  }

  function apagar(id: number) {
    if (!window.confirm('Apagar este hábito e todos os registros dele?')) return
    setErro('')
    apagarHabito(id).then((response) => {
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
    if (editingId === null) return
    atualizarHabito(editingId, { name, category, description, reason })
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
    criarRegistro(habitId, hoje()).then((response) => {
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
    apagarRegistro(registro.id).then((response) => {
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

      <HabitForm
        name={name}
        category={category}
        description={description}
        reason={reason}
        editingId={editingId}
        onNameChange={setName}
        onCategoryChange={setCategory}
        onDescriptionChange={setDescription}
        onReasonChange={setReason}
        onAdicionar={adicionar}
        onSalvar={salvarEdicao}
        onCancelar={cancelarEdicao}
      />

      {erro && <p>{erro}</p>}

      <ul>
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            feito={registroDeHoje(habit.id) !== undefined}
            onAlternar={() => alternarHoje(habit.id)}
            onEditar={() => editar(habit)}
            onApagar={() => apagar(habit.id)}
          />
        ))}
      </ul>
    </div>
  )
}