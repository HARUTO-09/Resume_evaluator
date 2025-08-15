import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../../firebase';

/**
 * Component for user sign-in.
 * @param {object} props - Component props.
 * @param {function} props.onSwitchToSignUp - Function to switch to the sign-up view.
 */
function Login({ onSwitchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle email/password sign-in
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully');
    } catch (e) {
      console.error('Error signing in:', e);
      setError(e.message);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log('Signed in with Google successfully');
    } catch (e) {
      console.error('Error with Google sign-in:', e);
      setError(e.message);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Sign In</h1>
      <div className="mb-4 text-center text-red-600 font-medium">{error && <p>{error}</p>}</div>
      <form onSubmit={handleSignIn} className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Sign In
        </button>
      </form>
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <button
        onClick={handleGoogleSignIn}
        className="w-full bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-300 shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.0001 4.75005C14.0747 4.75005 15.8329 5.4859 17.1306 6.74549L20.0883 3.84492C18.0645 1.95671 15.2016 0.75 12.0001 0.75C7.27503 0.75 3.19777 3.42436 1.28828 7.03713L5.27507 9.99121C6.26214 7.27546 8.82572 5.25005 12.0001 5.25005V4.75005Z"
            fill="#EA4335"
          />
          <path
            d="M11.9999 19.25C14.5029 19.25 16.5912 18.2045 17.9818 16.7324L21.9054 19.6548C19.4526 22.0298 16.1601 23.25 11.9999 23.25C7.27503 23.25 3.19777 20.5756 1.28828 16.9629L5.27507 14.0088C6.26214 16.7246 8.82572 18.75 11.9999 18.75V19.25Z"
            fill="#34A853"
          />
          <path
            d="M23.1983 12.2743H12.2742V11.75H23.1983C23.2662 12.0029 23.3039 12.269 23.3039 12.5361C23.3039 13.342 23.136 14.0628 22.8687 14.6599L19.4678 12.0717L17.7634 11.4589L14.4984 14.0471L14.7779 14.7171C17.3824 15.4851 18.919 17.3484 19.8273 19.8967L19.9912 19.3409L22.9489 16.4385C22.6815 15.6597 22.4287 14.8809 22.1759 14.1021C22.108 13.8492 22.0401 13.5964 21.9722 13.3435L22.6347 12.7877C23.0039 12.3986 23.1983 12.1102 23.1983 12.2743Z"
            fill="#4285F4"
          />
          <path
            d="M12.0001 8.75C14.0747 8.75 15.8329 9.4859 17.1306 10.7455L20.0883 7.84492C18.0645 5.95671 15.2016 4.75 12.0001 4.75V8.75Z"
            fill="#FBBC04"
          />
          <path
            d="M12.0001 8.75C12.0001 8.75 12.0001 8.75 12.0001 8.75L12.0001 4.75C12.0001 4.75 12.0001 4.75 12.0001 4.75L12.0001 8.75Z"
            fill="#FFC107"
          />
        </svg>
        Sign In with Google
      </button>
      <div className="mt-6 text-center text-gray-600">
        Don't have an account?
        <button onClick={onSwitchToSignUp} className="ml-2 text-blue-600 font-semibold hover:underline">
          Sign Up
        </button>
      </div>
    </>
  );
}

export default Login;
