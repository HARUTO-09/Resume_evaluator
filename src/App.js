/* global __initial_auth_token */
import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signInAnonymously,
  signOut
} from 'firebase/auth';

import { auth } from './firebase';
import Login from './components/auth/Login.js'; 
import SignUp from './components/auth/SignUp.js'; 
import Dashboard from './components/dashboard/Dashboard.js'; 

function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (e) {
      console.error('Error signing out:', e);
    }
  };

  useEffect(() => {
    const initialAuthToken =
      typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    const setupAuth = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error('Error with initial authentication:', e);
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
