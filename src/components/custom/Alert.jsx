/* eslint-disable react/prop-types */
// Alert.js
const Alert = ({ message }) => {
  if (!message) return null; // Don't render if there's no message

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4"
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default Alert;
