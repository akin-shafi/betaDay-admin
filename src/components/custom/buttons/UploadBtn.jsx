/* eslint-disable react/prop-types */

export default function UploadBtn({ text, ...props }) {
  return (
    <button
      {...props}
      type="button"
      className="md:w-fit w-full flex items-center justify-center gap-2 bg-white text-[#344054] border border-[#D0D5DD] rounded-[6px] md:text-[14px] text-[12px] h-[36px] px-[12px]"
    >
      <svg
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.66699 12.3333L10.0003 9M10.0003 9L13.3337 12.3333M10.0003 9V16.5M16.667 12.9524C17.6849 12.1117 18.3337 10.8399 18.3337 9.41667C18.3337 6.88536 16.2816 4.83333 13.7503 4.83333C13.5682 4.83333 13.3979 4.73833 13.3054 4.58145C12.2187 2.73736 10.2124 1.5 7.91699 1.5C4.46521 1.5 1.66699 4.29822 1.66699 7.75C1.66699 9.47175 2.3632 11.0309 3.48945 12.1613"
          stroke="#344054"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {text}
    </button>
  );
}
