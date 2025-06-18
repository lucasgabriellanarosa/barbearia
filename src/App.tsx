import { useState } from 'react'
import './App.css'
import { useDatabaseContext } from './contexts/DatabaseContext'
import dayjs from 'dayjs';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

function App() {

  const data = useDatabaseContext()

  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today)


  return (
    <>
      <header className='fixed flex flex-col w-full bg-slate-900 text-rose-900'>

        <section className='flex flex-col py-2 px-4 font-croissant'>

          <div className='flex flex-row justify-between'>
            <button className='text-base'>{selectedDate.format("YYYY")}</button>

            <div className='w-[40px] h-[40px] bg-center bg-cover rounded-full' style={{backgroundImage: "url('/rhuan.jpg')"}}>
            </div>
          </div>

          <nav className='flex flex-row items-center justify-around text-2xl'>
            <span>
              <MdNavigateBefore />
            </span>
            <button className='text-lg'>Junho</button>
            <span>
              <MdNavigateNext />
            </span>
          </nav>

        </section>

        <ul className='bg-slate-800 flex flex-row py-2 gap-4 px-4 font-croissant'>
          <li className='text-rose-200 bg-slate-700 py-1 px-2 rounded-sm'>17</li>
        </ul>

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
