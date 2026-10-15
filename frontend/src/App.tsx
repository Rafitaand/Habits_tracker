import { useState, useEffect } from 'react'
import { hoje, formatarData } from './datas'
import { buscarHabitos, buscarRegistros, criarHabito, atualizarHabito, apagarHabito, criarRegistro, apagarRegistro } from './api'
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
  const [dataSelecionada, setDataSelecionada] = useState(hoje())

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

  function formularioValido() {
    if (name.trim() === '' || category.trim() === '') {
      setErro('Preencha o nome e a categoria do hábito.')
      return false
    }
    setErro('')
    return true
  }

  function adicionar() {
    if (!formularioValido()) return
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
    if (!formularioValido()) return
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

  function registroDoDia(habitId: number) {
    return dailyLogs.find(
      (log) => log.habit.id === habitId && log.date === dataSelecionada
    )
  }

  function marcarDia(habitId: number) {
    setErro('')
    criarRegistro(habitId, dataSelecionada).then((response) => {
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

  function desmarcarDia(registro: DailyLog) {
    setErro('')
    apagarRegistro(registro.id).then((response) => {
      if (response.ok) {
        setDailyLogs(dailyLogs.filter((log) => log.id !== registro.id))
      } else {
        setErro('Não foi possível desmarcar. Tente novamente.')
      }
    })
  }

  function alternarDia(habitId: number) {
    const registro = registroDoDia(habitId)
    if (registro) {
      desmarcarDia(registro)
    } else {
      marcarDia(habitId)
    }
  }

  return (
    <div className="app">
      <h1>Habit Tracker</h1>
      <p className="subtitulo"> Cadastre seus hábitos <br/>
      Mantenha sua rotinha organizada.
      </p>
      
      <p className="data">{formatarData(dataSelecionada)}</p>

      <label className="dia">
        Dia:
        <input
          type="date"
          value={dataSelecionada}
          max={hoje()}
          onChange={(e) => {
            if (e.target.value && e.target.value <= hoje()) {
              setDataSelecionada(e.target.value)
            }
          }}
        />
      </label>


      <div className="formulario">
        {editingId !== null && (
          <p className="editando">Editando o hábito número {editingId}</p>
        )}

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

        <div className="botoes">
          {editingId === null ? (
            <button className="primario" onClick={adicionar}>Adicionar</button>
          ) : (
            <button className="primario" onClick={salvarEdicao}>Salvar</button>
          )}

          {editingId !== null && <button onClick={cancelarEdicao}>Cancelar</button>}
        </div>
      </div>

      {erro && <p className="erro">{erro}</p>}

      <ul className="lista">
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            feito={registroDoDia(habit.id) !== undefined}
            onAlternar={() => alternarDia(habit.id)}
            onEditar={() => editar(habit)}
            onApagar={() => apagar(habit.id)}
          />
        ))}
      </ul>
    </div>
  )
}