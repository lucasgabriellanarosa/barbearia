import { useEffect, useRef, useState } from 'react'
import { useDatabaseContext } from './contexts/DatabaseContext'
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { MdAddCircleOutline, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import SectionContainer from './components/SectionContainer';
import { FaCaretDown, FaCaretUp, FaPencil, FaTrash } from 'react-icons/fa6';
import type { Category, DailyReport, DatabaseData, Haircut } from './@types/Database';
import { getDatabase, ref, set, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import './App.css'
import { FaSave } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import customParseFormat from 'dayjs/plugin/customParseFormat';


function App() {
  dayjs.locale('pt-br');
  dayjs.extend(customParseFormat);

  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  const user = auth.currentUser;

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
    haircuts: [],
    id: 0
  })

  const dailyReportsArray = Object.values(data.daily_reports || {});


  useEffect(() => {
    if (data.daily_reports) {
      const filteredReport = dailyReportsArray.find(report =>
        report.date === selectedDate.format('DD-MM-YYYY')
      );

      setReports(filteredReport || {
        date: selectedDate.format('DD-MM-YYYY'),
        expenses: [],
        haircuts: [],
        id: 0,
      });
    }

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

    if (data.categories && data.categories.length > 0) {
      const firstValidCategory = data.categories.find(cat => cat && cat.name);
      if (firstValidCategory) {
        setExpenseCategory(prev => prev || firstValidCategory.name);
      }
    }


    if (data.haircuts > []) {
      setHaircuts(data.haircuts)
    }

    if (data.categories > []) {
      setCategories(data.categories)
    }


  }, [selectedDate, data.daily_reports]);

  // Money Values
  const totalHaircuts = (reports.haircuts || []).reduce((sum, haircut) => {
    return sum + Number(data.haircuts?.[haircut.haircut_id]?.price || 0);
  }, 0);

  const totalExpenses = (reports.expenses || []).reduce((sum, expense) => {
    return sum + Number(expense.price || 0);
  }, 0);

  const total = totalHaircuts - totalExpenses

  // Open and Close Logic

  const [isHaircutsOpen, setIsHaircutsOpen] = useState(false)
  const [isExpensesOpen, setIsExpensesOpen] = useState(false)

  // Haircuts Made Add and Remove

  const db = getDatabase();
  const selectedDateFormatted = selectedDate.format('DD-MM-YYYY');

  const existingReport = dailyReportsArray.find(
    report => report.date === selectedDateFormatted
  );

  const addHaircutDone = async (haircutId: number) => {

    if (existingReport) {
      const reportRef = ref(db, `users/${uid}/daily_reports/${existingReport.id}`);

      const newHaircut = {
        id: Date.now().toString(),
        haircut_id: haircutId,
      };

      await update(reportRef, {
        ...existingReport,
        haircuts: [...(Array.isArray(existingReport.haircuts) ? existingReport.haircuts : []), newHaircut]

      });

    } else {
      const newId = Object.keys(data.daily_reports || {}).length.toString();
      await set(ref(db, `users/${uid}/daily_reports/${newId}`), {
        date: selectedDateFormatted,
        expenses: [],
        haircuts: [{ id: Date.now().toString(), haircut_id: haircutId }],
        id: newId
      });
    }
  };

  const deleteHaircutDone = async (haircutToDelete: number) => {

    if (existingReport) {
      const reportRef = ref(db, `users/${uid}/daily_reports/${existingReport.id}`);

      const updatedHaircuts = (Array.isArray(existingReport.haircuts) ? existingReport.haircuts : []).filter(
        (haircut: { id: number }) => haircut.id !== haircutToDelete
      );

      await update(reportRef, {
        ...existingReport,
        haircuts: updatedHaircuts
      });
    }
  };

  // Expenses Add and Remove

  const [expenseName, setExpenseName] = useState('');
  const [expensePrice, setExpensePrice] = useState('');
  const [expenseCategory, setExpenseCategory] = useState(data.categories[0]?.name || '');

  const addExpense = async () => {

    if (!expenseName || !expensePrice || !expenseCategory) {

      alert("Preencha todos os campos.");
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      name: expenseName,
      price: parseFloat(expensePrice),
      category: expenseCategory
    };


    if (existingReport) {

      const reportRef = ref(db, `users/${uid}/daily_reports/${existingReport.id}`);

      await update(reportRef, {
        ...existingReport,
        expenses: [...(Array.isArray(existingReport.expenses) ? existingReport.expenses : []), newExpense]

      });

    } else {

      const newId = Date.now().toString();
      await set(ref(db, `users/${uid}/daily_reports/${newId}`), {
        date: selectedDateFormatted,
        expenses: [{
          id: Object.keys(data.daily_reports || {}).length.toString(),
          name: expenseName,
          price: parseFloat(expensePrice),
          category: expenseCategory
        }],
        haircuts: [{}],
        id: newId
      });
    }

    setExpenseName('');
    setExpensePrice('');
    setExpenseCategory(data.categories[0]?.name || '');


  };

  const deleteExpense = async (expenseId: number) => {

    if (existingReport) {
      const reportRef = ref(db, `users/${uid}/daily_reports/${existingReport.id}`);

      const updatedExpenses = (Array.isArray(existingReport.expenses) ? existingReport.expenses : []).filter(
        (expense: { id: number }) => expense.id !== expenseId
      );

      await update(reportRef, {
        ...existingReport,
        expenses: updatedExpenses
      });
    }

  }

  const [isYearSelectorOpen, setIsYearSelectorOpen] = useState(false);
  const yearOptions = Array.from({ length: 7 }, (_, i) => dayjs().year() - 3 + i);

  // Edit Haircuts

  const [haircuts, setHaircuts] = useState<Haircut[]>([]);

  const [isHairEditModalOpen, setIsHairEditModalOpen] = useState(false)

  const saveAllHaircutsEdit = async () => {
    try {
      const db = getDatabase();
      for (const haircut of haircuts) {
        const haircutRef = ref(db, `users/${uid}/haircuts/${haircut.id}`);
        await set(haircutRef, {
          name: haircut.name.trim(),
          price: haircut.price,
          id: haircut.id,
        });
      }
      setIsHairEditModalOpen(false);
      alert("Cortes salvos com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar cortes:", err);
      alert("Erro ao salvar cortes. Tente novamente.");
    }
  };


  const [newHaircutName, setNewHaircutName] = useState('');
  const [newHaircutPrice, setNewHaircutPrice] = useState('');

  // Edit Categories

  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const addNewCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory = {
      name: newCategoryName.trim(),
      id: Date.now().toString(),
    };

    setCategories(prev => [...prev, newCategory]);

    setNewCategoryName('');
  };

  const saveAllCategories = async () => {
    try {
      const categoriesRef = ref(db, `users/${uid}/categories`);
      await set(categoriesRef, categories.map(cat => ({
        name: cat.name.trim(),
        id: cat.id
      })));
      setIsCategoryEditModalOpen(false)
      alert("Categories salvas com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar categorias:", err);
      alert("Erro ao salvar categorias. Tente novamente.");
    }
  }

  // Mensal Info

  const [isMensalInfoOpen, setIsMensalInfoOpen] = useState(false)

  const totalMonthlyExpenses = Object.values(data.daily_reports).reduce((total, report) => {
    const reportDate = dayjs(report.date, "DD-MM-YYYY"); // parse da string "24-07-2025"
    const reportMonth = reportDate.format("MMMM"); // Ex: "julho"
    const selectedMonth = selectedDate.format("MMMM"); // Ex: "julho"

    if (reportMonth === selectedMonth) {
      const monthlySum = (report.expenses || []).reduce((sum, expense) => {
        return sum + Number(expense.price || 0);
      }, 0);

      return total + monthlySum;
    }

    return total;
  }, 0);

  const totalMonthlyHaircuts = (data?.daily_reports && haircuts)
    ? Object.values(data.daily_reports).reduce((total, report) => {
      const reportDate = dayjs(report.date, "DD-MM-YYYY");
      const reportMonth = reportDate.format("MMMM");
      const selectedMonth = selectedDate.format("MMMM");

      if (reportMonth === selectedMonth) {
        const monthlySum = (report.haircuts || []).reduce((sum, reportHaircut) => {
          return sum + Number(haircuts[reportHaircut.haircut_id]?.price || 0);
        }, 0);

        return total + monthlySum;
      }

      return total;
    }, 0)
    : 0;

  return (
    <>
      <header className='fixed flex flex-col w-full bg-bgDarkPrimary text-textPrimary shadow-xl font-inter'>

        <section className='flex flex-col py-2 px-4'>
          <div className='flex flex-row justify-between'>
            <button className='text-base'
              onClick={() => setIsYearSelectorOpen(prev => !prev)}
            >
              {selectedDate.format("YYYY")}
            </button>
            {isYearSelectorOpen && (
              <ul className='absolute mt-1 bg-white border rounded shadow-md z-50 max-h-60 overflow-y-auto'>
                {yearOptions.map((year) => (
                  <li
                    key={year}
                    className={`px-4 py-2 cursor-pointer hover:bg-bgLight ${selectedDate.year() === year ? 'bg-bgLight' : ''}`}
                    onClick={() => {
                      setSelectedDate(selectedDate.year(year));
                      setIsYearSelectorOpen(false);
                    }}
                  >
                    {year}
                  </li>
                ))}
              </ul>
            )}
            <div
              className='w-[40px] h-[40px] rounded-full bg-cover bg-center'
              style={{ backgroundImage: `url('${user?.photoURL || "/default-avatar.png"}')` }}
            ></div>
          </div>

          <nav className='flex flex-row items-center justify-around text-2xl'>
            <span onClick={() => navigateMonth('prev')} className="cursor-pointer">
              <MdNavigateBefore />
            </span>
            <button className='text-lg font-bold capitalize'>{selectedDate.format("MMMM")}</button>
            <span onClick={() => navigateMonth('next')} className="cursor-pointer">
              <MdNavigateNext />
            </span>
          </nav>
        </section>

        <ul
          ref={carouselRef}
          className='bg-bgDarkSecondary flex flex-row py-2 gap-4 px-4 overflow-x-auto scrollbar-hide text-textFourth'
        >
          {daysInMonth.map((day) => (
            <li
              key={day.format('DD-MM-YYYY')}
              data-day={day.format('DD-MM-YYYY')}
              className={`py-1 px-2 rounded-sm cursor-pointer min-w-[2.5rem] text-center ${day.isSame(selectedDate, 'day')
                ? 'bg-textPrimary'
                : 'bg-bgDarkThird hover:bg-textPrimary'
                }`}
              onClick={() => setSelectedDate(day)}
            >
              {day.format('D')}
            </li>
          ))}
        </ul>

      </header >


      <main className='pt-36 pb-8 px-2 bg-Light text-textPrimary flex flex-col gap-4 font-inter'>


        {
          isMensalInfoOpen &&
          <section className='bg-bgDarkPrimary fixed left-0 right-0 mx-2 shadow-md px-4 py-2 flex flex-col gap-4 h-[500px] text-textThird'>
            <button className='text-textPrimary self-end text-3xl' onClick={() => setIsMensalInfoOpen(false)}>
              <IoIosClose />
            </button>
            <h2 className='text-lg font-bold text-textPrimary capitalize'>{selectedDate.format("MMMM")}</h2>
            <p>Gastos: R${totalMonthlyExpenses.toFixed(2)}</p>
            <p>Cortes: R${totalMonthlyHaircuts.toFixed(2)}</p>
            <p className='font-semibold italic text-lg'>Lucro: R${(totalMonthlyHaircuts - totalMonthlyExpenses).toFixed(2)}</p>
          </section>
        }


        <section className='flex flex-col justify-center items-center'>
          <h1 className='text-lg font-bold'>{selectedDate.format("DD/MM/YYYY")}</h1>
          <p className='text-base text-textSecondary'>Total do dia: <span className='font-bold'>R${total}</span></p>
        </section>

        <button className='bg-bgDarkBtn text-textFourth py-1 w-fit self-center px-6 rounded-md' onClick={() => setIsMensalInfoOpen(true)}>
          Total Mensal
        </button>

        <SectionContainer>

          <div className='flex flex-row justify-between items-center text-textSecondary text-xl'>
            <h2 className='font-bold text-lg'>Cortes</h2>

            {
              isHairEditModalOpen ?
                <button
                  onClick={saveAllHaircutsEdit}
                >
                  <FaSave />
                </button>
                :
                <button
                  onClick={() => setIsHairEditModalOpen(!isHairEditModalOpen)}
                >
                  <FaPencil />

                </button>
            }

          </div>


          {
            isHairEditModalOpen ?
              <>

                <ul className='flex flex-col gap-2'>

                  {
                    haircuts.map((haircut, key) => (

                      <li className='flex flex-row items-center justify-between text-textThird text-base' key={key}>

                        <input type="text"
                          value={haircut.name}
                          onChange={(e) => {
                            const updated = [...haircuts];
                            updated[key].name = e.target.value;
                            setHaircuts(updated);
                          }}
                          className='w-1/2 border py-1 px-2 rounded-sm text-textThird' />

                        <input
                          type="number"
                          value={haircut.price}
                          onChange={(e) => {
                            const updated = [...haircuts];
                            updated[key].price = parseFloat(e.target.value);
                            setHaircuts(updated);
                          }}
                          className='w-1/4 border px-2 py-1 rounded-md text-textThird'
                        />

                      </li>

                    ))
                  }

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newHaircutName || !newHaircutPrice) return;
                      const lastHaircutId = data.haircuts && data.haircuts.length > 0
                        ? Math.max(...data.haircuts.map(h => h.id || 0))
                        : 0;
                      const newHaircut = {
                        name: newHaircutName,
                        price: parseFloat(newHaircutPrice),
                        id: lastHaircutId + 1,
                      };

                      setHaircuts(prev => [...prev, newHaircut]);
                      setNewHaircutName('');
                      setNewHaircutPrice('');
                    }}
                    className="flex flex-col gap-4 mt-4"
                  >
                    <div
                      className='flex flex-row justify-between text-textSecondary'>
                      <input
                        type="text"
                        placeholder="Novo Corte"
                        value={newHaircutName}
                        onChange={(e) => setNewHaircutName(e.target.value)}
                        className="border py-1 px-2 rounded-sm"
                      />

                      <input
                        type="number"
                        placeholder="Preço"
                        value={newHaircutPrice}
                        onChange={(e) => setNewHaircutPrice(e.target.value)}
                        className="w-1/4 border py-1 px-2 rounded-sm"
                      />

                    </div>


                    <button
                      type="submit"
                      className="bg-textPrimary text-white rounded-sm w-fit self-center py-2 px-4"
                    >
                      + Adicionar
                    </button>
                  </form>


                </ul>

              </>
              :
              <ul className='flex flex-col gap-2'>

                {
                  data.haircuts.map((haircut, key) => (

                    <li className='flex flex-row items-center justify-between text-textThird text-xl' key={key}>
                      <span className='font-light text-base'>
                        {haircut.name} (R${haircut.price})
                      </span>

                      <button
                        onClick={() => addHaircutDone(haircut.id)}
                      >
                        <MdAddCircleOutline />
                      </button>
                    </li>

                  ))
                }

              </ul>
          }




        </SectionContainer>

        <SectionContainer>

          <div className='flex flex-row justify-between items-center text-textSecondary text-xl'>
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
              reports.haircuts > [] ?
                reports.haircuts.map((haircut, key) => (
                  <li className='flex flex-row items-center gap-2 text-textThird text-xl' key={key}>

                    <button
                      onClick={() => deleteHaircutDone(haircut.id)}
                    >
                      <FaTrash />
                    </button>

                    <span className='font-light text-base'>
                      {data.haircuts[haircut.haircut_id].name} - R${data.haircuts[haircut.haircut_id].price}
                    </span>

                  </li>
                ))
                :
                <p className='text-textThird'>Trabalhou ainda não né kk</p>
            }

          </ul>

        </SectionContainer>

        <p className='text-lg font-bold'>Lucros Totais: +R${totalHaircuts.toFixed(2)}</p>

        <SectionContainer>

          <div className='flex flex-row justify-between items-center text-textSecondary text-xl'>
            <h2 className='font-bold text-lg'>Gastos</h2>
            {
              isCategoryEditModalOpen ?
                <button
                  onClick={() => saveAllCategories()}
                >
                  <FaSave />
                </button>
                :
                <button
                  onClick={() => setIsCategoryEditModalOpen(!isCategoryEditModalOpen)}
                >
                  <FaPencil />
                </button>
            }
          </div>

          {
            isCategoryEditModalOpen ? (
              <>
                <ul className='flex flex-col gap-2'>
                  {categories.map((category, key) => (
                    <li key={key} className='flex items-center gap-2'>
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[key].name = e.target.value;
                          setCategories(updated);
                        }}
                        className='border px-2 py-1 rounded w-full text-textThird'
                      />
                    </li>
                  ))}
                </ul>

                <div className='flex flex-col gap-2 mt-4'>
                  <input
                    type="text"
                    placeholder="Nova categoria"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className='border px-2 py-1 rounded text-textSecondary'
                  />

                  <button
                    onClick={addNewCategory}
                    className="bg-textPrimary text-white rounded-sm w-fit self-center py-2 px-4"
                  >
                    + Adicionar Categoria
                  </button>

                </div>
              </>
            ) : (
              <form
                className='flex flex-col gap-4'
                onSubmit={(e) => {
                  e.preventDefault();
                  addExpense();
                }}
              >
                <div className='flex flex-col gap-1'>
                  <label className='text-sm text-textFourth'>Gasto</label>
                  <input
                    className='border border-black rounded-md bg-white py-1 px-2'
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <label className='text-sm text-textFourth'>Valor</label>
                  <input
                    className='border border-black rounded-md bg-white py-1 px-2'
                    type='number'
                    value={expensePrice}
                    onChange={(e) => setExpensePrice(e.target.value)}
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <label className='text-sm text-textFourth'>Categoria</label>

                  <select
                    className='bg-white py-1 px-2 capitalize rounded-md'
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                  >
                    {Object.values(data.categories || {}).map((category: { id: string | number; name: string }, key) => (
                      <option value={category.name} key={key}>
                        {category.name}
                      </option>
                    ))}

                  </select>
                </div>

                <button
                  type='submit'
                  className='bg-bgDarkBtn text-textFourth py-1 w-2/4 self-end rounded-sm shadow-md'
                >
                  + Salvar Gasto
                </button>
              </form>
            )
          }

        </SectionContainer>

        <SectionContainer>

          <div className='flex flex-row justify-between items-center text-textSecondary text-xl'>
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

              reports.expenses > [] ?
                reports.expenses.map((expense, key) => (
                  <li className='flex flex-row items-center gap-2 text-textThird text-xl' key={key}>

                    <button
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <FaTrash />
                    </button>

                    <span className='font-light text-base'>
                      {expense.name} - R${expense.price}
                    </span>

                  </li>
                ))
                :
                <p className='text-textThird'>Confere ai se não tem nenhuma compra suspeita no seu cartão kkk</p>
            }

          </ul>



        </SectionContainer>

        <p className='text-lg font-bold'>Gastos Totais: -R${totalExpenses.toFixed(2)}</p>

      </main >

    </>
  )
}

export default App
