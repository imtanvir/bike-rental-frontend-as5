import { Button } from "@/components/ui/button";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "/src/assets/images/logo/Logo.svg";

export default function Footer() {
  return (
    <footer
      className="dark:bg-gradient-to-b dark:from-background dark:to-muted bg-slate-200 dark:bg-inherit md:py-24 "
      // style={{ boxShadow: " 0 -5px 5px -5px #333" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col space-x-6 mb-4 md:mb-0">
            <div className="flex items-center space-x-4">
              <img className="h-8 w-auto" src={Logo} alt="logo" />
              <h3 className="md:text-3xl text-2xl font-light select-none">
                RidePro
              </h3>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
            <a
              href="/privacy-policy"
              className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition"
            >
              Terms of Service
            </a>
            <a
              href="/contact-us"
              className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition"
            >
              Contact Us
            </a>
          </nav>
          <div className="py-4">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </Button>
          </div>
        </div>
        <div className="pt-4 text-center text-sm text-gray-500 border-t">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold dark:text-slate-50">RidePro</span>. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
