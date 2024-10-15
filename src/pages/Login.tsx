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
import { useAppDispatch } from "@/hooks/hooks";
import { useLoginMutation } from "@/redux/features/auth/authAPi";
import { setUser } from "@/redux/features/auth/authSlice";
import { TUser } from "@/redux/features/profile/profileSlice";
import { TError } from "@/types/intex";
import { verifyToken } from "@/utils/verifyToken";
import { useEffect } from "react";
import { FieldValues } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const dispatch = useAppDispatch();
  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Logging in");

    try {
      const userInfo = {
        email: data.email,
        password: data.password,
      };
      const response = await login(userInfo).unwrap();
      const user = verifyToken(response.token) as TUser;
      dispatch(setUser({ user: user, token: response.token }));

      toast.success("Logged in", { id: toastId, duration: 2000 });
      navigate("/");
    } catch (error) {
      const errorAsTError = error as TError;
      if (
        errorAsTError.status === 401 ||
        errorAsTError.status === 404 ||
        errorAsTError.status
      ) {
        toast.error(errorAsTError.data?.message, {
          id: toastId,
          duration: 2000,
          className: "bg-red-500 text-white border-red-400",
        });
      } else {
        toast.error("Something went wrong!", { id: toastId, duration: 2000 });
      }
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="md:py-32 flex items-center  md:h-auto h-[70vh] py-16 dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50">
      <Card className="mx-auto max-w-sm md:mt-24 shadow-lg">
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
                  name="email"
                  type="email"
                  placeholder="type you email"
                  label="Email"
                />
              </div>
              <div className="space-y-2">
                <FormInput
                  name="password"
                  type="password"
                  placeholder="enter your password"
                  label="Password"
                />
              </div>

              <Button
                type="submit"
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-indigo-800 text-white hover:bg-indigo-700"
              >
                Login
              </Button>
              <div className="space-y-2">
                <span className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link className=" text-blue-500" to="/signup">
                    Sign up
                  </Link>
                </span>
              </div>
            </div>
          </FormCustom>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
