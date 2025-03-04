
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Expense, Budget, Category, ExpenseContextType } from '@/types/expense.types';
import { 
  defaultBudgets, 
  defaultCategories,
  getTotalExpensesByCategory as calculateTotalExpensesByCategory,
  getRemainingBudgetByCategory as calculateRemainingBudgetByCategory,
  getTotalExpenses as calculateTotalExpenses,
  getTotalBudget as calculateTotalBudget,
  getRemainingBudget as calculateRemainingBudget,
  getPercentageSpentByCategory as calculatePercentageSpentByCategory
} from '@/utils/expenseUtils';

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

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
    const totalExpenses = calculateTotalExpensesByCategory(expenses, expense.category) + expense.amount;

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
    // Check if trying to rename to an existing category
    if (budgets.some(b => b.category === newCategory)) {
      toast.error("Ya existe una categoría con ese nombre", {
        description: "Por favor, elige otro nombre para la categoría."
      });
      return;
    }
    
    // Check if it's a default category (can still be renamed in the UI, but display a notice)
    if (defaultCategories.includes(oldCategory)) {
      toast.info("Has renombrado una categoría predeterminada", {
        description: "Los datos seguirán agrupándose correctamente, pero tendrá un nombre personalizado."
      });
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

  // Wrapper functions that use the utility functions but with the current state
  const getTotalExpensesByCategory = (category: Category): number => {
    return calculateTotalExpensesByCategory(expenses, category);
  };

  const getRemainingBudgetByCategory = (category: Category): number => {
    return calculateRemainingBudgetByCategory(expenses, budgets, category);
  };

  const getTotalExpenses = (): number => {
    return calculateTotalExpenses(expenses);
  };

  const getTotalBudget = (): number => {
    return calculateTotalBudget(budgets);
  };

  const getRemainingBudget = (): number => {
    return calculateRemainingBudget(expenses, budgets);
  };

  const getPercentageSpentByCategory = (category: Category): number => {
    return calculatePercentageSpentByCategory(expenses, budgets, category);
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
