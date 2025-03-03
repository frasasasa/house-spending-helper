
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Category, useExpense } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

interface ExpenseFormData {
  description: string;
  amount: string;
  category: Category;
}

const categoryOptions = [
  { value: "groceries", label: "Alimentación" },
  { value: "utilities", label: "Servicios" },
  { value: "rent", label: "Alquiler/Hipoteca" },
  { value: "entertainment", label: "Entretenimiento" },
  { value: "transportation", label: "Transporte" },
  { value: "other", label: "Otros" },
];

export function ExpenseForm() {
  const { addExpense } = useExpense();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ExpenseFormData>({
    defaultValues: {
      description: "",
      amount: "",
      category: "groceries",
    },
  });

  const category = watch("category");

  const onSubmit = (data: ExpenseFormData) => {
    const amount = parseFloat(data.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Por favor, introduce un importe válido");
      return;
    }

    addExpense({
      description: data.description,
      amount,
      category: data.category,
      date: new Date().toISOString(),
    });

    toast.success("Gasto añadido correctamente");
    reset();
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Añadir nuevo gasto</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              placeholder="¿En qué has gastado?"
              {...register("description", { required: "La descripción es requerida" })}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Importe (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              {...register("amount", { 
                required: "El importe es requerido",
                min: { value: 0.01, message: "El importe debe ser mayor que 0" }
              })}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select 
              defaultValue={category} 
              onValueChange={(value) => setValue("category", value as Category)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir gasto
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
