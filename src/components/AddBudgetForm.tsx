
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpense } from "@/context/ExpenseContext";
import { PlusCircle } from "lucide-react";

export function AddBudgetForm() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const { addBudget } = useExpense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.trim()) {
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    addBudget(category.trim(), parsedAmount);
    setCategory("");
    setAmount("");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Añadir nueva partida de gasto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              placeholder="Nombre de la partida"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget-amount">Presupuesto (€)</Label>
            <Input
              id="budget-amount"
              type="number"
              placeholder="0,00"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Añadir partida
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
