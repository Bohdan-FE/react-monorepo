import { useMutation } from '@tanstack/react-query';
import { uploadImageMessage } from '../api/messages';

function useUploadImageMessage() {
  return useMutation({
    mutationFn: (file: File) => uploadImageMessage(file),
  });
}

export default useUploadImageMessage;
