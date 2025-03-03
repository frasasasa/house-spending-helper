
import { BudgetCard } from "@/components/BudgetCard";
import { BudgetSummary } from "@/components/BudgetSummary";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { useExpense } from "@/context/ExpenseContext";

const Index = () => {
  const { budgets } = useExpense();
  
  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-medium">Control de Gastos</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Summary Section */}
          <section>
            <BudgetSummary />
          </section>
          
          {/* Budget Cards */}
          <section>
            <h2 className="text-lg font-medium mb-4">Presupuesto por categoría</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget) => (
                <BudgetCard key={budget.category} category={budget.category} />
              ))}
            </div>
          </section>
          
          {/* Expense Management */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ExpenseForm />
            </div>
            <div className="lg:col-span-2">
              <ExpenseList />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
