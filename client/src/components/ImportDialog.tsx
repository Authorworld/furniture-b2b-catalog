import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { importFromCSV, importFromExcel, ImportedFactory } from '@/lib/importUtils';
import { toast } from 'sonner';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (factories: ImportedFactory[]) => void;
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      let factories: ImportedFactory[];

      if (file.name.endsWith('.csv')) {
        factories = await importFromCSV(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        factories = await importFromExcel(file);
      } else {
        throw new Error('Поддерживаются только CSV и Excel файлы (.csv, .xlsx, .xls)');
      }

      const message = `Успешно загружено ${factories.length} фабрик`;
      setSuccess(message);
      toast.success(message);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Call onImport after a short delay to show success message
      setTimeout(() => {
        onImport(factories);
        onOpenChange(false);
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка при импорте';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Импорт фабрик из файла</DialogTitle>
          <DialogDescription>
            Загрузите CSV или Excel файл с данными о мебельных фабриках
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-secondary-foreground">
            <p className="mb-2 font-medium">Требуемые колонки:</p>
            <ul className="list-inside list-disc space-y-1 text-xs">
              <li>Название фабрики (обязательно)</li>
              <li>Страна (Россия/Беларусь)</li>
              <li>Город</li>
              <li>Телефон</li>
              <li>Email (опционально)</li>
              <li>Сайт</li>
              <li>Специализация (разделить точкой с запятой)</li>
              <li>Сегмент (Эконом/Средний/Премиум)</li>
              <li>Год основания</li>
              <li>Примеры работ (Формат: Название|URL; Название|URL)</li>
              <li>Описание</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerFileInput('.csv')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerFileInput('.xlsx,.xls')}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              Excel
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-secondary-foreground">
            💡 Совет: Используйте кнопку "Экспорт" для скачивания шаблона с текущими фабриками
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
