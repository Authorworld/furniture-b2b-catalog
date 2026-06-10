import { Factory } from '@/data/factories';
import * as XLSX from 'xlsx';

export interface ImportedFactory extends Omit<Factory, 'id'> {
  id?: string;
}

const normalizeCountry = (country: string): 'Russia' | 'Belarus' => {
  const normalized = country.toLowerCase().trim();
  if (normalized.includes('россия') || normalized.includes('russia') || normalized === 'рф') {
    return 'Russia';
  }
  if (normalized.includes('беларусь') || normalized.includes('belarus') || normalized === 'бр') {
    return 'Belarus';
  }
  return 'Russia'; // Default
};

const normalizeSegment = (segment: string): 'economy' | 'middle' | 'premium' => {
  const normalized = segment.toLowerCase().trim();
  if (normalized.includes('эконом') || normalized.includes('economy')) {
    return 'economy';
  }
  if (normalized.includes('премиум') || normalized.includes('premium')) {
    return 'premium';
  }
  return 'middle'; // Default
};

export const importFromCSV = (file: File): Promise<ImportedFactory[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          reject(new Error('CSV файл должен содержать заголовок и хотя бы одну строку данных'));
          return;
        }

        // Парсинг заголовка
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

        // Парсинг данных
        const factories: ImportedFactory[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i]
            .split(',')
            .map((v) => v.trim().replace(/^"|"$/g, ''))
            .map((v) => (v === '' ? undefined : v));

          if (values.every((v) => !v)) continue; // Skip empty lines

          const row: Record<string, any> = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });

          const factory: ImportedFactory = {
            name: row['Название фабрики'] || row['Name'] || 'Unknown',
            country: normalizeCountry(row['Страна'] || row['Country'] || ''),
            city: row['Город'] || row['City'] || '',
            phone: row['Телефон'] || row['Phone'] || '',
            email: row['Email'] || row['Email'] || undefined,
            website: row['Сайт'] || row['Website'] || '',
            specialization: (row['Специализация'] || row['Specialization'] || '')
              .split(';')
              .map((s: string) => s.trim())
              .filter((s: string) => s),
            segment: normalizeSegment(row['Сегмент'] || row['Segment'] || ''),
            description: row['Описание'] || row['Description'] || '',
            established: row['Год основания'] ? parseInt(row['Год основания']) : undefined,
          };

          factories.push(factory);
        }

        if (factories.length === 0) {
          reject(new Error('Не удалось найти данные о фабриках в CSV файле'));
          return;
        }

        resolve(factories);
      } catch (error) {
        reject(new Error(`Ошибка при парсинге CSV: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
    reader.readAsText(file, 'utf-8');
  });
};

export const importFromExcel = (file: File): Promise<ImportedFactory[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });

        if (workbook.SheetNames.length === 0) {
          reject(new Error('Excel файл не содержит листов'));
          return;
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

        if (rows.length === 0) {
          reject(new Error('Excel лист не содержит данных'));
          return;
        }

        const factories: ImportedFactory[] = rows.map((row) => ({
          name: row['Название фабрики'] || row['Name'] || 'Unknown',
          country: normalizeCountry(row['Страна'] || row['Country'] || ''),
          city: row['Город'] || row['City'] || '',
          phone: row['Телефон'] || row['Phone'] || '',
          email: row['Email'] || row['Email'] || undefined,
          website: row['Сайт'] || row['Website'] || '',
          specialization: typeof row['Специализация'] === 'string'
            ? row['Специализация']
                .split(';')
                .map((s: string) => s.trim())
                .filter((s: string) => s)
            : typeof row['Specialization'] === 'string'
              ? row['Specialization']
                  .split(';')
                  .map((s: string) => s.trim())
                  .filter((s: string) => s)
              : [],
          segment: normalizeSegment(row['Сегмент'] || row['Segment'] || ''),
          description: row['Описание'] || row['Description'] || '',
          established: row['Год основания'] ? parseInt(row['Год основания']) : undefined,
        }));

        resolve(factories);
      } catch (error) {
        reject(new Error(`Ошибка при парсинге Excel: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
    reader.readAsArrayBuffer(file);
  });
};
