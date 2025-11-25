import { useCallback, useState } from 'react';

import { useUser } from '../../../hooks/useUser';
import { FiDownload } from 'react-icons/fi';

function UploadAvatar({
  image,
  setImage,
}: {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { data: user } = useUser();

  const handleFile = (file: any) => {
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      alert('File is too large. Maximum allowed size is 2MB.');
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, []);

  return (
    <div className="flex gap-4 items-center">
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={onDrop}
        className={`
          rounded-full  text-center cursor-pointer relative
          transition-all
         size-22
          bg-white
          border-2 shadow-small
            ${dragActive ? 'border-blue-500' : 'border-black'}
        `}
        onClick={() => document.getElementById('avatarInput')?.click()}
      >
        <img
          src={preview || user?.avatarURL}
          alt="Avatar Preview"
          className="size-full object-center  mx-auto rounded-full object-cover shadow-md"
        />

        <div className="absolute inset-0 m-auto size-full flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 rounded-full text-white transition-opacity">
          <FiDownload className="text-2xl" />
        </div>
      </div>
      <div>
        <p className="mb-1 text-md font-semibold">Update Avatar</p>
        <p className="italic text-sm">
          {' '}
          Drag & drop image <br /> or click to upload
        </p>
      </div>

      <input
        id="avatarInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

export default UploadAvatar;
