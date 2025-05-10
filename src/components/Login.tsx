import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import type { User as FirebaseUser } from "firebase/auth";
import React, { useState } from "react";
import { LogIn, User as UserIcon, Loader, Mail, Shield, LogOut, Lock } from "lucide-react";

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<FirebaseUser | null>>;
}

export default function Login({setIsAuthenticated, setUser}: LoginProps) {
  const [user, setLocalUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseuser = result.user;
      setLocalUser(firebaseuser);
      setIsAuthenticated(true);
      setUser(firebaseuser);
      console.log(user);
    } catch (error) {
      console.error(error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await auth.signOut();
      setLocalUser(null);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error(error);
      setError("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 p-6 items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="text-black" size={28} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-black">
            {user ? "Welcome Back" : "Account Access"}
          </h2>
          <p className="text-blue-100 text-center mt-2">
            {user ? "You're currently signed in" : "Please sign in to continue"}
          </p>
        </div>
        
        {/* Main content */}
        <div className="px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl text-red-700 text-sm flex items-center border border-red-100">
              <Shield className="text-red-500 mr-3 flex-shrink-0" size={20} />
              <span className="font-medium">{error}</span>
            </div>
          )}
          
          {user ? (
            <div className="w-full">
              <div className="rounded-2xl p-6">
                <div className="flex flex-col items-center">
                  {user.photoURL ? (
                    <div className="mb-6 p-1.5 border-4 border-indigo-100 rounded-full shadow-md">
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || "User"} 
                        className="w-24 h-24 rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="mb-6 p-1.5 border-4 border-indigo-100 rounded-full shadow-md">
                      <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center">
                        <UserIcon className="text-indigo-600" size={40} />
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {user.displayName || "User"}
                    </h3>
                    <div className="flex items-center justify-center mt-2 text-gray-500">
                      <Mail size={16} className="mr-2" />
                      <p>{user.email}</p>
                    </div>
                  </div>
                  
                  <button
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-6 py-4 rounded-xl transition-colors flex items-center justify-center shadow-sm border border-gray-200"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin mr-3" size={18} />
                    ) : (
                      <LogOut className="mr-3" size={18} />
                    )}
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-10 text-center">
                <p className="text-gray-600">
                  Securely access your personalized dashboard and settings
                </p>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-4 rounded-xl transition-colors flex items-center justify-center shadow-lg"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin mr-3" size={18} />
                ) : (
                  <LogIn className="mr-3" size={18} />
                )}
                Continue with Google
              </button>
              
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center">
                  <Shield size={14} className="mr-1 text-gray-400" />
                  Your data is securely protected
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">© 2025 Your Company</p>
            <p className="text-xs text-gray-500">Privacy & Terms</p>
          </div>
        </div>
      </div>
    </div>
  );
}