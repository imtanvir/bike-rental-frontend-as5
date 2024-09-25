const BikeSkeleton = () => {
  return (
    <>
      <div className=" flex flex-col dark:shadow-md gap-2 dark:bg-slate-900 bg-slate-300  rounded-md">
        <div className="relative w-full h-48 overflow-hidden animate-pulse">
          <div className="absolute inset-0 h-48 w-full dark:bg-slate-600 bg-slate-400 rounded object-cover"></div>
        </div>
        <div className="animate-pulse flex flex-col gap-2 p-3">
          <div className="rounded dark:bg-slate-700 bg-slate-400 h-3 w-20"></div>
          <div className="rounded bg-slate-400 dark:bg-slate-700 h-3 w-[60%]"></div>
        </div>
        <div className="rounded mb-3 mx-auto bg-slate-400 dark:bg-slate-700 h-7 w-[70%]"></div>
      </div>
    </>
  );
};

export default BikeSkeleton;
