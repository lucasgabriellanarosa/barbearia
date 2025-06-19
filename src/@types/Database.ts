interface Category {
  name: string;
}

interface Expense {
  category: string;
  name: string;
  price: number;
}

interface Haircut {
  name: string;
  price: number;
  id: number,
  haircut_id: number
}

export interface DailyReport {
  date: string;
  expenses: { id: number }[];
  haircuts: {
    haircut_id: number; id: number 
}[];
  id: number,
}

export interface DatabaseData {
  categories: Category[];
  expenses: Expense[];
  haircuts: Haircut[];
  daily_reports: DailyReport[];
}