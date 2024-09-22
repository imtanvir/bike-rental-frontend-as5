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
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  currentUser,
  setUser,
  userCurrentToken,
} from "@/redux/features/auth/authSlice";
import { useGetRentalsQuery } from "@/redux/features/booking/bookingApi";
import { TBooking } from "@/redux/features/booking/rentalSlice";
import { useUpdateUserProfileMutation } from "@/redux/features/profile/profileApi";
import { TUser } from "@/redux/features/profile/profileSlice";
import { lastLogInTime } from "@/utils/lastLoginTime";
import { MailIcon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { data, refetch } = useGetRentalsQuery(undefined);
  const currentToken = useAppSelector(userCurrentToken);
  const [updateProfile] = useUpdateUserProfileMutation();
  const user = useAppSelector(currentUser);
  console.log("User:", user);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [current_user, setCurrent_user] = useState({
    name: (user as TUser).name,
    email: (user as TUser).email,
    phone: (user as TUser).phone,
    address: (user as TUser).address,
    role: (user as TUser).role,
  });

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setCurrent_user((prevUser) => ({ ...prevUser, [name]: numericValue }));
    } else {
      setCurrent_user((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(!isProcessing);
    const toastId = toast.loading("Profile updating...");
    const response = await updateProfile(current_user);
    if (response?.data?.success === true) {
      dispatch(
        setUser({ user: { ...user, ...current_user }, token: currentToken })
      );
      toast.success("Profile updated successfully", { id: toastId });
      setIsProcessing(!isProcessing);
      setIsEditing(false);
    } else {
      toast.error("Something went wrong", { id: toastId });
    }
  };
  const createdAt = (user as TUser).createdAt;
  const accountOpenedDate = new Date(createdAt as string)
    .toUTCString()
    .slice(0, 17);
  const lastLogin = lastLogInTime((user as TUser).lastLogin as string);

  const rentStatus = {
    paid: 0,
    unpaid: 0,
  };
  const paidStatus = data?.data?.reduce(
    (acc: typeof rentStatus, obj: TBooking) => {
      if (obj.isPaid) {
        acc.paid += 1;
      } else {
        acc.unpaid += 1;
      }
      return acc;
    },
    rentStatus
  );

  console.log({ paidStatus });
  return (
    <>
      <div className="flex-1 p-10 space-y-6 overflow-y-auto poppins-regular">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Profile Dashboard</h1>
          <Button
            onClick={() => {
              setIsProcessing(false);
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
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
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{(user as TUser).name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MailIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{(user as TUser).email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{(user as TUser).phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{(user as TUser).address}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>Your recent activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Rented</span>
                  <span className="font-semibold">
                    {data?.data.length ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Paid Rent</span>
                  <span className="font-semibold">
                    {paidStatus?.paid ?? "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Rent</span>
                  <span className="font-semibold">
                    {paidStatus?.unpaid ?? "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>Overview of your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Member Since</span>
                  <span className="font-semibold">{accountOpenedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Login</span>
                  <span className="font-semibold">{lastLogin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Profile Role</span>
                  <span className="font-semibold capitalize">
                    {(user as TUser).role}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Updated profile picture</span>
                  <span className="text-sm text-muted-foreground">
                    2 days ago
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Posted a new article</span>
                  <span className="text-sm text-muted-foreground">
                    1 week ago
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Commented on a post</span>
                  <span className="text-sm text-muted-foreground">
                    2 weeks ago
                  </span>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </>
  );
};

export default Profile;
