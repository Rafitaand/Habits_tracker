import type { Habit, DailyLog } from './types'

const API = 'http://localhost:8080'

type DadosHabito = {
  name: string
  category: string
  description: string
  reason: string
}

export function buscarHabitos(): Promise<Habit[]> {
  return fetch(`${API}/habits`).then((response) => response.json())
}

export function buscarRegistros(): Promise<DailyLog[]> {
  return fetch(`${API}/daily-logs`).then((response) => response.json())
}

export function criarHabito(dados: DadosHabito) {
  return fetch(`${API}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
}

export function atualizarHabito(id: number, dados: DadosHabito) {
  return fetch(`${API}/habits/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
}

export function apagarHabito(id: number) {
  return fetch(`${API}/habits/${id}`, { method: 'DELETE' })
}

export function criarRegistro(habitId: number, data: string) {
  return fetch(`${API}/daily-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true, date: data, habit: { id: habitId } }),
  })
}

export function apagarRegistro(id: number) {
  return fetch(`${API}/daily-logs/${id}`, { method: 'DELETE' })
}