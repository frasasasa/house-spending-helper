
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/context/ExpenseContext";
import { toast } from "sonner";

const categoryLabels: Record<Category, string> = {
  groceries: "Alimentación",
  utilities: "Servicios",
  rent: "Alquiler/Hipoteca",
  entertainment: "Entretenimiento",
  transportation: "Transporte",
  other: "Otros",
};

interface EditBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  currentBudget: number;
  onSave: (amount: number) => void;
}

export function EditBudgetDialog({
  open,
  onOpenChange,
  category,
  currentBudget,
  onSave,
}: EditBudgetDialogProps) {
  const [amount, setAmount] = useState(currentBudget.toString());

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      toast.error("Por favor, introduce un importe válido");
      return;
    }
    
    onSave(parsedAmount);
    onOpenChange(false);
    toast.success(`Presupuesto de ${categoryLabels[category]} actualizado`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar presupuesto - {categoryLabels[category]}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Importe (€)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
