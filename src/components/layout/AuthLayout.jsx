import { Link } from "react-router-dom";
import logoImage from "@/assets/images/logo-white.png";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-[150px] h-[50px] relative mx-auto mb-6">
          <Link to="/">
            <img
              src={logoImage}
              alt="Logo"
              className="object-contain w-full h-full"
              style={{
                aspectRatio: "auto",
                objectFit: "contain",
              }}
              width={150}
              height={50}
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </div>
  );
}
