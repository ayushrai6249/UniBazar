import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const AddListing = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    old: '',
    description: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Image required');

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('image', image);

      const token = localStorage.getItem('token');

      const { data } = await axios.post(
        backendUrl + '/api/users/add-listing',
        formData,
        { headers: { token } }
      );

      if (data.success) {
        alert("Your product has been added successfully. It will be visible once approved by our team. You can check its status on the My Listings page. If approval takes time, feel free to contact the admin or users through the Contact page.");

        toast.success(data.message);
        setForm({ name: '', category: '', price: '', old: '', description: '' });
        setImage(null);
        setPreview(null);
        // navigate('/items');
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-sm">
      <h2 className="text-3xl font-medium text-neutral-800 mb-4">
        Add New Listing
      </h2>

      <hr className="bg-zinc-400 h-[1px] border-none mb-6" />

      {/* IMAGE */}
      <label htmlFor="image" className="cursor-pointer">
        <div className="inline-block relative">
          <img
            src={preview || '/default-image.png'}
            className="w-36 h-36 object-cover rounded bg-gray-100"
            alt=""
          />
          <p className="text-xs text-blue-500 mt-2 text-center">
            Click to upload image
          </p>
        </div>
        <input
          id="image"
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
        />
      </label>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">

        <div className="grid grid-cols-[1fr_3fr] gap-3 items-center">
          <p className="font-medium">Product Name:</p>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-gray-50 px-2 py-1"
          />
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-3 items-center">
          <p className="font-medium">Category:</p>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="bg-gray-50 px-2 py-1"
          >
            <option value="">Select</option>
            <option>Stationary</option>
            <option>Gadgets</option>
            <option>Room Essentials</option>
            <option>Clothing</option>
            <option>Transport</option>
            <option>Appliances</option>
            <option>Games</option>
            <option>Accommodation</option>
            <option>Others</option>
          </select>
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-3 items-center">
          <p className="font-medium">Price (₹):</p>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="bg-gray-50 px-2 py-1 max-w-32"
          />
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-3 items-center">
          <p className="font-medium">Product Age:</p>
          <input
            name="old"
            value={form.old}
            onChange={handleChange}
            required
            className="bg-gray-50 px-2 py-1 max-w-52"
          />
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-3">
          <p className="font-medium">Description:</p>
          <textarea
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="bg-gray-50 px-2 py-1"
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListing;
