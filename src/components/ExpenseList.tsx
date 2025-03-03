
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpense, Expense } from "@/context/ExpenseContext";
import { formatCurrency } from "@/utils/formatting";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const categoryLabels: Record<string, string> = {
  all: "Todas las categorías",
  groceries: "Alimentación",
  utilities: "Servicios",
  rent: "Alquiler/Hipoteca",
  entertainment: "Entretenimiento",
  transportation: "Transporte",
  other: "Otros",
};

export function ExpenseList() {
  const { expenses, removeExpense } = useExpense();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = filter === "all" || expense.category === filter;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      removeExpense(expenseToDelete);
      setExpenseToDelete(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Historial de gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No hay gastos registrados
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Historial de gastos</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <Select defaultValue={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Buscar por descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No se encontraron resultados
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <ExpenseItem 
                  key={expense.id} 
                  expense={expense} 
                  onDelete={() => setExpenseToDelete(expense.id)} 
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!expenseToDelete} onOpenChange={(open) => !open && setExpenseToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpenseToDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ExpenseItem({ expense, onDelete }: { expense: Expense; onDelete: () => void }) {
  const date = new Date(expense.date);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <h4 className="text-sm font-medium truncate mr-2">{expense.description}</h4>
          <span className="text-sm font-semibold">{formatCurrency(expense.amount)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{categoryLabels[expense.category]}</span>
          <span>{format(date, "d MMM yyyy", { locale: es })}</span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive" 
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
