import { useEffect, useRef, useState } from 'react'
import './App.css'
import { useDatabaseContext } from './contexts/DatabaseContext'
import dayjs from 'dayjs';
import { MdAddCircleOutline, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import SectionContainer from './components/SectionContainer';
import { FaCaretDown, FaCaretUp, FaPencil, FaTrash } from 'react-icons/fa6';
import type { DailyReport, DatabaseData } from './@types/Database';

function App() {

  // Database
  const data = useDatabaseContext() as DatabaseData

  // Date
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today)
  const carouselRef = useRef<HTMLUListElement>(null);

  const daysInMonth = Array.from(
    { length: selectedDate.daysInMonth() },
    (_, i) => selectedDate.startOf('month').add(i, 'day')
  );

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => prev[direction === 'prev' ? 'subtract' : 'add'](1, 'month'));
  };

  // Daily Reports

  const [reports, setReports] = useState<DailyReport>({
    date: "",
    expenses: [],
    haircuts: []
  })

  useEffect(() => {
    // 1. Atualizar os reports (sua lógica existente)
    if (data.daily_reports) {
      const filteredReport = data.daily_reports.find(report =>
        report.date === selectedDate.format('DD-MM-YYYY')
      );

      setReports(filteredReport || {
        date: selectedDate.format('DD-MM-YYYY'),
        expenses: [],
        haircuts: []
      });
    }

    // 2. Scroll para o dia selecionado (nova lógica)
    if (carouselRef.current) {
      const selectedDayElement = carouselRef.current.querySelector(
        `[data-day="${selectedDate.format('DD-MM-YYYY')}"]`
      );

      selectedDayElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }

  }, [selectedDate, data.daily_reports]);

  // Money Values

  const totalHaircuts = reports.haircuts.reduce((sum, haircut) => {
    return sum + Number(data.haircuts[haircut.id]?.price || 0);
  }, 0);

  const totalExpenses = reports.expenses.reduce((sum, expense) => {
    return sum + Number(data.expenses[expense.id]?.price || 0);
  }, 0);

  const total = totalHaircuts - totalExpenses

  // Open and Close Logic

  const [isHaircutsOpen, setIsHaircutsOpen] = useState(false)
  const [isExpensesOpen, setIsExpensesOpen] = useState(false)

  return (
    <>
      <header className='fixed flex flex-col w-full bg-slate-900 text-rose-900 shadow-xl'>

        <section className='flex flex-col py-2 px-4 font-croissant'>
          <div className='flex flex-row justify-between'>
            <button className='text-base'>{selectedDate.format("YYYY")}</button>
          </div>

          <nav className='flex flex-row items-center justify-around text-2xl'>
            <span onClick={() => navigateMonth('prev')} className="cursor-pointer">
              <MdNavigateBefore />
            </span>
            <button className='text-lg font-bold'>{selectedDate.format("MMMM")}</button>
            <span onClick={() => navigateMonth('next')} className="cursor-pointer">
              <MdNavigateNext />
            </span>
          </nav>
        </section>

        <ul
          ref={carouselRef}
          className='bg-slate-800 flex flex-row py-2 gap-4 px-4 overflow-x-auto font-croissant scrollbar-hide'
        >
          {daysInMonth.map((day) => (
            <li
              key={day.format('DD-MM-YYYY')}
              data-day={day.format('DD-MM-YYYY')}
              className={`py-1 px-2 rounded-sm cursor-pointer min-w-[2.5rem] text-center ${day.isSame(selectedDate, 'day')
                ? 'text-rose-200 bg-rose-900'
                : 'text-rose-200 bg-slate-700 hover:bg-rose-700'
                }`}
              onClick={() => setSelectedDate(day)}
            >
              {day.format('D')}
            </li>
          ))}
        </ul>

      </header >

      <main className='pt-36 pb-8 px-2 bg-slate-50 text-rose-900 flex flex-col gap-4'>

        <section className='flex flex-col justify-center items-center'>
          <h1 className='text-lg font-bold'>{selectedDate.format("DD/MM/YYYY")}</h1>
          <p className='text-base text-rose-800'>Total do dia: <span className='font-bold'>R${total}</span></p>
        </section>

        <SectionContainer>

          <div className='flex flex-row justify-between items-center text-rose-700 text-xl'>
            <h2 className='font-bold text-lg'>Cortes</h2>
            <FaPencil />
          </div>

          <ul className='flex flex-col gap-2'>

            {
              data.haircuts.map((haircut, key) => (

                <li className='flex flex-row items-center justify-between text-rose-100 text-xl' key={key}>
                  <span className='font-light text-base'>
                    {haircut.name} (R${haircut.price})
                  </span>

                  <MdAddCircleOutline />

                </li>

              ))
            }

          </ul>

        </SectionContainer>

        <SectionContainer>

          <div className='flex flex-row justify-between items-center text-rose-700 text-xl'>
            <h2 className='font-bold text-lg'>Lucros do dia</h2>


            <button
              onClick={() => setIsHaircutsOpen(!isHaircutsOpen)}
            >

              {
                isHaircutsOpen ?
                  <FaCaretUp />
                  :
                  <FaCaretDown />
              }

            </button>

          </div>

          <ul className={`transition-all duration-100 ${isHaircutsOpen ? 'block' : 'hidden'}`}>

            {
              reports.haircuts.map((haircut, key) => (
                <li className='flex flex-row items-center gap-2 text-rose-100 text-xl' key={key}>

                  <FaTrash />

                  <span className='font-light text-base'>
                    {data.haircuts[haircut.id].name} - R${data.haircuts[haircut.id].price}
                  </span>

                </li>
              ))
            }

          </ul>

        </SectionContainer>

        <p className='text-lg font-bold'>Lucros Totais: +R${totalHaircuts.toFixed(2)}</p>

        <SectionContainer>

          <div className='flex flex-row justify-between items-center text-rose-700 text-xl'>
            <h2 className='font-bold text-lg'>Gastos</h2>
            <FaPencil />
          </div>

          <form className='flex flex-col gap-4'>

            <div className='flex flex-col gap-1'>
              <label className='text-sm text-rose-100'>Gasto</label>
              <input className='border border-black rounded-md bg-white py-1 px-2' />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-sm text-rose-100'>Valor</label>
              <input className='border border-black rounded-md bg-white py-1 px-2' />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-sm text-rose-100'>Categoria</label>
              <select className='bg-white py-1 px-2 capitalize rounded-md'>
                {
                  data.categories.map((category, key) => (
                    <option value={category.name} key={key}>{category.name}</option>
                  ))
                }
              </select>
            </div>

            <button className='bg-slate-950 text-rose-100 py-1 w-2/4 self-end rounded-sm shadow-md'>
              + Salvar Gasto
            </button>

          </form>

        </SectionContainer>

        <SectionContainer>

          <div className='flex flex-row justify-between items-center text-rose-700 text-xl'>
            <h2 className='font-bold text-lg'>Gastos do dia</h2>

            <button onClick={() => setIsExpensesOpen(!isExpensesOpen)}>

              {
                isExpensesOpen ?
                <FaCaretUp />
                :
                <FaCaretDown /> 
              }

            </button>

          </div>


          <ul className={`transition-all duration-100 ${isExpensesOpen ? 'block' : 'hidden'}`}>

            {

              reports.expenses.map((expense, key) => (
                <li className='flex flex-row items-center gap-2 text-rose-100 text-xl' key={key}>

                  <FaTrash />

                  <span className='font-light text-base'>
                    {data.expenses[expense.id].name} - R${data.expenses[expense.id].price}
                  </span>

                </li>
              ))

            }

          </ul>



        </SectionContainer>

        <p className='text-lg font-bold'>Gastos Totais: -R${totalExpenses.toFixed(2)}</p>

      </main>

    </>
  )
}

export default App
