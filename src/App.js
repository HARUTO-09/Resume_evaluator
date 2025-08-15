import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signInAnonymously,
  signOut
} from 'firebase/auth';

import { auth } from './firebase';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';

/**
 * The main application component. It handles the user's authentication state and renders the appropriate view.
 */
function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (e) {
      console.error('Error signing out:', e);
    }
  };

  useEffect(() => {
    // This is a mandatory check for the custom token provided by the canvas environment
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
    
    const setupAuth = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error('Error with initial authentication:', e);
        // Fallback to anonymous sign-in if custom token fails
        signInAnonymously(auth);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });

    setupAuth();

    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      {user ? (
        <Dashboard user={user} onSignOut={handleSignOut} />
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          {isLoginView ? (
            <Login onSwitchToSignUp={() => setIsLoginView(false)} />
          ) : (
            <SignUp onSwitchToLogin={() => setIsLoginView(true)} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
