
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const { user, signOut, isAuthenticated } = useAuth();

  // Get user's full name for display
  useEffect(() => {
    const getUserName = async () => {
      if (!user) {
        setUserName('');
        return;
      }

      try {
        // First try to get from enrollments table using email
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('full_name')
          .eq('email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (enrollment?.full_name) {
          setUserName(enrollment.full_name);
          return;
        }

        // Then try from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.full_name) {
          setUserName(profile.full_name);
          return;
        }

        // Last resort: try from user metadata
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
          return;
        }

        // Fallback to email username
        setUserName(user.email?.split('@')[0] || 'User');
      } catch (error) {
        console.error('Error getting user name:', error);
        setUserName(user.email?.split('@')[0] || 'User');
      }
    };

    if (isAuthenticated) {
      getUserName();
    }
  }, [user, isAuthenticated]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Atharva Computer Institute
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection("hero")}
                className="nav-link text-slate-300 hover:text-white px-4 py-2 text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="nav-link text-slate-300 hover:text-white px-4 py-2 text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              <button
                onClick={() => scrollToSection("courses")}
                className="nav-link text-slate-300 hover:text-white px-4 py-2 text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Courses</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="nav-link text-slate-300 hover:text-white px-4 py-2 text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Reviews</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="nav-link text-slate-300 hover:text-white px-4 py-2 text-lg font-semibold transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-slate-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Welcome, {userName}!</span>
                </div>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => window.location.href = '/auth'}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800/50 rounded-lg mt-2">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-slate-300 hover:text-white block px-3 py-2 text-lg font-semibold w-full text-left hover:bg-slate-700/50 rounded transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-slate-300 hover:text-white block px-3 py-2 text-lg font-semibold w-full text-left hover:bg-slate-700/50 rounded transition-colors duration-200"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("courses")}
                className="text-slate-300 hover:text-white block px-3 py-2 text-lg font-semibold w-full text-left hover:bg-slate-700/50 rounded transition-colors duration-200"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="text-slate-300 hover:text-white block px-3 py-2 text-lg font-semibold w-full text-left hover:bg-slate-700/50 rounded transition-colors duration-200"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-slate-300 hover:text-white block px-3 py-2 text-lg font-semibold w-full text-left hover:bg-slate-700/50 rounded transition-colors duration-200"
              >
                Contact
              </button>
              
              <div className="border-t border-slate-700 pt-2">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-slate-300 text-sm">
                      Welcome, {userName}!
                    </div>
                    <Button
                      onClick={signOut}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      window.location.href = '/auth';
                      setIsOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
