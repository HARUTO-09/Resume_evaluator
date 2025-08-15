import FileUploader from './FileUploader';
import Header from '../Header';

/**
 * The main user dashboard component.
 * It's displayed after a user successfully logs in.
 * It contains the user information and the file upload functionality.
 * @param {object} props - Component props.
 * @param {object} props.user - The Firebase user object.
 * @param {function} props.onSignOut - A function to handle user sign-out.
 */
function Dashboard({ user, onSignOut }) {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl px-4 py-8 bg-white rounded-xl shadow-2xl">
      <Header user={user} onSignOut={onSignOut} />

      <main className="mt-8 w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome, {user?.displayName || user?.email || "User"}!
        </h2>
        <p className="text-gray-600 text-center mb-8">
          This is your dashboard. Upload your resume and a job description to get started.
        </p>

        <FileUploader />
      </main>
    </div>
  );
}

export default Dashboard;
