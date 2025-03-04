
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/expense.types";
import { toast } from "sonner";

interface RenameCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  onRename: (newCategory: string) => void;
}

export function RenameCategoryDialog({
  open,
  onOpenChange,
  category,
  onRename,
}: RenameCategoryDialogProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  
  useEffect(() => {
    if (open && category) {
      setNewCategoryName(category.toString());
    }
  }, [open, category]);

  const handleRename = () => {
    if (!newCategoryName || !newCategoryName.trim()) {
      toast.error("El nombre de la categoría no puede estar vacío");
      return;
    }
    
    onRename(newCategoryName.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Renombrar categoría</DialogTitle>
          <DialogDescription>
            Introduce un nuevo nombre para esta categoría
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="categoryName">Nombre de la categoría</Label>
            <Input
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleRename}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
