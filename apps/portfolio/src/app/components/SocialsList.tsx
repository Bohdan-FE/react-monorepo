import { FaLinkedinIn } from 'react-icons/fa6';
import { GrInstagram } from 'react-icons/gr';
import { FaGithub } from 'react-icons/fa';
import { RiTelegram2Fill } from 'react-icons/ri';
import { BsWhatsapp } from 'react-icons/bs';

function SocialsList() {
  const socials = [
    { name: 'GitHub', url: 'https://github.com/Bohdan-FE', icon: <FaGithub /> },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/bohdan-vivchar',
      icon: <FaLinkedinIn />,
    },

    {
      name: 'Instagram',
      url: 'https://www.instagram.com/v.i.b.o',
      icon: <GrInstagram />,
    },
    {
      name: 'telegram',
      url: 'https://t.me/react321',
      icon: <RiTelegram2Fill />,
    },
    {
      name: 'Whatsapp',
      url: 'https://wa.me/+421911348794',
      icon: <BsWhatsapp />,
    },
  ];

  return (
    <ul className="flex gap-4">
      {socials.map((social) => (
        <li key={social.name} className="">
          <a
            href={social.url}
            aria-label={social.name}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-white/70 hover:text-[rgba(160,87,199,1)] hover:shadow-[0_0_10px_rgba(160,87,199,1)] hover:scale-115 origin-bottom rounded-full flex items-center justify-center border border-white/50 p-2 group hover:border-[rgba(160,87,199,1)] transition-all duration-300 ease-in-out"
          >
            {social.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default SocialsList;
