import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';

type FieldErrors = {
  [key: string]: string;
};

interface CF7Response {
  contact_form_id: number;
  status: string;
  message: string;
  invalid_fields?: Array<{
    field: string;
    message: string;
    idref: null;
    error_id: string;
  }>;
  posted_data_hash: string;
  into: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    yourname: '',
    youremail: '',
    yoursubject: '',
    yourmessage: '',
  });

  const [wpMessage, setWpMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    const API_URL = import.meta.env.VITE_API_URL;

    const formElement = e.target as HTMLFormElement;
    const body = new FormData(formElement);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: body,
      });
      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      const data: CF7Response = await res.json();
      console.log('Success:', data);
      setWpMessage(data.message);
      setStatus(data.status);

      if (data.invalid_fields) {
        const errors: FieldErrors = {};
        data.invalid_fields.forEach((field) => {
          errors[field.field] = field.message;
        });
        setFieldErrors(errors);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (wpMessage && status === 'mail_sent') {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>送信完了</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-500">{wpMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>お問い合わせ</CardTitle>
          <CardDescription>
            以下のフォームに必要事項をご記入ください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="_wpcf7" value="93" />
            <input type="hidden" name="_wpcf7_version" value="5.9.8" />
            <input type="hidden" name="_wpcf7_locale" value="ja" />
            <input
              type="hidden"
              name="_wpcf7_unit_tag"
              value="wpcf7-f93-p41-o1"
            />
            <input type="hidden" name="_wpcf7_container_post" value="" />

            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input
                type="text"
                id="name"
                name="yourname"
                value={formData.yourname}
                onChange={handleChange}
                required
              />
              {fieldErrors.yourname && (
                <p className="text-sm text-rose-500">{fieldErrors.yourname}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                type="email"
                id="email"
                name="youremail"
                value={formData.youremail}
                onChange={handleChange}
                required
              />
              {fieldErrors.youremail && (
                <p className="text-sm text-rose-500">{fieldErrors.youremail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">件名</Label>
              <Input
                type="text"
                id="subject"
                name="yoursubject"
                value={formData.yoursubject}
                onChange={handleChange}
                required
              />
              {fieldErrors.yoursubject && (
                <p className="text-sm text-rose-500">
                  {fieldErrors.yoursubject}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">メッセージ</Label>
              <Textarea
                id="message"
                name="yourmessage"
                value={formData.yourmessage}
                onChange={handleChange}
                required
              />
              {fieldErrors.yourmessage && (
                <p className="text-sm text-rose-500">
                  {fieldErrors.yourmessage}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  送信する
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {wpMessage && status !== 'mail_sent' && (
            <p className="text-rose-600">{wpMessage}</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
