import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import type { User as FirebaseUser } from "firebase/auth";
import { useState } from "react";
import { LogIn, User as UserIcon, Loader, Mail, Shield, LogOut, Lock } from "lucide-react";

export default function Login() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
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
      setUser(null);
    } catch (error) {
      console.error(error);
      setError("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Brand header */}
        <div className="bg-indigo-600 px-8 py-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-500 opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-indigo-700 opacity-30"></div>
          
          <div className="relative z-10 flex items-center justify-center flex-col">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md">
              <Lock className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Secure Access</h2>
            <p className="text-indigo-200 text-sm mt-1">
              {user ? "Welcome back" : "Sign in to your account"}
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="px-8 py-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm flex items-center">
              <Shield className="text-red-500 mr-3 flex-shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {user ? (
            <div className="w-full">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex flex-col items-center">
                  {user.photoURL ? (
                    <div className="mb-4 p-1 border-2 border-indigo-200 rounded-full">
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || "User"} 
                        className="w-20 h-20 rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 p-1 border-2 border-indigo-200 rounded-full">
                      <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserIcon className="text-indigo-600" size={32} />
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {user.displayName || "User"}
                    </h3>
                    <div className="flex items-center justify-center mt-1 text-gray-500">
                      <Mail size={14} className="mr-1" />
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>
                  
                  <button
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center shadow-sm"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin mr-2" size={16} />
                    ) : (
                      <LogOut className="mr-2" size={16} />
                    )}
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-8 text-center">
                <p className="text-gray-600">
                  Access your personalized dashboard and settings
                </p>
              </div>
              
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center shadow-md"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin mr-2" size={16} />
                ) : (
                  <LogIn className="mr-2" size={16} />
                )}
                Sign in with Google
              </button>
              
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Need help? Contact support
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">© 2025 Your Company</p>
            <p className="text-xs text-gray-500">Secure Authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
}
 