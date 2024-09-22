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
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        required
        {...register(name)}
      />
    </>
  );
};

export default FormInput;
