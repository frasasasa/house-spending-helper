
export type DefaultCategory = 'groceries' | 'utilities' | 'rent' | 'entertainment' | 'transportation' | 'other';
export type Category = DefaultCategory | string;

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
}

export interface Budget {
  category: Category;
  amount: number;
}

export interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  updateBudget: (category: Category, amount: number) => void;
  addBudget: (category: string, amount: number) => void;
  removeBudget: (category: Category) => void;
  renameCategory: (oldCategory: Category, newCategory: string) => void;
  getTotalExpensesByCategory: (category: Category) => number;
  getRemainingBudgetByCategory: (category: Category) => number;
  getTotalExpenses: () => number;
  getTotalBudget: () => number;
  getRemainingBudget: () => number;
  getPercentageSpentByCategory: (category: Category) => number;
}
