import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const AddGST = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gst, setGST] = useState(0);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/product/${id}`);
        setGST(res.data.gst || 0);
        setProductName(res.data.name);
      } catch (error) {
        console.error("Error fetching product GST:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleGSTChange = (e) => {
    setGST(e.target.value);
  };

  const handleUpdateGST = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/product/update-gst/${id}`, { gst }, { withCredentials: true });
      alert("GST updated successfully!");
      navigate("/manage-products");
    } catch (error) {
      console.error("Error updating GST:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Update GST for {productName}</h2>
        <form onSubmit={handleUpdateGST} className="space-y-4">
          <label>GST (%):</label>
          <input type="number" value={gst} className="w-full p-2 border rounded" onChange={handleGSTChange} />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Update GST</button>
        </form>
      </div>
    </div>
  );
};

export default AddGST;
