import { useContactUsMutation } from "@/redux/features/bike/bikeApi";
import { debounce } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
// import { useSendFeedbackMutation } from "../../redux/api/baseApi";
const ContactUs = () => {
  const { register, handleSubmit, reset } = useForm<{
    email: string;
    message: string;
  }>();

  const [contactUs] = useContactUsMutation();

  const onSubmit = async (data: { email: string; message: string }) => {
    const toastId = toast.loading("Sending feedback...");
    try {
      const feedback = {
        email: data.email,
        message: data.message,
      };
      const response = await contactUs(feedback);
      if (response?.data?.success === true) {
        reset();
        toast.success("Thank you for your feedback", { id: toastId });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const debounceOnSubmit = debounce(onSubmit, 2000);
  return (
    <section className="md:py-32 py-16 bg-gradient-to-b from-green-50 to-blue-50 dark:bg-gradient-to-b dark:from-background dark:to-muted">
      <div className=" container">
        <h1 className=" text-left md:text-6xl text-4xl bebas-neue-regular">
          Contact With Us
        </h1>
        <div className="poppins-regular max-w-xl mx-auto mt-16 flex w-full flex-col rounded-lg shadow-xl border border-gray-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
          <h2 className="title-font mb-1 text-lg font-medium dark:text-slate-300">
            Feedback
          </h2>
          <p className="mb-5 leading-relaxed text-gray-600 dark:text-slate-400">
            If you had any issues with our service please share with us!
          </p>
          <form
            onSubmit={handleSubmit(
              debounceOnSubmit as SubmitHandler<{
                email: string;
                message: string;
              }>
            )}
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className="text-sm leading-7 text-gray-600 dark:text-slate-300"
              >
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                name="email"
                placeholder="type your email ex:jhon@gmail.com"
                className="w-full rounded border border-gray-300 bg-white dark:bg-slate-600 dark:text-slate-300 dark:border-slate-700 py-1 px-3 text-base leading-8 text-slate-500 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 dark:focus:border-slate-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-slate-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="text-sm leading-7 text-gray-600  dark:text-slate-300"
              >
                Message
              </label>
              <textarea
                {...register("message")}
                id="message"
                name="message"
                placeholder="Share your feedback with us..."
                className="h-32 w-full resize-none rounded border dark:bg-slate-600 border-gray-300 dark:border-slate-700 py-1 px-3 text-base leading-6 text-gray-700 dark:text-slate-300 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-slate-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full rounded border-0 py-2 px-6 text-lg  focus:outline-none bg-indigo-800 text-white hover:bg-indigo-700 dark:bg-indigo-500 shadow-4xl dark:text-slate-100 dark:hover:bg-indigo-600"
            >
              Send
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-500">
            Feel free to connect with us to share your concern.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
