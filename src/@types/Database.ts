export interface Category {
  name: string;
  id: string,
}

export interface Haircut {
  name: string;
  price: number;
  id: number,
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