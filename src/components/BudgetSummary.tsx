
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpense } from "@/context/ExpenseContext";
import { formatCurrency } from "@/utils/formatting";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

export function BudgetSummary() {
  const { 
    budgets, 
    getTotalExpensesByCategory, 
    getTotalExpenses,
    getTotalBudget,
    getRemainingBudget,
  } = useExpense();
  
  const isMobile = useIsMobile();
  
  const totalBudget = getTotalBudget();
  const totalExpenses = getTotalExpenses();
  const remainingBudget = getRemainingBudget();
  
  // Prepare data for the pie chart
  const data = budgets.map(budget => {
    const spent = getTotalExpensesByCategory(budget.category);
    return {
      name: getCategoryLabel(budget.category),
      value: spent,
    };
  }).filter(item => item.value > 0);

  const COLORS = ['#4ade80', '#facc15', '#38bdf8', '#a78bfa', '#fb7185', '#94a3b8'];
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Resumen de gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <SummaryItem 
            title="Presupuesto total" 
            value={formatCurrency(totalBudget)} 
            description="Importe total disponible" 
          />
          <SummaryItem 
            title="Gastos totales" 
            value={formatCurrency(totalExpenses)} 
            description="Total gastado" 
          />
          <SummaryItem 
            title="Restante" 
            value={formatCurrency(remainingBudget)} 
            description="Disponible para gastar"
            isNegative={remainingBudget < 0}
          />
        </div>
        
        {data.length > 0 ? (
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={isMobile ? 80 : 100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            Añade gastos para ver el gráfico
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SummaryItem({ 
  title, 
  value, 
  description,
  isNegative = false
}: { 
  title: string; 
  value: string; 
  description: string;
  isNegative?: boolean;
}) {
  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="text-sm text-muted-foreground mb-1">{title}</div>
      <div className={`text-xl font-semibold ${isNegative ? 'text-destructive' : ''}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{description}</div>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    groceries: "Alimentación",
    utilities: "Servicios",
    rent: "Alquiler/Hipoteca",
    entertainment: "Entretenimiento",
    transportation: "Transporte",
    other: "Otros",
  };
  
  return labels[category] || category;
}
