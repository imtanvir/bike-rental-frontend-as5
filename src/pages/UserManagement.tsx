import { RiDeleteBin6Line } from "react-icons/ri";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IoMdClose } from "react-icons/io";

import NoDataAvailable from "@/components/NoDataAvailable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserEditForm from "@/components/UserEditForm";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  useDeleteUserByAdminMutation,
  useGetAllUserQuery,
} from "@/redux/features/users/usersApi";
import {
  currentAllUser,
  setAllUsers,
  TUser,
} from "@/redux/features/users/usersSlice";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "sonner";

const UserManagement = () => {
  const dispatch = useAppDispatch();
  const { data, refetch } = useGetAllUserQuery(undefined);
  const [deleteUser] = useDeleteUserByAdminMutation();
  const allUsers = useAppSelector(currentAllUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

  useEffect(() => {
    if (data?.data) {
      dispatch(setAllUsers({ data: data?.data }));
    }
  }, [data, dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const roles = ["user", "admin", "superAdmin"];
  const handleDeleteUser = async (id: string) => {
    setIsProcessing(!isProcessing);
    const toastId = toast.loading("User deleting...");
    const response = await deleteUser(id);
    if (response?.data?.success === true) {
      const updatedUsers = allUsers?.filter((user) => user._id !== id && user);

      dispatch(setAllUsers({ data: updatedUsers }));

      toast.success("User deleted successfully", {
        id: toastId,
        duration: 2000,
        className: "bg-green-500 text-white border-green-400",
      });
      setIsProcessing(!isProcessing);
    } else {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
  });

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const target = event.target;
    const { name, value } = target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredUsers = allUsers?.filter(
    (user: TUser) =>
      (user.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.role === "all" || user.role === filters.role)
  );
  return (
    <section className="container mx-auto">
      {isEditing ? (
        <UserEditForm
          allUsers={allUsers as TUser[]}
          user={selectedUser as TUser}
          isProcessing={isProcessing}
          isEditing={isEditing}
          setIsProcessing={setIsProcessing}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className="px-2">
          <div className="w-full border rounded-lg overflow-hidden shadow-md">
            <div className="relative">
              <div className="flex flex-col sm:flex-row gap-4 my-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search bikes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" dark:bg-slate-800 dark:text-slate-300"
                  />
                </div>
                <Button className="dark:bg-indigo-800 dark:text-slate-300">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className=" bg-indigo-50 dark:bg-slate-800 p-4 shadow">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Filter options</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                          <label htmlFor="role" className="mr-2">
                            Role
                          </label>
                          <select
                            id="role"
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
                            className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                          >
                            <option value="all">All User</option>
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <Table>
                <TableHeader className="sticky top-0 z-10 dark:bg-slate-700  bg-indigo-700 hover:bg-indigo-700 ">
                  <TableRow className="text-center flex flex-row justify-around items-center hover:bg-indigo-700 dark:hover:bg-slate-700">
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      User
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Name
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Email
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Phone
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Role
                    </TableHead>
                    <TableHead className="md:flex-1 flex-auto text-center text-slate-50 pt-4 box-border">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <Table>
                <TableBody>
                  {filteredUsers?.length !== 0 &&
                    filteredUsers?.map((item: TUser) => (
                      <TableRow
                        key={item._id}
                        className="dark:hover:bg-slate-800 text-center flex flex-row justify-around items-center"
                      >
                        <TableCell className="font-medium md:flex-1 flex-auto flex justify-center">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <div className="cursor-pointer rounded-lg flex justify-center items-center overflow-hidden w-20 h-20">
                                <img
                                  className="w-20 h-20 object-cover rounded-lg transition hover:transition-transform hover:scale-125"
                                  src={`${item?.image?.[0]?.url}`}
                                  alt={item.name as string}
                                />
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="flex flex-col items-end">
                              <AlertDialogCancel className="w-10 h-10 p-0">
                                <IoMdClose className="text-xl" />
                              </AlertDialogCancel>
                              <img
                                src={`${item?.image?.[0]?.url}`}
                                alt={item.name as string}
                              />
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item.name}
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item.email}
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item.phone}
                        </TableCell>
                        <TableCell className="md:flex-1 flex-auto text-center">
                          {item.role}
                        </TableCell>
                        <TableCell className="w-[150px] text-center flex gap-2 justify-center">
                          <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-slate-100"
                            onClick={() => {
                              setIsEditing(true);
                              setSelectedUser(item);
                            }}
                          >
                            <FaRegEdit />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="bg-red-600 hover:bg-red-700 text-slate-100">
                                <RiDeleteBin6Line />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-red-500 border-red-500 text-slate-100 w-[90%]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="md:text-2xl text-xl p-bold text-slate-100 dark:text-slate-900 flex gap-6 items-center">
                                  Are you absolutely sure? <RiDeleteBin6Line />
                                </AlertDialogTitle>
                                <AlertDialogDescription className="dark:text-slate-800 text-base text-start text-slate-200 poppins-regular">
                                  This action cannot be undone. This will
                                  permanently delete the Bike data!
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className=" bg-orange-400 hover:bg-orange-500 dark:text-slate-900 p-medium border-orange-400 hover:border-orange-500">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteUser(item._id as string)
                                  }
                                  className="bg-indigo-800 text-white hover:bg-indigo-700  dark:text-slate-100 "
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
      {filteredUsers?.length === 0 && <NoDataAvailable />}
    </section>
  );
};

export default UserManagement;
