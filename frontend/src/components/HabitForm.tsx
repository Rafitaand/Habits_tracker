type Props = {
  name: string
  category: string
  description: string
  reason: string
  editingId: number | null
  onNameChange: (valor: string) => void
  onCategoryChange: (valor: string) => void
  onDescriptionChange: (valor: string) => void
  onReasonChange: (valor: string) => void
  onAdicionar: () => void
  onSalvar: () => void
  onCancelar: () => void
}

export default function HabitForm({
  name,
  category,
  description,
  reason,
  editingId,
  onNameChange,
  onCategoryChange,
  onDescriptionChange,
  onReasonChange,
  onAdicionar,
  onSalvar,
  onCancelar,
}: Props) {
  return (
    <div>
      {editingId !== null && <p>Editando o hábito número {editingId}</p>}

      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Nome do hábito"
      />
      <input
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        placeholder="Categoria"
      />
      <input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Descrição (opcional)"
      />
      <input
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="Motivo (opcional)"
      />

      {editingId === null ? (
        <button onClick={onAdicionar}>Adicionar</button>
      ) : (
        <button onClick={onSalvar}>Salvar</button>
      )}

      {editingId !== null && <button onClick={onCancelar}>Cancelar</button>}
    </div>
  )
}