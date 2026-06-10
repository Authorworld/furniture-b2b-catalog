import { Factory } from '@/data/factories';
import * as XLSX from 'xlsx';

export const exportToCSV = (factories: Factory[], filename: string = 'factories.csv') => {
  // Подготовка данных для CSV
  const csvData = factories.map((factory) => ({
    'Название фабрики': factory.name,
    'Страна': factory.country === 'Russia' ? 'Россия' : 'Беларусь',
    'Город': factory.city,
    'Телефон': factory.phone,
    'Email': factory.email || '',
    'Сайт': factory.website,
    'Специализация': factory.specialization.join('; '),
    'Сегмент': factory.segment === 'economy' ? 'Эконом' : factory.segment === 'middle' ? 'Средний' : 'Премиум',
    'Описание': factory.description,
  }));

  // Преобразование в CSV
  const headers = Object.keys(csvData[0]);
  const csvContent = [
    headers.join(','),
    ...csvData.map((row) =>
      headers
        .map((header) => {
          const value = row[header as keyof typeof row];
          // Экранирование значений с кавычками
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\n');

  // Скачивание файла
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (factories: Factory[], filename: string = 'factories.xlsx') => {
  // Подготовка данных для Excel
  const excelData = factories.map((factory) => ({
    'Название фабрики': factory.name,
    'Страна': factory.country === 'Russia' ? 'Россия' : 'Беларусь',
    'Город': factory.city,
    'Телефон': factory.phone,
    'Email': factory.email || '',
    'Сайт': factory.website,
    'Специализация': factory.specialization.join('; '),
    'Сегмент': factory.segment === 'economy' ? 'Эконом' : factory.segment === 'middle' ? 'Средний' : 'Премиум',
    'Описание': factory.description,
  }));

  // Создание рабочей книги
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Фабрики');

  // Установка ширины колонок
  const colWidths = [
    { wch: 25 }, // Название фабрики
    { wch: 12 }, // Страна
    { wch: 15 }, // Город
    { wch: 18 }, // Телефон
    { wch: 25 }, // Email
    { wch: 25 }, // Сайт
    { wch: 30 }, // Специализация
    { wch: 12 }, // Сегмент
    { wch: 50 }, // Описание
  ];
  worksheet['!cols'] = colWidths;

  // Форматирование заголовков
  const headerStyle = {
    fill: { fgColor: { rgb: 'FF2C3E50' } },
    font: { bold: true, color: { rgb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  };

  // Применение стиля к заголовкам
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1';
    if (!worksheet[address]) continue;
    worksheet[address].s = headerStyle;
  }

  // Скачивание файла
  XLSX.writeFile(workbook, filename);
};
