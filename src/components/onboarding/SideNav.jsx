/* eslint-disable react/prop-types */
import { useEffect, useState, forwardRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import WhiteLogo from "../whiteLogo";
import { CloseIcon } from "../Icon";

const SideNav = forwardRef(
  (
    { steps, stepMessages, currentStep, setCurrentStep, isOpen, onClose },
    ref
  ) => {
    const navigate = useNavigate();
    const [lastCompletedStep, setLastCompletedStep] = useState(0);

    useEffect(() => {
      // Retrieve the last completed step from local storage
      const storedStep = Number(localStorage.getItem("lastCompletedStep") || 0);
      setLastCompletedStep(storedStep);

      // Redirect to the appropriate step if attempting to access a future step
      if (currentStep > storedStep + 1) {
        navigate(`/onboarding?step=${storedStep + 1}`, { replace: true });
        setCurrentStep(storedStep + 1);
      }
    }, [currentStep, navigate, setCurrentStep]);

    const handleNavigation = (index) => {
      if (index <= lastCompletedStep) {
        navigate(`/onboarding?step=${index + 1}`);
        setCurrentStep(index);
      }
    };

    const handleCompleteStep = () => {
      if (currentStep === lastCompletedStep + 1) {
        const newLastCompletedStep = currentStep;
        localStorage.setItem("lastCompletedStep", String(newLastCompletedStep));
        setLastCompletedStep(newLastCompletedStep);
      }
    };

    useEffect(() => {
      handleCompleteStep();
    }, [currentStep]);

    return (
      <aside
        ref={ref}
        className={`overflow-y-auto scroller fixed top-0 left-0 h-full w-64 bg-[#032541] text-white transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-1/4 md:static md:translate-x-0 z-50 p-4`}
      >
        <div className="flex justify-between bg-white mb-4 rounded-md p-2">
          <Link to="/">
            <WhiteLogo />
          </Link>
          <button onClick={onClose} className="md:hidden p-2">
            <CloseIcon />
          </button>
        </div>
        <ul className="space-y-4">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`cursor-pointer flex items-center gap-5 transition-all duration-500 hover:bg-[#000] py-1 pl-4 ${
                currentStep === index
                  ? "bg-blue-100 text-[#032541]"
                  : "text-white"
              } ${
                index > lastCompletedStep ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={() => handleNavigation(index)}
            >
              <div>
                {index + 1 > currentStep ? (
                  <p
                    className={`w-[18px] h-[18px] md:text-[14px] text-[12px] ${
                      currentStep === index ? "text-[#032541]" : "text-white"
                    }`}
                  >
                    {index + 1}
                  </p>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 26 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 0C6.1125 0 0.5 5.6125 0.5 12.5C0.5 19.3875 6.1125 25 13 25C19.8875 25 25.5 19.3875 25.5 12.5C25.5 5.6125 19.8875 0 13 0ZM18.975 9.625L11.8875 16.7125C11.7125 16.8875 11.475 16.9875 11.225 16.9875C10.975 16.9875 10.7375 16.8875 10.5625 16.7125L7.025 13.175C6.6625 12.8125 6.6625 12.2125 7.025 11.85C7.3875 11.4875 7.9875 11.4875 8.35 11.85L11.225 14.725L17.65 8.3C18.0125 7.9375 18.6125 7.9375 18.975 8.3C19.3375 8.6625 19.3375 9.25 18.975 9.625Z"
                      fill="white"
                    />
                  </svg>
                )}
              </div>

              <div>
                <h5 className="md:text-[16px] text-[14px] font-medium capitalize">
                  {step}
                </h5>
                <p
                  className={`md:text-[14px] text-[12px] font-normal ${
                    currentStep === index ? "text-[#032541]" : "text-white"
                  }`}
                >
                  {stepMessages[index]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    );
  }
);

SideNav.displayName = "SideNav";

export default SideNav;
