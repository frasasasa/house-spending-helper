
import { Budget, Category, Expense } from "@/types/expense.types";

export const defaultBudgets: Budget[] = [
  { category: 'groceries', amount: 300 },
  { category: 'utilities', amount: 200 },
  { category: 'rent', amount: 800 },
  { category: 'entertainment', amount: 150 },
  { category: 'transportation', amount: 200 },
  { category: 'other', amount: 100 },
];

export const defaultCategories: Category[] = ['groceries', 'utilities', 'rent', 'entertainment', 'transportation', 'other'];

export const getTotalExpensesByCategory = (expenses: Expense[], category: Category): number => {
  return expenses
    .filter(expense => expense.category === category)
    .reduce((total, expense) => total + expense.amount, 0);
};

export const getTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getTotalBudget = (budgets: Budget[]): number => {
  return budgets.reduce((total, budget) => total + budget.amount, 0);
};

export const getRemainingBudgetByCategory = (
  expenses: Expense[], 
  budgets: Budget[], 
  category: Category
): number => {
  const budget = budgets.find(b => b.category === category)?.amount || 0;
  const spent = getTotalExpensesByCategory(expenses, category);
  return budget - spent;
};

export const getRemainingBudget = (expenses: Expense[], budgets: Budget[]): number => {
  return getTotalBudget(budgets) - getTotalExpenses(expenses);
};

export const getPercentageSpentByCategory = (
  expenses: Expense[], 
  budgets: Budget[], 
  category: Category
): number => {
  const budget = budgets.find(b => b.category === category)?.amount || 0;
  if (budget === 0) return 0;
  
  const spent = getTotalExpensesByCategory(expenses, category);
  return (spent / budget) * 100;
};
