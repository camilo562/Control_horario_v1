import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function formatDate(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function App() {
  const [empleado, setEmpleado] = useState('')
  const [tipo, setTipo] = useState('entrada')
  const [registros, setRegistros] = useState([])
  const [apiOnline, setApiOnline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    fetch(`${API_URL}/api/health`)
      .then((response) => {
        if (!ignore) setApiOnline(response.ok)
      })
      .catch(() => {
        if (!ignore) setApiOnline(false)
      })

    fetch(`${API_URL}/api/registros`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudieron cargar los registros.')
        }

        return response.json()
      })
      .then((data) => {
        if (!ignore) {
          setRegistros(data)
          setMessage('')
        }
      })
      .catch(() => {
        if (!ignore) {
          setRegistros([])
          setMessage('Base de datos pendiente por conectar.')
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!empleado.trim()) {
      setMessage('Escribe el nombre del empleado.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/api/registros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empleado, tipo }),
      })

      if (!response.ok) {
        throw new Error('No se pudo guardar el registro.')
      }

      const nuevoRegistro = await response.json()
      setRegistros((current) => [nuevoRegistro, ...current].slice(0, 20))
      setEmpleado('')
      setMessage('Registro guardado.')
    } catch {
      setMessage('No se pudo guardar. Revisa MySQL y el backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="summary-panel">
        <div>
          <p className="eyebrow">Control horario</p>
          <h1>Registro de entradas y salidas</h1>
        </div>

        <div className="status-grid" aria-label="Estado del sistema">
          <div>
            <span>API</span>
            <strong className={apiOnline ? 'online' : 'offline'}>
              {apiOnline ? 'Activa' : 'Inactiva'}
            </strong>
          </div>
          <div>
            <span>Registros</span>
            <strong>{registros.length}</strong>
          </div>
        </div>
      </section>

      <section className="workspace">
        <form className="record-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="empleado">Empleado</label>
            <input
              id="empleado"
              name="empleado"
              type="text"
              value={empleado}
              onChange={(event) => setEmpleado(event.target.value)}
              placeholder="Nombre completo"
            />
          </div>

          <div className="field">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Registrar'}
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>

        <section className="records-panel" aria-labelledby="records-title">
          <div className="section-heading">
            <p className="eyebrow">Actividad</p>
            <h2 id="records-title">Ultimos registros</h2>
          </div>

          <div className="records-list">
            {registros.length === 0 ? (
              <p className="empty-state">Sin registros por mostrar.</p>
            ) : (
              registros.map((registro) => (
                <article className="record-card" key={registro.id}>
                  <div>
                    <h3>{registro.empleado}</h3>
                    <p>{formatDate(registro.fechaHora)}</p>
                  </div>
                  <span className={`badge ${registro.tipo}`}>
                    {registro.tipo}
                  </span>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
