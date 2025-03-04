
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

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

interface ExpenseContextType {
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

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const defaultBudgets: Budget[] = [
  { category: 'groceries', amount: 300 },
  { category: 'utilities', amount: 200 },
  { category: 'rent', amount: 800 },
  { category: 'entertainment', amount: 150 },
  { category: 'transportation', amount: 200 },
  { category: 'other', amount: 100 },
];

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : defaultBudgets;
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
    };

    const budget = budgets.find(b => b.category === expense.category)?.amount || 0;
    const totalExpenses = getTotalExpensesByCategory(expense.category) + expense.amount;

    if (totalExpenses > budget) {
      toast.warning(`¡Atención! Este gasto excede tu presupuesto de ${expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}`, {
        description: `Tu presupuesto es ${budget.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} y llevas gastado ${totalExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`,
        duration: 5000,
      });
    }

    setExpenses(prev => [newExpense, ...prev]);
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateBudget = (category: Category, amount: number) => {
    setBudgets(prev => {
      const existing = prev.findIndex(b => b.category === category);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], amount };
        return updated;
      }
      return [...prev, { category, amount }];
    });
  };

  const addBudget = (category: string, amount: number) => {
    if (budgets.some(b => b.category === category)) {
      toast.error("Esta categoría ya existe", {
        description: "Por favor, elige otro nombre para la categoría."
      });
      return;
    }
    
    setBudgets(prev => [...prev, { category, amount }]);
    toast.success(`Nueva categoría "${category}" añadida`, {
      description: `Presupuesto asignado: ${amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`
    });
  };

  const removeBudget = (category: Category) => {
    const defaultCategories: Category[] = ['groceries', 'utilities', 'rent', 'entertainment', 'transportation', 'other'];
    if (defaultCategories.includes(category)) {
      toast.error("No se pueden eliminar categorías predeterminadas", {
        description: "Solo puedes eliminar categorías personalizadas."
      });
      return;
    }
    
    setBudgets(prev => prev.filter(b => b.category !== category));
    toast.success(`Categoría "${category}" eliminada`);
  };

  const renameCategory = (oldCategory: Category, newCategory: string) => {
    const defaultCategories: Category[] = ['groceries', 'utilities', 'rent', 'entertainment', 'transportation', 'other'];
    
    if (defaultCategories.includes(oldCategory)) {
      toast.error("No se pueden renombrar categorías predeterminadas", {
        description: "Solo puedes renombrar categorías personalizadas."
      });
      return;
    }

    if (budgets.some(b => b.category === newCategory)) {
      toast.error("Ya existe una categoría con ese nombre", {
        description: "Por favor, elige otro nombre para la categoría."
      });
      return;
    }

    // Update budget category
    setBudgets(prev => 
      prev.map(budget => 
        budget.category === oldCategory 
          ? { ...budget, category: newCategory } 
          : budget
      )
    );

    // Update expenses with this category
    setExpenses(prev => 
      prev.map(expense => 
        expense.category === oldCategory 
          ? { ...expense, category: newCategory } 
          : expense
      )
    );

    toast.success(`Categoría renombrada a "${newCategory}"`);
  };

  const getTotalExpensesByCategory = (category: Category): number => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getRemainingBudgetByCategory = (category: Category): number => {
    const budget = budgets.find(b => b.category === category)?.amount || 0;
    const spent = getTotalExpensesByCategory(category);
    return budget - spent;
  };

  const getTotalExpenses = (): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalBudget = (): number => {
    return budgets.reduce((total, budget) => total + budget.amount, 0);
  };

  const getRemainingBudget = (): number => {
    return getTotalBudget() - getTotalExpenses();
  };

  const getPercentageSpentByCategory = (category: Category): number => {
    const budget = budgets.find(b => b.category === category)?.amount || 0;
    if (budget === 0) return 0;
    
    const spent = getTotalExpensesByCategory(category);
    return (spent / budget) * 100;
  };

  return (
    <ExpenseContext.Provider 
      value={{
        expenses,
        budgets,
        addExpense,
        removeExpense,
        updateBudget,
        addBudget,
        removeBudget,
        renameCategory,
        getTotalExpensesByCategory,
        getRemainingBudgetByCategory,
        getTotalExpenses,
        getTotalBudget,
        getRemainingBudget,
        getPercentageSpentByCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
