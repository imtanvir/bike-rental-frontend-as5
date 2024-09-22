import { ReactNode } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

type TFromCustom = {
  onSubmit: SubmitHandler<FieldValues>;
  children: ReactNode;
};
const FormCustom = ({ onSubmit, children }: TFromCustom) => {
  const payload = { email: "linux@example.com", password: "password123" };

  const methods = useForm({
    defaultValues: payload,
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default FormCustom;
