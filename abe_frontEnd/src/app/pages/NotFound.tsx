import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-[#4b2e83] mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-[#4b2e83] text-white rounded-md hover:bg-[#3b2366] transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
