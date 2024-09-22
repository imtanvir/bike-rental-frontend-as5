import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import bikeWheel from "../assets/images/wheel.png";
const options = [
  { value: "5%", color: "#6c00d6" },
  { value: "10%", color: "#5200a3" },
  { value: "25%", color: "#6c00d6" },
  { value: "30%", color: "#5200a3" },
];

const CouponWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedOption(null);

    const spinRotation = 360 * 5 + Math.random() * 360; // Spin at least 5 times
    const newRotation = rotation + spinRotation;
    setRotation(newRotation);

    // Calculate the duration for the spin
    const spinDuration = 5000; // 5 seconds

    // Set a timeout to stop spinning and calculate the result
    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRotation = ((newRotation % 360) + 360) % 360;
      const selectedIndex = Math.floor(
        ((360 - normalizedRotation) / 360) * options.length
      );
      setSelectedOption(options[selectedIndex].value);
    }, spinDuration); // Match this with the CSS transition time
  };

  useEffect(() => {
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform 5s ease-out`; // Ensure the spin lasts 5 seconds
      wheelRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [rotation]);

  const [copied, setCopied] = useState(false);

  const handleCopy = (data: string) => {
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Hide tooltip after 1.5 seconds
    });
  };

  return (
    <section className=" bg-indigo-100 dark:bg-gradient-to-b dark:from-background dark:to-muted">
      <div className=" flex md:flex-row flex-col gap-4 items-center md:py-32 py-16 container mx-auto">
        <div>
          <h1 className="text-center md:text-6xl text-4xl bebas-neue-regular">
            Experience Your Next Ride with an Exclusive{" "}
            <span className="text-indigo-500">Discount</span>.
            <br /> Spin the Wheel and Unlock Your{" "}
            <span className="text-indigo-500">Coupon</span>!
          </h1>
        </div>
        <div className="container mx-auto flex md:flex-row flex-col justify-end gap-5 items-center poppins-regular">
          <div className="relative w-64 h-64 mb-8">
            <div className="relative w-full h-full z-20">
              <img
                src={bikeWheel}
                className="w-full absolute custom-spin-slow"
                alt="wheel"
              />
            </div>
            <div
              ref={wheelRef}
              className="z-30 top-8 left-8 w-[75%] h-[75%] absolute overflow-hidden rounded-full transition-transform duration-5000 ease-out"
              style={{
                background: `conic-gradient(
              ${options[0].color} 0deg 90deg,
              ${options[1].color} 90deg 180deg,
              ${options[2].color} 180deg 270deg,
              ${options[3].color} 270deg 360deg
            )`,
              }}
              aria-hidden="true"
            >
              {options.map((option, index) => (
                <div
                  key={option.value}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold"
                  style={{
                    transform: `rotate(${
                      index * 90
                    }deg) translateY(-40px) translateX(40px)`,
                    transformOrigin: "center center",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {option.value}
                </div>
              ))}
            </div>
            <div
              className="absolute top-0 left-[50%] transform -translate-x-1/2 rotate-[180deg] text-white font-bold"
              style={{ zIndex: 30 }}
            >
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-yellow-400" />
            </div>
          </div>
          <div>
            <Button
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse animate-infinite animate-ease-linear hover:animate-none"
            >
              {isSpinning ? "Spinning..." : "Spin the Wheel"}
            </Button>

            <div className={`${selectedOption ? "visible" : "invisible"}`}>
              <p className="pb-2 pt-4 text-lg font-semibold" aria-live="polite">
                Your coupon is:{" "}
                <span className="text-indigo-500">{selectedOption}</span>
              </p>
              <div className="relative inline-flex items-center">
                <input
                  type="text"
                  value={selectedOption || ""}
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                />
                <button
                  onClick={() => handleCopy(selectedOption || "")}
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center"
                >
                  {copied ? (
                    <svg
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 12"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                    </svg>
                  )}
                </button>
                {copied && (
                  <div className="absolute bottom-[-1.5rem] left-0 bg-gray-900 text-white text-xs rounded-lg p-1 shadow-lg">
                    Copied!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CouponWheel;
