import { RiAttachment2 } from 'react-icons/ri';
import { useRef } from 'react';

function SendFile({ setFile }: { setFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const MAX_SIZE_MB = 5;

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > MAX_SIZE_MB) {
      alert(`File is too large. Max size is ${MAX_SIZE_MB}MB.`);
      e.target.value = '';
      return;
    }

    setFile(file);
    e.target.value = ''; // allow selecting same file again
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="px-3 rounded-md shadow-small flex items-center justify-center bg-orange active:shadow-none active:scale-95 transition-all"
      >
        <RiAttachment2 className="text-white text-lg" />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />
    </>
  );
}

export default SendFile;
