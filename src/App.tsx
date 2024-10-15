import { useState, useEffect } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    yourname: '',
    youremail: '',
    yoursubject: '',
    yourmessage: '',
  });
  const [unitTag, setUnitTag] = useState('');
  const [wpMessage, setWpMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Generate a unique unit tag when the component mounts
    setUnitTag(`wpcf7-f93-p1-o1-${Math.random().toString(36).slice(2, 11)}`);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const API_URL = import.meta.env.VITE_API_URL;

    const formElement = e.target as HTMLFormElement;
    const body = new FormData(formElement);
    body.append('_wpcf7_unit_tag', unitTag);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: body,
      });
      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      const data = await res.json();
      console.log('Success:', data);
      setWpMessage(data.message);
      setStatus(data.status);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (wpMessage && status === 'mail_sent') {
    return (
      <div className="max-w-md mx-auto mt-8">
        <p>送信しました！</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="_wpcf7" value="93" />
        <input type="hidden" name="_wpcf7_version" value="5.7.5.1" />
        <input type="hidden" name="_wpcf7_locale" value="ja" />
        <input type="hidden" name="_wpcf7_unit_tag" value={unitTag} />
        <input type="hidden" name="_wpcf7_container_post" value="0" />
        <div>
          <label htmlFor="name" className="block mb-1">
            名前:
          </label>
          <input
            type="text"
            id="name"
            name="yourname"
            value={formData.yourname}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            メールアドレス:
          </label>
          <input
            type="email"
            id="email"
            name="youremail"
            value={formData.youremail}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block mb-1">
            件名:
          </label>
          <input
            type="text"
            id="subject"
            name="yoursubject"
            value={formData.yoursubject}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-1">
            メッセージ:
          </label>
          <textarea
            id="message"
            name="yourmessage"
            value={formData.yourmessage}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          送信
        </button>
      </form>

      {wpMessage && status !== 'mail_sent' && (
        <div className="mt-4">
          <p className="text-rose-600">{wpMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
