import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setUser, userCurrentToken } from "@/redux/features/auth/authSlice";
import { useUpdateUserProfileMutation } from "@/redux/features/profile/profileApi";
import { TUser } from "@/redux/features/profile/profileSlice";
import { TImage } from "@/types/intex";
import React, { ChangeEvent, useRef, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from "sonner";
const ProfileEditForm = ({
  user,
  isProcessing,
  setIsProcessing,
  setIsEditing,
}: {
  user: TUser;
  isProcessing: boolean;
  isEditing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const currentToken = useAppSelector(userCurrentToken);
  const [updateProfile] = useUpdateUserProfileMutation();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectUserImg, setSelectUserImg] = useState<{ image: File[] | null }>({
    image: null,
  });
  const [isNewImgSelected, setIsNewImgSelected] = useState(false);

  const [current_user, setCurrent_user] = useState({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    image: user.image,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setCurrent_user((prevUser) => ({ ...prevUser, [name]: numericValue }));
    } else {
      setCurrent_user((prevUser) => ({ ...prevUser, [name]: value }));
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(!isProcessing);
    const toastId = toast.loading("Profile updating...");
    const submissionData = new FormData();
    const userDataUpdateIntoDb = {
      name: current_user.name,
      image: (current_user?.image as TImage[]).map((img) =>
        isNewImgSelected === true ? { ...img, isRemove: true } : img
      ),
      email: current_user.email,
      phone: current_user.phone,
      address: current_user.address,
    };

    // Append other form data as JSON
    submissionData.append("data", JSON.stringify(userDataUpdateIntoDb));

    if (selectUserImg.image) {
      selectUserImg.image.forEach((file) => {
        submissionData.append("file", file);
      });
    }
    const queryData = {
      id: current_user._id,
      data: submissionData,
    };
    const response = await updateProfile(queryData);

    if (response?.data?.success === true) {
      dispatch(
        setUser({
          user: { ...user, ...response.data.data },
          token: currentToken,
        })
      );
      toast.success("Profile updated successfully", { id: toastId });
      //   if (formRef.current) {
      //     formRef.current.value = "";
      //   }
      setIsProcessing(!isProcessing);
      setIsEditing(false);
    } else {
      toast.error("Something went wrong", { id: toastId });
      setIsProcessing(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div
            className={`${
              isNewImgSelected === false ? "block" : "hidden"
            } w-20 h-20 rounded-full relative overflow-hidden hover:bottom-0 hover:transition-all image-circle `}
          >
            <img
              className="rounded-full w-full h-full"
              src={current_user?.image?.[0]?.url}
              alt={current_user?.name as string}
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
              className=" absolute right-0 rounded-lg top-1/2 -translate-y-1/2 bg-indigo-700 h-full w-10 flex justify-center items-center cursor-pointer"
              onClick={handleSelectImgRemove}
            >
              <IoCloseCircleOutline className="text-slate-50 text-2xl" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={current_user.name || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={current_user.email || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            value={current_user.phone || ""}
            onChange={handleInputChange}
            pattern="[0-9]*"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={current_user.address || ""}
            onChange={handleInputChange}
          />
        </div>

        <Button disabled={isProcessing} type="submit">
          Save Changes
        </Button>
      </form>
    </>
  );
};

export default ProfileEditForm;
