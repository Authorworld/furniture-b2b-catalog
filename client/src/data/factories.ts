export interface Factory {
  id: string;
  name: string;
  city: string;
  country: 'Russia' | 'Belarus';
  segment: 'economy' | 'middle' | 'premium';
  specialization: string[];
  description: string;
  phone: string;
  email?: string;
  website: string;
  established?: string;
}

export const segments = {
  economy: 'Эконом',
  middle: 'Средний',
  premium: 'Премиум',
};

export const countries = {
  Russia: 'Россия',
  Belarus: 'Беларусь',
};

export const factories: Factory[] = [
  {
    id: '1',
    name: 'Мария',
    city: 'Саратов',
    country: 'Russia',
    segment: 'middle',
    specialization: ['Кухни', 'Шкафы', 'Ванные'],
    description: 'Один из крупнейших производителей кухонь в России. Компания предлагает широкий ассортимент мебели высокого качества с индивидуальным дизайном.',
    phone: '+7 (8452) 24-24-24',
    email: 'info@marya.ru',
    website: 'https://www.marya.ru',
    established: '1999',
  },
  {
    id: '2',
    name: 'Дятьково',
    city: 'Дятьково',
    country: 'Russia',
    segment: 'middle',
    specialization: ['Спальни', 'Гостиные', 'Прихожие'],
    description: 'Ведущий российский бренд мебели для дома. Собственное производство полного цикла позволяет гарантировать высокое качество продукции.',
    phone: '8 (800) 100-11-22',
    email: 'client@dyatkovo.ru',
    website: 'https://dyatkovo.ru',
    established: '1926',
  },
  {
    id: '3',
    name: 'ЗОВ',
    city: 'Гродно',
    country: 'Belarus',
    segment: 'middle',
    specialization: ['Кухни', 'Гостиные', 'Обеденные зоны'],
    description: 'Крупнейший белорусский производитель кухонной мебели. Известен своим инновационным подходом и использованием качественных материалов.',
    phone: '+375 (152) 79-90-00',
    email: 'info@zov.by',
    website: 'https://zov.by',
    established: '1997',
  },
  {
    id: '4',
    name: 'Пинскдрев',
    city: 'Пинск',
    country: 'Belarus',
    segment: 'middle',
    specialization: ['Мягкая мебель', 'Корпусная мебель', 'Матрасы'],
    description: 'Старейшее деревообрабатывающее предприятие Беларуси. Огромный выбор мебели из массива и других материалов.',
    phone: '+375 (165) 31-16-00',
    email: 'contact@pinskdrev.by',
    website: 'https://pinskdrev.by',
    established: '1880',
  },
  {
    id: '5',
    name: 'Mr.Doors',
    city: 'Кострома',
    country: 'Russia',
    segment: 'premium',
    specialization: ['Индивидуальная мебель', 'Шкафы-купе', 'Гардеробные'],
    description: 'Лидер в производстве индивидуальной мебели. Предлагает комплексные интерьерные решения для всего дома.',
    phone: '8 (800) 500-22-11',
    email: 'info@mrdoors.ru',
    website: 'https://www.mrdoors.ru',
    established: '1996',
  }
];
