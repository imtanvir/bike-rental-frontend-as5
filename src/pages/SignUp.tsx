import FormCustom from "@/components/FormCustom";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignUpMutation } from "@/redux/features/auth/authAPi";
import { FieldValues } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUp] = useSignUpMutation();
  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Signing up");

    try {
      const userInfo = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await signUp(userInfo);

      toast.success("Sign up successful!", { id: toastId, duration: 2000 });
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <Card className="mx-auto max-w-sm mt-24">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormCustom onSubmit={onSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <FormInput
                name="name"
                type="text"
                placeholder="type your name"
                label="Name"
              />
            </div>
            <div className="space-y-2">
              <FormInput
                name="email"
                type="email"
                placeholder="ex: dhaka, bangladesh"
                label="Email"
              />
            </div>
            <div className="space-y-2">
              <FormInput
                name="phone"
                type="text"
                placeholder="+09666999"
                label="Phone"
              />
            </div>
            <div className="space-y-2">
              <FormInput
                name="address"
                type="text"
                placeholder="Dhaka, Bangladesh"
                label="Address"
              />
            </div>
            <div className="space-y-2">
              <FormInput
                name="password"
                type="password"
                placeholder="Type your password"
                label="Password"
              />
            </div>
            <div className="space-y-2">
              <FormInput
                name="confirm_password"
                type="password"
                placeholder="confirm your password"
                label="Confirm Password"
              />
            </div>

            <Button type="submit" className="w-full">
              Sigh up
            </Button>
            <div className="space-y-2">
              <span className="text-center text-sm">
                Already have an account?{" "}
                <Link className=" text-blue-500" to="/login">
                  Login
                </Link>
              </span>
            </div>
          </div>
        </FormCustom>
      </CardContent>
    </Card>
  );
};

export default SignUp;
