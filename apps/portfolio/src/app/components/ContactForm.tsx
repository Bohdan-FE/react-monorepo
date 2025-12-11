import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ContactFormInputs {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>();

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      const res = await fetch('http://localhost:4252/mail/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result);
        toast.error('Failed to send message ❌');
        return;
      }
      toast.success('Message sent successfully! ✅');
      reset();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong ❌');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" p-6 flex flex-col w-full space-y-6"
    >
      <div className="flex flex-col gap-1">
        <label className="font-medium">Name</label>
        <input
          type="text"
          className="border rounded-xl p-2"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && (
          <span className="text-red-300 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Email</label>
        <input
          type="email"
          className="border rounded-xl p-2"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /[^@\s]+@[^@\s]+\.[^@\s]+/,
              message: 'Invalid email format',
            },
          })}
        />
        {errors.email && (
          <span className="text-red-300 text-sm">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Message</label>
        <textarea
          className="border rounded-xl p-3 h-32"
          {...register('message', { required: 'Message is required' })}
        />
        {errors.message && (
          <span className="text-red-300 text-sm">{errors.message.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="button w-fit ml-auto"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
