import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { factories } from '@/data/factories';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Building2, Calendar, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { FeedbackForm } from '@/components/FeedbackForm';

export default function FactoryDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const factoryId = params.id;

  const factory = factories.find((f) => f.id === factoryId);

  if (!factory) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-primary mb-4">Фабрика не найдена</h1>
          <p className="text-secondary-foreground mb-6">К сожалению, информация о запрашиваемой фабрике недоступна.</p>
          <Button onClick={() => setLocation('/')} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Вернуться в каталог
          </Button>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован в буфер обмена`);
  };

  const getSegmentLabel = (segment: string) => {
    switch (segment) {
      case 'economy':
        return 'Эконом';
      case 'middle':
        return 'Средний';
      case 'premium':
        return 'Премиум';
      default:
        return segment;
    }
  };

  const getCountryLabel = (country: string) => {
    return country === 'Russia' ? 'Россия' : 'Беларусь';
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'economy':
        return 'bg-blue-100 text-blue-800';
      case 'middle':
        return 'bg-amber-100 text-amber-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Назад
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-serif font-bold text-primary">{factory.name}</h1>
            <p className="text-sm text-secondary-foreground">{factory.city}, {getCountryLabel(factory.country)}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card className="p-6 border-l-4 border-l-primary">
              <h2 className="text-xl font-serif font-bold text-primary mb-4">Основная информация</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-secondary-foreground">Местоположение</p>
                    <p className="font-medium">{factory.city}, {getCountryLabel(factory.country)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 size={20} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-secondary-foreground">Сегмент рынка</p>
                    <Badge className={`${getSegmentColor(factory.segment)} mt-1`}>
                      {getSegmentLabel(factory.segment)}
                    </Badge>
                  </div>
                </div>

                {factory.established && (
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-secondary-foreground">Год основания</p>
                      <p className="font-medium">{factory.established}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-secondary-foreground mb-2 font-medium">Специализация</p>
                  <div className="flex flex-wrap gap-2">
                    {factory.specialization.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-[11px] uppercase tracking-wider font-semibold bg-slate-50 text-slate-500 border-slate-200">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-serif font-bold text-primary mb-4">О фабрике</h2>
              <p className="text-secondary-foreground leading-relaxed">{factory.description}</p>
            </Card>

            {/* Projects Card */}
            {factory.projects && factory.projects.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-serif font-bold text-primary mb-4">Примеры работ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {factory.projects.map((project, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-xl border border-border">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium text-sm">{project.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Contacts */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="p-6 border-l-4 border-l-orange-500 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-primary mb-6">Контактная информация</h2>
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-orange-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-secondary-foreground mb-1">Телефон</p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${factory.phone}`}
                        className="font-medium text-primary hover:underline break-all"
                      >
                        {factory.phone}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(factory.phone, 'Телефон')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Email */}
                {factory.email && (
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-orange-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-secondary-foreground mb-1">Email</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${factory.email}`}
                          className="font-medium text-primary hover:underline break-all"
                        >
                          {factory.email}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(factory.email!, 'Email')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Website */}
                {factory.website && (
                  <div className="flex items-start gap-3">
                    <Globe size={20} className="text-orange-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-secondary-foreground mb-1">Официальный сайт</p>
                      <a
                        href={factory.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline break-all"
                      >
                        Перейти на сайт →
                      </a>
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="pt-4 border-t border-border space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => copyToClipboard(factory.phone, 'Контакты')}
                  >
                    Скопировать все контакты
                  </Button>
                  <FeedbackForm factoryName={factory.name} factoryPhone={factory.phone} />
                </div>
              </div>
            </Card>

            {/* Additional Info */}
            <Card className="p-6 bg-slate-50">
              <h3 className="font-serif font-bold text-primary mb-3">Информация</h3>
              <ul className="text-sm text-secondary-foreground space-y-2">
                <li>✓ Работает с дилерами и дизайнерами</li>
                <li>✓ Производство под заказ</li>
                <li>✓ Индивидуальные размеры</li>
                <li>✓ B2B сотрудничество</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card">
        <div className="container text-center text-sm text-secondary-foreground">
          <p>© 2026 B2B Каталог Мебельных Фабрик. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
