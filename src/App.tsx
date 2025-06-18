import { useState } from 'react'
import './App.css'
import { useDatabaseContext } from './contexts/DatabaseContext'

function App() {

  const data = useDatabaseContext()

  const [selectedDate, setSelectedDate] = useState()

  return (
    <>
      <header>

        <section>
          <div>
            <button>2025</button>
            <img src="#" />
          </div>
          <nav>
            <span>-</span>
            <button>Junho</button>
            <span>+</span>
          </nav>
        </section>

        <nav>
          <ul>
            <li>17</li>
            <li>18</li>
            <li>19</li>
          </ul>
        </nav>

      </header>

      <main>

        <section>
          <h1>17 de Junho de 2025</h1>
          <p>Total do dia: +R$11,00</p>
        </section>

        <section>

          <div>
            <h2>Cortes</h2>
            <span>+</span>
          </div>

          <ul>
            <li>
              <span>
                Corte 1 (R$30,00)
              </span>
              <span>+</span>
            </li>
          </ul>

        </section>

        <section>

          <div>
            <h2>Cortes do dia</h2>
            <span>+</span>
          </div>

          <ul>
            <li>
              <span>+</span>
              Corte 1 - R$30,00
            </li>
          </ul>

        </section>

        <p>Lucros Totais: +R$75,00</p>

        <section>

          <div>
            <h2>Gastos</h2>
            <span>+</span>
          </div>

          <form>

            <div>
              <label>Gasto</label>
              <input />
            </div>

            <div>
              <label>Valor em R$</label>
              <input />
            </div>

            <div>
              <label>Categoria</label>
              <select>
                <option value="comida">comida</option>
              </select>
            </div>

            <button>
              + Salvar Gasto
            </button>

          </form>

        </section>

        <section>

          <div>
            <h2>Gastos do dia</h2>
            <span>+</span>
          </div>

          <ul>
            <li>
              <span>+</span>
              Energético - R$4,00
            </li>
          </ul>

        </section>

        <p>Gastos Totais: -R$64,00</p>

      </main>


    </>
  )
}

export default App
