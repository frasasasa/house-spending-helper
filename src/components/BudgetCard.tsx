
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget, Category, useExpense } from "@/context/ExpenseContext";
import { formatCurrency, getStatusColor } from "@/utils/formatting";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EditBudgetDialog } from "./EditBudgetDialog";

const categoryLabels: Record<Category, string> = {
  groceries: "Alimentación",
  utilities: "Servicios",
  rent: "Alquiler/Hipoteca",
  entertainment: "Entretenimiento",
  transportation: "Transporte",
  other: "Otros",
};

interface BudgetCardProps {
  category: Category;
}

export function BudgetCard({ category }: BudgetCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { 
    budgets, 
    updateBudget,
    getTotalExpensesByCategory, 
    getRemainingBudgetByCategory,
    getPercentageSpentByCategory 
  } = useExpense();

  const budget = budgets.find(b => b.category === category)?.amount || 0;
  const spent = getTotalExpensesByCategory(category);
  const remaining = getRemainingBudgetByCategory(category);
  const percentage = getPercentageSpentByCategory(category);
  
  const statusColor = getStatusColor(percentage);

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">{categoryLabels[category]}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDialogOpen(true)}
              className="h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-3">
            <Progress value={Math.min(percentage, 100)} className={`h-2 bg-slate-100 dark:bg-slate-800 ${percentage >= 100 ? 'text-expense-high' : ''}`} />
            
            <div className="grid grid-cols-2 gap-1 text-sm">
              <div className="text-muted-foreground">Presupuesto:</div>
              <div className="text-right">{formatCurrency(budget)}</div>
              
              <div className="text-muted-foreground">Gastado:</div>
              <div className="text-right">{formatCurrency(spent)}</div>
              
              <div className="text-muted-foreground">Restante:</div>
              <div className={`text-right font-medium ${remaining < 0 ? 'text-expense-high' : ''}`}>
                {formatCurrency(remaining)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full rounded-full h-1.5 bg-muted">
            <div 
              className={`h-1.5 rounded-full bg-${statusColor}`} 
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </CardFooter>
      </Card>
      
      <EditBudgetDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        category={category}
        currentBudget={budget}
        onSave={(amount) => updateBudget(category, amount)}
      />
    </>
  );
}
