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
    <li className="habito">
      <input type="checkbox" checked={feito} onChange={onAlternar} />
      <div className="info">
        <div className="titulo">
          <span className="nome">{habit.name}</span>
          <span className="categoria">{habit.category}</span>
        </div>
        {habit.description && <p className="detalhe">{habit.description}</p>}
        {habit.reason && <p className="detalhe">Motivo: {habit.reason}</p>}
      </div>
      <div className="acoes">
        <button onClick={onEditar}>Editar</button>
        <button className="perigo" onClick={onApagar}>Apagar</button>
      </div>
    </li>
  )
 } 