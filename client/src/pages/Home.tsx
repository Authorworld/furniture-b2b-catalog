import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { factories as initialFactories, segments, countries, Factory } from '@/data/factories';
import { Copy, MapPin, Phone, Globe, Mail, Download, Upload, ChevronRight, Info, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV, exportToExcel } from '@/lib/exportUtils';
import { ImportDialog } from '@/components/ImportDialog';
import { ContactFormDialog } from '@/components/ContactFormDialog';
import { ImportedFactory } from '@/lib/importUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CountryFilter = 'all' | 'Russia' | 'Belarus';
type SegmentFilter = 'all' | 'economy' | 'middle' | 'premium';

export default function Home() {
  const [, setLocation] = useLocation();
  const [allFactories, setAllFactories] = useState<Factory[]>(initialFactories);
  const [countryFilter, setCountryFilter] = useState<CountryFilter>('all');
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilter>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Получаем все уникальные специализации
  const allSpecializations = useMemo(() => {
    const specs = new Set<string>();
    allFactories.forEach(f => f.specialization.forEach(s => specs.add(s)));
    return Array.from(specs).sort();
  }, [allFactories]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [allSpecializations]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredFactories = useMemo(() => {
    return allFactories.filter((factory) => {
      const matchCountry = countryFilter === 'all' || factory.country === countryFilter;
      const matchSegment = segmentFilter === 'all' || factory.segment === segmentFilter;
      const matchTags = selectedTags.length === 0 || selectedTags.every(tag => factory.specialization.includes(tag));
      const matchSearch =
        factory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        factory.specialization.some((spec) =>
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCountry && matchSegment && matchTags && matchSearch;
    });
  }, [countryFilter, segmentFilter, selectedTags, searchQuery, allFactories]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован в буфер обмена`);
  };

  const handleImport = (importedFactories: ImportedFactory[]) => {
    // Добавляем импортированные фабрики к существующим
    const newFactories = importedFactories.map((factory, index) => ({
      ...factory,
      id: `imported-${Date.now()}-${index}`,
    } as Factory));

    setAllFactories([...allFactories, ...newFactories]);
    toast.success(`Добавлено ${newFactories.length} новых фабрик`);
  };

  const getSegmentBadgeColor = (segment: string) => {
    switch (segment) {
      case 'economy':
        return 'bg-slate-200 text-slate-900';
      case 'middle':
        return 'bg-amber-100 text-amber-900';
      case 'premium':
        return 'bg-amber-200 text-amber-900';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  const getCountryBadgeColor = (country: string) => {
    return country === 'Russia' ? 'bg-blue-100 text-blue-900' : 'bg-red-100 text-red-900';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <h1 className="text-4xl font-serif font-bold text-primary">B2B Каталог Мебельных Фабрик</h1>
            </div>
            <ContactFormDialog />
          </div>
          <p className="text-secondary-foreground ml-6">
            Надежные производители корпусной мебели России и Беларуси для дилеров и дизайнеров
          </p>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Поиск по названию, городу или специализации
              </label>
              <Input
                placeholder="Введите название фабрики, город или тип мебели..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="relative group">
            <label className="block text-sm font-medium text-foreground mb-3">
              Специализация
            </label>

            <div className="relative flex items-center">
              {showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-0 flex items-center z-10 pr-12 bg-gradient-to-r from-background via-background/90 to-transparent pointer-events-none">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white shadow-lg border-slate-200 hover:bg-slate-50 pointer-events-auto"
                    onClick={() => scroll('left')}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                </div>
              )}

              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex gap-2 overflow-x-auto py-1 scrollbar-hide no-scrollbar scroll-smooth w-full"
              >
                <Button
                  variant={selectedTags.length === 0 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="whitespace-nowrap rounded-full shrink-0"
                >
                  Все теги
                </Button>
                {allSpecializations.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="whitespace-nowrap rounded-full transition-all duration-200 shrink-0"
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              {showRightArrow && (
                <div className="absolute right-0 top-0 bottom-0 flex items-center z-10 pl-12 bg-gradient-to-l from-background via-background/90 to-transparent pointer-events-none">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white shadow-lg border-slate-200 hover:bg-slate-50 pointer-events-auto"
                    onClick={() => scroll('right')}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Страна
              </label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={countryFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setCountryFilter('all')}
                  className="transition-all duration-200"
                >
                  Все страны
                </Button>
                <Button
                  variant={countryFilter === 'Russia' ? 'default' : 'outline'}
                  onClick={() => setCountryFilter('Russia')}
                  className="transition-all duration-200"
                >
                  Россия
                </Button>
                <Button
                  variant={countryFilter === 'Belarus' ? 'default' : 'outline'}
                  onClick={() => setCountryFilter('Belarus')}
                  className="transition-all duration-200"
                >
                  Беларусь
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="block text-sm font-medium text-foreground">
                  Ценовой сегмент
                </label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="p-4 max-w-sm bg-white text-primary border border-border shadow-xl" side="right">
                    <div className="space-y-3">
                      <div>
                        <p className="font-bold text-sm text-blue-700">Эконом</p>
                        <p className="text-xs text-secondary-foreground leading-relaxed">
                          Бюджетные решения из ЛДСП и стандартных материалов. Базовая функциональность по доступной цене.
                          <br/><span className="font-medium text-primary">Диапазон: до 60 000 ₽</span>
                        </p>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className="font-bold text-sm text-amber-600">Средний</p>
                        <p className="text-xs text-secondary-foreground leading-relaxed">
                          Баланс цены и качества. Качественная фурнитура, расширенный выбор фасадов (МДФ, пленка, пластик).
                          <br/><span className="font-medium text-primary">Диапазон: 60 000 — 200 000 ₽</span>
                        </p>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className="font-bold text-sm text-purple-700">Премиум</p>
                        <p className="text-xs text-secondary-foreground leading-relaxed">
                          Эксклюзивные материалы (массив, шпон, эмаль), дизайнерская фурнитура и сложные индивидуальные проекты.
                          <br/><span className="font-medium text-primary">Диапазон: от 200 000 ₽</span>
                        </p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={segmentFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setSegmentFilter('all')}
                  className="transition-all duration-200"
                >
                  Все сегменты
                </Button>
                <Button
                  variant={segmentFilter === 'economy' ? 'default' : 'outline'}
                  onClick={() => setSegmentFilter('economy')}
                  className="transition-all duration-200"
                >
                  Эконом
                </Button>
                <Button
                  variant={segmentFilter === 'middle' ? 'default' : 'outline'}
                  onClick={() => setSegmentFilter('middle')}
                  className="transition-all duration-200"
                >
                  Средний
                </Button>
                <Button
                  variant={segmentFilter === 'premium' ? 'default' : 'outline'}
                  onClick={() => setSegmentFilter('premium')}
                  className="transition-all duration-200"
                >
                  Премиум
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-secondary-foreground">
            Найдено фабрик: <span className="font-semibold text-primary">{filteredFactories.length}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Импорт
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                exportToCSV(filteredFactories, 'mebelnye-fabriki.csv');
                toast.success('Каталог экспортирован в CSV');
              }}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                exportToExcel(filteredFactories, 'mebelnye-fabriki.xlsx');
                toast.success('Каталог экспортирован в Excel');
              }}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Excel
            </Button>
          </div>
        </div>

        {filteredFactories.length > 0 ? (
          <div className="space-y-4">
            {filteredFactories.map((factory, index) => (
              <div
                key={factory.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setLocation(`/factory/${factory.id}`)}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-accent">
                  <div className="grid gap-4 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <h3 className="text-lg font-serif font-bold text-primary mb-2">
                        {factory.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-secondary-foreground mb-3">
                        <MapPin size={16} className="text-accent" />
                        <span>{factory.city}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getCountryBadgeColor(factory.country)}>
                          {countries[factory.country as keyof typeof countries]}
                        </Badge>
                        <Badge className={getSegmentBadgeColor(factory.segment)}>
                          {segments[factory.segment as keyof typeof segments]}
                        </Badge>
                      </div>
                    </div>

                    <div className="md:col-span-5">
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-secondary-foreground uppercase tracking-wide mb-2">
                          Специализация
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {factory.specialization.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-[10px] uppercase tracking-wider font-semibold bg-slate-50 text-slate-500 border-slate-200 py-0 px-2 h-5">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{factory.description}</p>
                    </div>

                    <div className="md:col-span-4">
                      <p className="text-xs font-semibold text-secondary-foreground uppercase tracking-wide mb-3">
                        Контакты
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-accent flex-shrink-0" />
                          <button
                            onClick={() => copyToClipboard(factory.phone, 'Телефон')}
                            className="text-sm text-primary hover:text-accent font-medium transition-colors truncate flex-1 text-left"
                            title={factory.phone}
                          >
                            {factory.phone}
                          </button>
                          <Copy
                            size={14}
                            className="text-secondary-foreground hover:text-accent cursor-pointer flex-shrink-0"
                            onClick={() => copyToClipboard(factory.phone, 'Телефон')}
                          />
                        </div>

                        {factory.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-accent flex-shrink-0" />
                            <button
                              onClick={() => copyToClipboard(factory.email!, 'Email')}
                              className="text-sm text-primary hover:text-accent font-medium transition-colors truncate flex-1 text-left"
                              title={factory.email}
                            >
                              {factory.email}
                            </button>
                            <Copy
                              size={14}
                              className="text-secondary-foreground hover:text-accent cursor-pointer flex-shrink-0"
                              onClick={() => copyToClipboard(factory.email!, 'Email')}
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Globe size={16} className="text-accent flex-shrink-0" />
                          <a
                            href={factory.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-accent font-medium transition-colors truncate flex-1"
                            title={factory.website}
                          >
                            Сайт
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-secondary-foreground text-lg">
              Фабрики не найдены. Попробуйте изменить фильтры или поисковый запрос.
            </p>
          </Card>
        )}
      </main>

      <footer className="border-t border-border bg-white mt-16">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h4 className="font-serif font-bold text-primary mb-3">О каталоге</h4>
              <p className="text-sm text-secondary-foreground">
                Актуальная база данных надежных производителей корпусной мебели России и Беларуси, работающих в B2B-сегменте.
              </p>
            </div>
            <div>
              <h4 className="font-serif font-bold text-primary mb-3">Критерии отбора</h4>
              <ul className="text-sm text-secondary-foreground space-y-1">
                <li>✓ Производство под заказ и по индивидуальным размерам</li>
                <li>✓ Работа с дилерами и дизайнерами</li>
                <li>✓ Проверенные контакты и актуальная информация</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold text-primary mb-3">Обновление данных</h4>
              <p className="text-sm text-secondary-foreground">
                Информация актуальна на июнь 2026 года. Рекомендуем уточнять условия сотрудничества непосредственно на сайтах фабрик.
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-secondary-foreground">
            <p>© 2026 B2B Каталог Мебельных Фабрик. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Import Dialog */}
      <ImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} onImport={handleImport} />
    </div>
  );
}
