import ContactForm from './ContactForm';

function ContactModal() {
  return (
    <div className="w-full md:w-3xl pt-6">
      <h2 className="text-4xl font-bold mb-6 text-white text-center">
        Contact Me
      </h2>
      <ContactForm />
    </div>
  );
}

export default ContactModal;
