import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useStorage = () => {
  const generateUploadUrl = useMutation(api.listings.generateUploadUrl);

  const uploadFile = async (file: File) => {
    const uploadUrl = await generateUploadUrl();
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    return storageId;
  };

  return {
    uploadFile,
  };
};
