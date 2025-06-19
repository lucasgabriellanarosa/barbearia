interface Category {
  name: string;
}

interface Haircut {
  name: string;
  price: number;
  id: number,
  haircut_id: number
}

export interface DailyReport {
  date: string;
  expenses: {
    id: number; category: string;
    name: string;
    price: number;
  }[];
  haircuts: {
    haircut_id: number; id: number
  }[];
  id: number,
}

export interface DatabaseData {
  categories: Category[];
  haircuts: Haircut[];
  daily_reports: DailyReport[];
}