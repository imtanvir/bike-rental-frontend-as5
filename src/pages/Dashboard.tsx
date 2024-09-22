import { useUserProfileQuery } from "@/redux/features/profile/profileApi";

const Dashboard = () => {
  const { data } = useUserProfileQuery(undefined);
  console.log({ data });
  return (
    <>
      <h1>This is dashboard and welcome here</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa alias
        soluta labore, quidem nam accusamus quasi voluptatem architecto error
        facilis!
      </p>
      {data?.user?.role === "admin" ? (
        <p className="text-red-500 text-4xl">Admin</p>
      ) : (
        <p className="text-blue-500 text-4xl">User</p>
      )}
    </>
  );
};

export default Dashboard;
