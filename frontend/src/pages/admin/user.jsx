import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});
  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendUrl}/api/admin/users`, {
        headers: { token },
      });
      setUsers(res.data.data);
      setLoading(false);
    } catch {
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  const toggleExpand = (id, type) => {
    setExpanded((prev) => (prev[id]?.type === type ? {} : { [id]: { type } }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/admin/user/${id}`, {
        headers: { token },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingRoleId(userId);
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${backendUrl}/api/admin/user/role/${userId}`,
        { role: newRole },
        { headers: { token } }
      );

      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data.data : u)));
      setUpdatingRoleId(null);
    } catch {
      alert("Failed to update role");
      setUpdatingRoleId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                {["User", "Email", "Role", "Listings", "Orders", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <React.Fragment key={u._id}>
                  {/* USER ROW */}
                  <tr className="border-t">
                    {/* USER IMAGE + NAME */}
                    <td className="px-4 py-2">
                      <div
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                        onClick={() => navigate(`/profile/${u._id}`)}
                      >
                        <img
                          src={u.image || "/default-avatar.png"}
                          alt={u.name}
                          className="w-9 h-9 rounded-full border object-cover"
                        />
                        <span className="font-semibold text-sm">{u.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-2">{u.email}</td>

                    {/* ROLE DROPDOWN */}
                    <td className="px-4 py-2">
                      {updatingRoleId === u._id ? (
                        <span className="text-xs text-gray-500">Updating...</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="border px-2 py-1 text-sm rounded"
                        >
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>

                    {/* LISTINGS */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleExpand(u._id, "listings")}
                        className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
                      >
                        {u.Listings?.length || 0}
                      </button>
                    </td>

                    {/* ORDERS */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleExpand(u._id, "orders")}
                        className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
                      >
                        {u.orders?.length || 0}
                      </button>
                    </td>

                    {/* DELETE */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* LISTINGS EXPAND */}
                  {expanded[u._id]?.type === "listings" && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="p-4">
                        {u.Listings?.length ? (
                          <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
                            {u.Listings.map((item) => (
                              <div
                                key={item._id}
                                className="min-w-[220px] border rounded p-3 text-xs bg-white"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-24 w-full object-cover rounded"
                                />
                                <p className="font-bold mt-2 line-clamp-1">{item.name}</p>
                                <p>₹{item.price}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500">No listings found</p>
                        )}
                      </td>
                    </tr>
                  )}

                  {/* ORDERS EXPAND */}
                  {expanded[u._id]?.type === "orders" && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="p-4">
                        {u.orders?.length ? (
                          <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
                            {u.orders.map((o) => (
                              <div
                                key={o._id}
                                className="min-w-[220px] border rounded p-3 text-xs bg-white"
                              >
                                <p className="font-semibold">Order ID</p>
                                <p className="break-all">{o._id}</p>
                                <p className="mt-1 text-gray-600">
                                  Status: {o.status || "N/A"}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500">No orders found</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
