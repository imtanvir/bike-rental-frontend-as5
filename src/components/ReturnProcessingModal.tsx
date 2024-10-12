import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const ReturnProcessingModal = ({
  isReturnModalOpen,
  setIsReturnModalOpen,
  isReturned,
}: {
  isReturnModalOpen: boolean;
  setIsReturnModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isReturned: boolean;
}) => {
  return (
    <AlertDialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
      <AlertDialogContent className="sm:max-w-[425px] w-[90%] bg-indigo-600  dark:bg-gradient-to-b dark:from-background dark:to-muted">
        <div>
          {!isReturned && (
            <span className="flex items-center justify-center p-10 text-center text-2xl text-yellow-400">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          )}
          {isReturned && (
            <AlertDialogTitle>
              <span className="text-green-500 text-xl font-bold text-center p-10">
                Returned Successfully
              </span>
            </AlertDialogTitle>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReturnProcessingModal;
