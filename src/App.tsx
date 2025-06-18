import { useEffect, useState } from 'react'
import './App.css'
import { useDatabaseContext } from './contexts/DatabaseContext'
import dayjs from 'dayjs';
import { MdAddCircleOutline, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import SectionContainer from './components/SectionContainer';
import { FaPencil } from 'react-icons/fa6';

function App() {

  const data = useDatabaseContext()

  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today)

  const [reports, setReports] = useState({
    date: "",
    expenses: [],
    haircuts: []
  })

  useEffect(() => {
    if (data.daily_reports) {
      const filteredReport = data.daily_reports.find(report =>
        dayjs(report.date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
      );

      setReports(filteredReport || {
        date: selectedDate.format('YYYY-MM-DD'),
        expenses: [],
        haircuts: []
      });
    }

  }, [selectedDate, data.daily_reports])

  console.log(reports)


  return (
    <>
      <header className='fixed flex flex-col w-full bg-slate-900 text-rose-900'>

        <section className='flex flex-col py-2 px-4 font-croissant'>

          <div className='flex flex-row justify-between'>
            <button className='text-base'>{selectedDate.format("YYYY")}</button>

            <div className='w-[40px] h-[40px] bg-center bg-cover rounded-full' style={{ backgroundImage: "url('/rhuan.jpg')" }}>
            </div>
          </div>

          <nav className='flex flex-row items-center justify-around text-2xl'>
            <span>
              <MdNavigateBefore />
            </span>
            <button className='text-lg font-bold'>Junho</button>
            <span>
              <MdNavigateNext />
            </span>
          </nav>

        </section>

        <ul className='bg-slate-800 flex flex-row py-2 gap-4 px-4 font-croissant'>
          <li className='text-rose-200 bg-slate-700 py-1 px-2 rounded-sm'>17</li>
        </ul>

      </header>

      <main className='py-36 px-2 bg-slate-50 text-rose-900 flex flex-col gap-4'>

        <section className='flex flex-col justify-center items-center'>
          <h1 className='text-lg font-bold'>{selectedDate.format("DD/MM/YYYY")}</h1>
          <p className='text-base text-rose-800'>Total do dia: <span className='font-bold'>+R$11,00</span></p>
        </section>

        <SectionContainer>

          <div className='flex flex-row justify-between items-center text-rose-700 text-xl'>
            <h2 className='font-bold text-lg'>Cortes</h2>
            <FaPencil />
          </div>

          <ul className='flex flex-col gap-2'>

            {
              data.haircuts.map((haircut, key) => (

                <li className='flex flex-row items-center justify-between text-rose-100 text-xl'>
                  <span className='font-extralight text-base'>
                    {haircut.name} (R${haircut.price})
                  </span>

                  <MdAddCircleOutline />

                </li>

              ))
            }

          </ul>


        </SectionContainer>


        <SectionContainer>

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

        </SectionContainer>

        <p>Lucros Totais: +R$75,00</p>

        <SectionContainer>

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

        </SectionContainer>

        <SectionContainer>

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

        </SectionContainer>

        <p>Gastos Totais: -R$64,00</p>

      </main>


    </>
  )
}

export default App
