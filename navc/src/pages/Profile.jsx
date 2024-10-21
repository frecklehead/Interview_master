import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const [userdetails, setuserdetails] = useState(null);
  //fucntion to fetch the data
  const fetchdetails = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      const refdoc = doc(db, "Users", user.uid);
      const docsheet = await getDoc(refdoc);
      if (docsheet.exists()) {
        setuserdetails(docsheet.data());
        console.log(docsheet.data());
      }
    });
  };
  useEffect(() => {
    fetchdetails();
  }, []);

  const handlelogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/signin";
      console.log("loggedout");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <div className="flex justify-center">
        <div className=" bg-gray-100 p-6 max-w-xs md:max-w-md sm:max-w-sm lg:max-w-lg xl:max-w-xl w-full mt-[30px] rounded-lg ">
        

        {userdetails ? (
        <>
          {userdetails.FirstName} {userdetails.LastName}
          <p>Email: {userdetails.email}</p>
          <button onClick={handlelogout} className="bg-red-500 p-1 rounded-lg">
            {" "}
            Logout
          </button>
        </>
      ) : (
        <>Loading...</>
      )}

      </div>
    </div>
    </div>
  );
};

export default Profile;
