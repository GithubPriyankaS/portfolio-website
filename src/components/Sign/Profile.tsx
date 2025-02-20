import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, MapPin, Camera, Activity, Settings, ChevronRight, Briefcase, Users, Calendar, LineChart } from "lucide-react";
import { Card, CardContent } from "../../app/components/ui/card";

interface UserProfile {
  picture?: string;
  name?: string;
  email?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside dropdown to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    // Fetch user profile from localStorage
    const storedAuth = localStorage.getItem("vertex_auth");
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        if (auth.userProfile) {
          setUserProfile(auth.userProfile);
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all stored data
      localStorage.removeItem("vertex_auth");
      sessionStorage.clear();
      
      // Optional: Add any API logout calls here
      // await logoutAPI();
      
      // Navigate to home and prevent back navigation
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Ensure navigation happens even if cleanup fails
      navigate("/", { replace: true });
    }
  };

  const stats = [
    { icon: Briefcase, label: "Projects", value: "12", color: "bg-blue-500" },
    { icon: Users, label: "Teams", value: "5", color: "bg-purple-500" },
    { icon: Calendar, label: "Tasks", value: "148", color: "bg-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="text-xl font-semibold text-gray-900"></div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        {/* Profile Header */}
        <div className="relative h-[280px] bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,#ffffff_0%,rgba(255,255,255,0)_50%)]" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-6xl px-6 mx-auto">
              <div className="flex items-end pb-6 space-x-6">
                <div className="relative group" ref={dropdownRef}>
                  <div className="relative w-32 h-32 transform translate-y-16">
                    <div className="relative inline-block text-left">
                      <img
                        src={userProfile?.picture || "/api/placeholder/120/120"}
                        alt="Profile"
                        className="object-cover w-full h-full transition-transform border-4 border-white shadow-lg cursor-pointer rounded-xl group-hover:scale-105"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      />
                      {dropdownOpen && (
                        <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate('/profile');
                                setDropdownOpen(false);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                              <Settings size={16} className="mr-2" />
                              Profile Settings
                            </button>
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:outline-none"
                            >
                              <LogOut size={16} className="mr-2" />
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <button className="absolute p-2 transition-all duration-200 rounded-lg shadow-lg opacity-0 bottom-2 right-2 bg-white/90 backdrop-blur-sm group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      <Camera size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>
                {/* Rest of the profile content remains the same */}
                <div className="pb-4">
                  <h1 className="text-3xl font-bold text-white">
                    {userProfile?.name || "John Doe"}
                  </h1>
                  <div className="flex items-center mt-2 space-x-4 text-gray-300">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-1" />
                      {userProfile?.email || "john.doe@example.com"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl px-6 mx-auto mt-24">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-6 space-x-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t bg-gray-50">
                    <div className="flex items-center text-sm text-gray-600">
                      <LineChart size={16} className="mr-2" />
                      <span>+12% from last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="flex items-center justify-between mb-6 text-lg font-semibold">
                    <span>Quick Actions</span>
                    <Settings size={20} className="text-gray-400" />
                  </h2>
                  <div className="space-y-3">
                    {["Create Project", "Invite Team Member", "Schedule Meeting"].map((action) => (
                      <button
                        key={action}
                        className="flex items-center justify-between w-full p-3 text-left transition rounded-lg bg-gray-50 hover:bg-gray-100"
                      >
                        <span className="text-gray-700">{action}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right Column */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="flex items-center justify-between mb-6 text-lg font-semibold">
                    <span>Recent Activity</span>
                    <Activity size={20} className="text-gray-400" />
                  </h2>
                  <div className="space-y-6">
                    {[
                      { title: "Project Milestone Completed", time: "2 hours ago", type: "success" },
                      { title: "New Team Member Added", time: "5 hours ago", type: "info" },
                      { title: "Client Meeting Scheduled", time: "1 day ago", type: "warning" }
                    ].map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-start p-4 transition bg-gray-50 rounded-xl hover:bg-gray-100"
                      >
                        <div className={`w-2 h-2 mt-2 rounded-full ${
                          activity.type === "success" ? "bg-green-500" :
                          activity.type === "info" ? "bg-blue-500" : "bg-yellow-500"
                        }`} />
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="mt-1 text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;