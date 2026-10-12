import type { Habit } from '../types'

type Props = {
  habit: Habit
  feito: boolean
  onAlternar: () => void
  onEditar: () => void
  onApagar: () => void
}

export default function HabitItem({ habit, feito, onAlternar, onEditar, onApagar }: Props) {
  return (
    <li>
      <input type="checkbox" checked={feito} onChange={onAlternar} />
      {habit.name} - {habit.category}
      <button onClick={onEditar}>Editar</button>
      <button onClick={onApagar}>Apagar</button>
    </li>
  )
}