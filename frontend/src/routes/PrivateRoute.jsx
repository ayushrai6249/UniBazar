import { Navigate } from "react-router-dom";
import { useContext } from 'react'
import { AppContext } from "../context/AppContext";

const PrivateRoute = ({ children }) => {
  const { token, userData } = useContext(AppContext);

  return userData.role !== "user" ? children : <Navigate to="/login" />;
};

export default PrivateRoute;