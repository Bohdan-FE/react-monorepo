import { FaLinkedinIn } from 'react-icons/fa6';
import { GrInstagram } from 'react-icons/gr';
import { FaFacebook } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';

function SocialsList() {
  const socials = [
    { name: 'GitHub', url: '    ', icon: <FaGithub /> },
    { name: 'LinkedIn', url: '    ', icon: <FaLinkedinIn /> },
    { name: 'Facebook', url: '    ', icon: <FaFacebook /> },
    { name: 'Instagram', url: '    ', icon: <GrInstagram /> },
  ];

  return (
    <ul className="flex gap-4">
      {socials.map((social) => (
        <li key={social.name} className="">
          <a
            href={social.url}
            aria-label={social.name}
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
