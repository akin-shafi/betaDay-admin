import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export function AdminRoute({ children }) {
  const { session } = useSession();
  const navigate = useNavigate();

  if (!session || session.role !== "admin") {
    navigate("/login");
    return null;
  }

  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
