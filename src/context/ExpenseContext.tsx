
// This file is kept for backward compatibility
// It re-exports everything from the new files
import { ExpenseProvider, useExpense } from '@/hooks/useExpenseContext';
import { Expense, Budget, Category, DefaultCategory, ExpenseContextType } from '@/types/expense.types';

export {
  ExpenseProvider,
  useExpense,
  type Expense,
  type Budget,
  type Category,
  type DefaultCategory,
  type ExpenseContextType
};
