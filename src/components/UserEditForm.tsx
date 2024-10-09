import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/hooks";
import { useUpdateUserByAdminMutation } from "@/redux/features/users/usersApi";
import { setAllUsers, TUser } from "@/redux/features/users/usersSlice";
import { TImage } from "@/types/intex";
import React, { ChangeEvent, useRef, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from "sonner";
import { Label } from "./ui/label";

const UserEditForm = ({
  allUsers,
  user,
  isProcessing,
  isEditing,
  setIsProcessing,
  setIsEditing,
}: {
  allUsers: TUser[];
  user: TUser;
  isProcessing: boolean;
  isEditing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [updateUser] = useUpdateUserByAdminMutation();
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState({
    _id: user._id,
    name: user.name,
    role: user.role,
    image: user.image,
    email: user.email,
    phone: user.phone,
    address: user.address,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectUserImg, setSelectUserImg] = useState<{ image: File[] | null }>({
    image: null,
  });
  const [isNewImgSelected, setIsNewImgSelected] = useState(false);

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
    } else if (name === "role") {
      setUserData((prevUser) => ({
        ...prevUser,
        [name]: value === "user" ? "user" : "admin",
      }));
    } else {
      setUserData((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setSelectUserImg((prevData) => ({
        ...prevData,
        image: fileList,
      }));
      setIsNewImgSelected(true);
    }
  };
  const handleSelectImgRemove = () => {
    setSelectUserImg((prevData) => ({
      ...prevData,
      image: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsNewImgSelected(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("User Data updating...");
    setIsProcessing(!isProcessing);
    const submissionData = new FormData();
    const userDataUpdateIntoDb = {
      name: userData.name,
      image: (userData?.image as TImage[]).map((img) =>
        isNewImgSelected === true ? { ...img, isRemove: true } : img
      ),
      role: userData.role,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
    };

    // Append other form data as JSON
    submissionData.append("data", JSON.stringify(userDataUpdateIntoDb));
    submissionData.append("_id", userData._id as string);

    if (selectUserImg.image) {
      selectUserImg.image.forEach((file) => {
        submissionData.append("file", file);
      });
    }
    const queryData = {
      id: userData._id,
      data: submissionData,
    };
    const response = await updateUser(queryData);
    if (response?.data?.success === true) {
      const updatedBikes = allUsers.map((user) =>
        user._id === response?.data?.data?._id
          ? { ...user, ...response.data.data }
          : user
      );

      dispatch(setAllUsers({ data: updatedBikes }));

      toast.success("User updated successfully", {
        id: toastId,
        duration: 2000,
        className: "bg-green-500 text-white border-green-400",
      });
      setIsProcessing(false);
      setIsEditing(false);
    } else {
      toast.error("Something went wrong", { id: toastId });
      setIsProcessing(false);
    }
  };
  return (
    <section className="dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-50 bg-gradient-to-b from-green-50 to-blue-50 px-5 py-10 mt-5 shadow-md rounded-md">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <h1 className=" bebas-neue-regular text-3xl">Edit User Details</h1>
        </div>
        <Button
          className=" bg-orange-400 hover:bg-orange-500 dark:text-slate-900 p-medium "
          onClick={() => {
            setIsProcessing(false);
            setIsEditing(!isEditing);
          }}
        >
          Cancel
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2 ">
        <div className="space-y-2">
          <div
            className={`${
              isNewImgSelected === false ? "block" : "hidden"
            } w-20 h-20 rounded-full relative overflow-hidden hover:bottom-0 hover:transition-all image-circle `}
          >
            <img
              className="rounded-full w-full h-full"
              src={userData?.image?.[0]?.url}
              alt={userData?.name as string}
            />
            <Label
              htmlFor="image"
              className="edit-img absolute h-1/2 w-full -bottom-[50%] transition bg-white opacity-50 flex justify-center items-start pt-2 text-base"
            >
              <FaPen className="text-slate-900" />
            </Label>
          </div>
          <div className={`${isNewImgSelected ? "block" : "hidden"} relative`}>
            <Input
              ref={fileInputRef}
              type="file"
              id="image"
              onChange={handleFileChange}
              required={isNewImgSelected}
              accept="image/*"
            />
            <div
              className=" absolute right-0 rounded-lg top-1/2 -translate-y-1/2 bg-indigo-700 h-full w-[5%] flex justify-center items-center cursor-pointer"
              onClick={handleSelectImgRemove}
            >
              <IoCloseCircleOutline className="text-slate-50 text-2xl" />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              className="dark:bg-slate-900"
              id="name"
              name="name"
              value={userData.name as string}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="dark:bg-slate-900"
              id="email"
              name="email"
              type="email"
              value={userData.email as string}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              className="dark:bg-slate-900"
              id="address"
              name="address"
              value={userData.address as string}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              className="dark:bg-slate-900"
              id="phone"
              name="phone"
              value={userData.phone as string}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available">Role</Label>
            <select
              id="role"
              name="role"
              value={`${userData.role}`}
              onChange={handleInputChange}
              className="w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md bg-white dark:bg-slate-900 border"
            >
              <option key={"true"} value={"user"}>
                User
              </option>
              <option key={"false"} value={"admin"}>
                Admin
              </option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            className="bg-indigo-800 text-white hover:bg-indigo-700  dark:text-slate-100 w-full"
            disabled={isProcessing}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </section>
  );
};

export default UserEditForm;
