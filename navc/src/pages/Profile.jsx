import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { User, Mail, Award, Clock, LogOut, Loader2 } from "lucide-react";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const refDoc = doc(db, "Users", user.uid);
          const docSheet = await getDoc(refDoc);
          if (docSheet.exists()) {
            setUserDetails(docSheet.data());
          }
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {userDetails ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {userDetails.FirstName} {userDetails.LastName}
                    </h1>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span>{userDetails.email}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Clock className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Practice Time</p>
                    <p className="text-xl font-semibold">Add later</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interviews</p>
                    <p className="text-xl font-semibold">lefttoadd</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-xl font-semibold">rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Award className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">Technical Interview Practice</p>
                        <p className="text-sm text-gray-500">last interview remarks</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No user data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;