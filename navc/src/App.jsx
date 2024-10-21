import Header from "./components/header";
import { Route, Routes,Navigate } from "react-router-dom";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Services from "./pages/Services";
import SignIn from "./pages/Signin";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
function App() {
  const [user,setuser]=useState();
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      setuser(user);
    })
  },[])
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={ user ?<Navigate to="/profile" /> : <Home />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/services" element={<Services />}></Route>

        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </>
  );
}

export default App;
