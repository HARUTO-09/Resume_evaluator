import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * A header component that displays the logged-in user's email and a sign-out button.
 * @param {object} props - Component props.
 * @param {object} props.user - The Firebase user object.
 * @param {function} props.onSignOut - A function to handle user sign-out.
 */
function Header({ user, onSignOut }) {
  return (
    <header className="flex justify-between items-center w-full pb-4 border-b border-gray-200 mb-6">
      <h1 className="text-xl font-semibold text-gray-800">AI Resume Evaluator</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Logged in as: <span className="font-medium">{user?.email}</span>
        </span>
        <button
          onClick={onSignOut}
          className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default Header;
