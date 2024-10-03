import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

type TFormInput = {
  name: string;
  type: string;
  placeholder: string;
  label: string;
};
const FormInput = ({ name, type, placeholder, label }: TFormInput) => {
  const { register } = useFormContext();

  return (
    <>
      {label && <Label htmlFor={name}>{label}</Label>}
      {type === "file" ? (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          required
          accept="image/*"
          {...register(name)}
        />
      ) : (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          required
          {...register(name)}
        />
      )}
    </>
  );
};

export default FormInput;
