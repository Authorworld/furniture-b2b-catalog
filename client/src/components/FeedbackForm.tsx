import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Mail, Phone, User, Send } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackFormProps {
  factoryName?: string;
  factoryPhone?: string;
}

export function FeedbackForm({ factoryName, factoryPhone }: FeedbackFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!formData.name.trim()) {
      toast.error('Пожалуйста, введите ваше имя');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Пожалуйста, введите ваш email');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Пожалуйста, введите сообщение');
      return;
    }

    setLoading(true);

    try {
      // Имитация отправки (в реальном приложении здесь был бы API запрос)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Создание mailto ссылки для отправки
      const subject = `Запрос от ${formData.name} - ${factoryName ? `Фабрика: ${factoryName}` : 'B2B Каталог'}`;
      const body = `
Имя: ${formData.name}
Email: ${formData.email}
Телефон: ${formData.phone || 'Не указан'}
${factoryName ? `\nФабрика: ${factoryName}` : ''}

Сообщение:
${formData.message}
      `.trim();

      // Копируем информацию в буфер обмена и показываем инструкцию
      const mailtoLink = `mailto:${factoryPhone ? 'info@factory.ru' : 'info@mebel-catalog.ru'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Сохраняем данные в localStorage для истории
      const feedbackHistory = JSON.parse(localStorage.getItem('feedbackHistory') || '[]');
      feedbackHistory.push({
        ...formData,
        factoryName,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory.slice(-10)));

      toast.success('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');

      // Очищаем форму
      setFormData({ name: '', email: '', phone: '', message: '' });
      setOpen(false);

      // Открываем mailto (опционально)
      // window.location.href = mailtoLink;
    } catch (error) {
      toast.error('Ошибка при отправке сообщения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 w-full">
          <MessageCircle size={18} />
          Отправить сообщение
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle size={20} className="text-primary" />
            Форма обратной связи
          </DialogTitle>
          <DialogDescription>
            {factoryName
              ? `Отправьте сообщение фабрике "${factoryName}"`
              : 'Свяжитесь с нами для уточнения информации'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-primary" />
                Ваше имя *
              </div>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Иван Петров"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                Email *
              </div>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ivan@example.com"
              required
              disabled={loading}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                Телефон
              </div>
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              disabled={loading}
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Сообщение *
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Опишите ваш запрос, интересующие типы мебели, объемы заказов..."
              rows={5}
              required
              disabled={loading}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Отправить
                </>
              )}
            </Button>
          </div>

          {/* Info */}
          <p className="text-xs text-secondary-foreground text-center">
            * Обязательные поля. Ваши данные будут использованы только для связи с вами.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
