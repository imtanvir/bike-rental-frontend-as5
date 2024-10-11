import { TImage } from "@/types/intex";

export const formFieldValidation = (
  data: Record<string, any>,
  selectedImage: File[] | TImage[]
): { data: string | null; image: File[] | null } => {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Skip checking for 'image'
      if (key !== "image" && (data[key] === "" || data[key] === null)) {
        return { data: `Error: The ${key} field is empty.`, image: null };
      }
    }
  }

  // Check if selectedImage array is empty
  if (selectedImage.length === 0) {
    return { data: "No image has been selected.", image: null };
  }

  if (selectedImage.every((image) => image instanceof File)) {
    return { data: null, image: selectedImage as File[] };
  }

  return { data: null, image: null };
};
