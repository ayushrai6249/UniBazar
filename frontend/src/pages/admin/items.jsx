import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllItemsPage = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendUrl}/api/admin/items`, {
        headers: { token },
      });
      setItems(res.data.allItems);
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  };

  const toggleApproval = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${backendUrl}/api/admin/item/toggle-approval/${id}`,
        {},
        { headers: { token } }
      );

      setItems((prev) =>
        prev.map((i) =>
          i._id === id
            ? { ...i, approved: res.data.item.approved }
            : i
        )
      );
    } catch (err) {
      console.error("Approval toggle failed", err);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "aiApproved") return item.aiapproved === true;
    if (filter === "aiRejected") return item.aiapproved === false;
    return true; // all
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Items</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value="all">All Items</option>
          <option value="aiApproved">AI Approved</option>
          <option value="aiRejected">AI Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            onClick={() => {
              navigate(`/item/${item._id}`);
              window.scrollTo(0, 0);
            }}
            className="bg-white border rounded-xl shadow p-4 cursor-pointer
                       hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-36 w-full object-cover rounded"
            />

            <h3 className="font-bold mt-2 truncate">
              {item.name}
            </h3>

            <p className="text-xs text-gray-500">
              {item.category}
            </p>

            <p className="text-sm mt-1">
              ₹{item.price}
            </p>

            <div className="flex justify-between items-center mt-3">
              <div className="flex flex-col gap-1">
                <span
                  className={`text-xs px-2 py-1 rounded ${item.approved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {item.approved ? "Approved" : "Pending"}
                </span>

              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleApproval(item._id);
                }}
                className={`text-xs px-2 py-1 rounded text-white ${item.approved
                  ? "bg-yellow-500"
                  : "bg-green-600"
                  }`}
              >
                {item.approved ? "Reject" : "Approve"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllItemsPage;