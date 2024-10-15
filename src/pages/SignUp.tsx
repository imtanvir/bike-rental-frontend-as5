import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUpMutation } from "@/redux/features/auth/authAPi";
import { TError, TErrorResponse } from "@/types/intex";
import { formFieldValidation } from "@/utils/formFiledValidation";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUp] = useSignUpMutation();

  const [isError, setIsError] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    image: null,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [selectUserImg, setSelectUserImg] = useState<{ image: File[] | null }>({
    image: null,
  });
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setUserData((prevUser) => ({
        ...prevUser,
        [name]: numericValue,
      }));
    } else {
      setUserData((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList: File[] = Array.from(e.target.files);
      setSelectUserImg((prevData) => ({
        ...prevData,
        image: fileList,
      }));
    }
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError("");

    const formValidation = formFieldValidation(
      userData,
      selectUserImg.image as File[]
    );
    const toastId = toast.loading("Signing up");
    if (userData.password !== userData.confirmPassword) {
      setIsError("Passwords do not match with confirm password!");

      toast.error("Passwords do not match", {
        id: toastId,
        duration: 2000,
        className: "bg-red-500 text-white border-red-400",
      });
      return;
    } else if (formValidation.data) {
      toast.error(" Please fill all the required fields", {
        id: toastId,
        duration: 2000,
        className: "bg-red-500 text-white border-red-400",
      });
      return;
    }

    try {
      const submissionData = new FormData();
      const userInfo = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        address: userData.address,
      };

      // Append other form data as JSON
      submissionData.append("data", JSON.stringify(userInfo));

      if (selectUserImg.image) {
        selectUserImg.image.forEach((file) => {
          submissionData.append("file", file);
        });
      }

      const response = await signUp(submissionData);

      if (response?.data?.success === true) {
        toast.success("User updated successfully", {
          id: toastId,
          duration: 2000,
          className: "bg-green-500 text-white border-green-400",
        });
        navigate("/login");
      } else {
        const errorAsTError = response as TErrorResponse;
        if (errorAsTError.error.status) {
          toast.error(errorAsTError?.error?.data?.message, {
            id: toastId,
            duration: 2000,
            className: "bg-red-500 text-white border-red-400",
          });
        } else {
          toast.error("Something went wrong!", { id: toastId, duration: 2000 });
        }
      }
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
  return (
    <section className="flex items-center py-20 dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  NAME
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={userData.name}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="type your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  EMAIL
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={userData.email}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ex: dhaka, bangladesh"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  PHONE
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={userData.phone}
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="+09666999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  ADDRESS
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={userData.address}
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Dhaka, Bangladesh"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  PHOTO
                </Label>
                <Input
                  onChange={handleFileChange}
                  id="image"
                  name="image"
                  type="file"
                  placeholder="Select your photo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  PASSWORD
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={userData.password}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Type your password"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirm_password"
                  className="text-sm font-medium"
                >
                  CONFIRM PASSWORD
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={userData.confirmPassword}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="confirm your password"
                />
                <p
                  className={`text-sm ${
                    isError ? "block" : "hidden"
                  } text-red-500 `}
                >
                  {isError ?? ""}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-indigo-800 text-white hover:bg-indigo-700"
              >
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
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default SignUp;
