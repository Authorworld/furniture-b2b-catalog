import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Phone, User, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export function ContactFormDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
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
      // Имитация отправки
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Сохраняем данные в localStorage для истории
      const contactHistory = JSON.parse(localStorage.getItem('contactHistory') || '[]');
      contactHistory.push({
        ...formData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('contactHistory', JSON.stringify(contactHistory.slice(-10)));

      toast.success('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');

      // Очищаем форму
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setOpen(false);
    } catch (error) {
      toast.error('Ошибка при отправке сообщения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageSquare size={18} />
          Написать нам
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            Свяжитесь с нами
          </DialogTitle>
          <DialogDescription>
            Если у вас есть вопросы о каталоге или вы хотите добавить свою фабрику, напишите нам
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

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
              Компания
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="ООО Мебельный салон"
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
              placeholder="Напишите ваш вопрос или предложение..."
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
