import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const AddProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    variants: [],
    images: [],
  });
  const [variant, setVariant] = useState({
    size: "",
    batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
  });
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(-1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [errors, setErrors] = useState({});

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#66BB6A" : "#388E3C" },
      secondary: { main: darkMode ? "#A5D6A7" : "#4CAF50" },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "8px", textTransform: "none" },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: darkMode ? "#555" : "#ddd" },
              "&:hover fieldset": { borderColor: "#388E3C" },
              "&.Mui-focused fieldset": { borderColor: "#388E3C" },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: darkMode ? "#555" : "#ddd" },
              "&:hover fieldset": { borderColor: "#388E3C" },
              "&.Mui-focused fieldset": { borderColor: "#388E3C" },
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("${API_BASE_URL}/api/users/me", { withCredentials: true });
        if (res.data && res.data.isAdmin) {
          setUser(res.data);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };
    fetchUser();

    const handleResize = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [categoryRes, brandRes, productRes] = await Promise.all([
            axios.get("${API_BASE_URL}/api/category/list", { withCredentials: true }),
            axios.get("${API_BASE_URL}/api/vendor/list", { withCredentials: true }),
            axios.get("${API_BASE_URL}/api/product/list", { withCredentials: true }),
          ]);
          setCategories(categoryRes.data || []);
          setBrands(brandRes.data || []);
          setProducts(productRes.data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!product.name.trim()) tempErrors.name = "Product name is required";
    if (!product.category) tempErrors.category = "Category is required";
    if (!product.brand) tempErrors.brand = "Brand is required";
    if (images.length === 0) tempErrors.images = "At least one image is required";
    if (mainImageIndex === -1 && images.length > 0) tempErrors.mainImage = "Please select a main image";
    if (product.variants.length === 0) tempErrors.variants = "At least one variant is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateVariant = () => {
    const batch = variant.batches[0];
    let tempErrors = {};
    if (!variant.size.trim()) tempErrors.size = "Size is required";
    if (!batch.batchNumber.trim()) tempErrors.batchNumber = "Batch number is required";
    if (!batch.costPrice || batch.costPrice <= 0) tempErrors.costPrice = "Valid cost price is required";
    if (!batch.sellingPrice || batch.sellingPrice <= 0) tempErrors.sellingPrice = "Valid selling price is required";
    if (batch.stock < 0) tempErrors.stock = "Stock cannot be negative";
    if (!batch.gst || batch.gst < 0) tempErrors.gst = "Valid GST percentage is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleVariantAdd = () => {
    if (validateVariant()) {
      setProduct((prev) => ({
        ...prev,
        variants: [...prev.variants, { ...variant }],
      }));
      setVariant({
        size: "",
        batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
      });
      setErrors({});
    }
  };

  const handleVariantDelete = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantEdit = (index) => {
    const editVariant = product.variants[index];
    setVariant(editVariant);
    handleVariantDelete(index);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleMainImageSelect = (index) => {
    setMainImageIndex(index);
    setErrors((prev) => ({ ...prev, mainImage: "" }));
  };

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (index === mainImageIndex) setMainImageIndex(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("brand", product.brand);
    formData.append("variants", JSON.stringify(product.variants));

    images.forEach((image, index) => {
      formData.append("images", image);
      formData.append("isMain", index === mainImageIndex);
    });

    try {
      await axios.post("${API_BASE_URL}/api/product/add", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!", { position: "top-center" });
      handleClear();
      const productRes = await axios.get("${API_BASE_URL}/api/product/list", { withCredentials: true });
      setProducts(productRes.data || []);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product", { position: "top-center" });
    }
  };

  const handleClear = () => {
    setProduct({ name: "", description: "", category: "", brand: "", variants: [], images: [] });
    setImages([]);
    setMainImageIndex(-1);
    setVariant({
      size: "",
      batches: [{ batchNumber: "", costPrice: "", sellingPrice: "", discount: 0, stock: 0, gst: "" }],
    });
    setErrors({});
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isMobile={isMobile}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              {isMobile && (
                <IconButton onClick={() => setSidebarOpen(true)}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Add Product
              </Typography>
            </Box>
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ color: "#4CAF50" }}>
              <Link
                to="/admin-dashboard"
                style={{ textDecoration: "none", color: "#4CAF50", display: "flex", alignItems: "center" }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                Dashboard
              </Link>
              <Link
                to="/manage-products"
                style={{ textDecoration: "none", color: "#4CAF50", display: "flex", alignItems: "center" }}
              >
                <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="small" />
                Manage Products
              </Link>
              <Typography color="#4CAF50" sx={{ display: "flex", alignItems: "center" }}>
                <AddCircleIcon sx={{ mr: 0.5 }} fontSize="small" />
                Add Product
              </Typography>
            </Breadcrumbs>
          </Box>

          <Card>
            <CardContent>
              <form id="product-form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Basic Information */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Basic Information
                      </Typography>
                      <TextField
                        fullWidth
                        label="Product Name"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Description"
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  </Grid>
                  {/* Product Image */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, height: "100%" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Product Image
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        Choose a product photo or simply drag and drop up to 5 photos here.
                      </Typography>
                      <Box
                        sx={{
                          border: "2px dashed #ccc",
                          borderRadius: 1,
                          p: 4,
                          textAlign: "center",
                          mb: 2,
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Box>
                            <Typography>Drop your image here, or</Typography>
                            <Button variant="text" component="span" color="primary">
                              Click to browse
                            </Button>
                          </Box>
                        </label>
                      </Box>
                      {errors.images && (
                        <Typography color="error" sx={{ mb: 2 }}>
                          {errors.images}
                        </Typography>
                      )}
                      <Typography sx={{ fontSize: "0.8rem", color: "#757575" }}>
                        Image formats: .jpg, .jpeg, .png, preferred size: 1:1, file size is restricted to a
                        maximum of 500Kb.
                      </Typography>
                      {images.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          {images.map((image, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                              <Typography>{image.name}</Typography>
                              <Button
                                onClick={() => handleMainImageSelect(index)}
                                color={index === mainImageIndex ? "primary" : "inherit"}
                                sx={{ ml: 2 }}
                              >
                                {index === mainImageIndex ? "Main" : "Set as Main"}
                              </Button>
                              <IconButton onClick={() => handleImageRemove(index)} color="secondary">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          ))}
                          {errors.mainImage && (
                            <Typography color="error" sx={{ mt: 1 }}>
                              {errors.mainImage}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Attribute */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Attribute
                      </Typography>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={product.category}
                          onChange={(e) => setProduct({ ...product, category: e.target.value })}
                          label="Category"
                          required
                          error={!!errors.category}
                        >
                          <MenuItem value="">Select Category</MenuItem>
                          {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                          ))}
                        </Select>
                        {errors.category && <Typography color="error">{errors.category}</Typography>}
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Brand</InputLabel>
                        <Select
                          value={product.brand}
                          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                          label="Brand"
                          required
                          error={!!errors.brand}
                        >
                          <MenuItem value="">Select Brand</MenuItem>
                          {brands.map((br) => (
                            <MenuItem key={br._id} value={br._id}>{br.name}</MenuItem>
                          ))}
                        </Select>
                        {errors.brand && <Typography color="error">{errors.brand}</Typography>}
                      </FormControl>
                    </Box>
                  </Grid>
                  {/* Add Variants */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                        Add Variants
                      </Typography>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Size"
                            value={variant.size}
                            onChange={(e) => setVariant({ ...variant, size: e.target.value })}
                            error={!!errors.size}
                            helperText={errors.size}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Batch Number"
                            value={variant.batches[0].batchNumber}
                            onChange={(e) =>
                              setVariant({
                                ...variant,
                                batches: [{ ...variant.batches[0], batchNumber: e.target.value }],
                              })
                            }
                            error={!!errors.batchNumber}
                            helperText={errors.batchNumber}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Cost Price"
                            type="number"
                            value={variant.batches[0].costPrice}
                            onChange={(e) =>
                              setVariant({
                                ...variant,
                                batches: [{ ...variant.batches[0], costPrice: e.target.value }],
                              })
                            }
                            error={!!errors.costPrice}
                            helperText={errors.costPrice}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Selling Price"
                            type="number"
                            value={variant.batches[0].sellingPrice}
                            onChange={(e) =>
                              setVariant({
                                ...variant,
                                batches: [{ ...variant.batches[0], sellingPrice: e.target.value }],
                              })
                            }
                            error={!!errors.sellingPrice}
                            helperText={errors.sellingPrice}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Discount (%)"
                            type="number"
                            value={variant.batches[0].discount}
                            onChange={(e) =>
                              setVariant({
                                ...variant,
                                batches: [{ ...variant.batches[0], discount: e.target.value }],
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Stock"
                            type="number"
                            value={variant.batches[0].stock}
                            onChange={(e) =>
                              setVariant({
                                ...variant,
                                batches: [{ ...variant.batches[0], stock: e.target.value }],
                              })
                            }
                            error={!!errors.stock}
                            helperText={errors.stock}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="GST (%)"
                            type="number"
                            value={variant.batches[0].gst}
                            onChange={(e) =>
                              setVariant({
                                ...variant,
                                batches: [{ ...variant.batches[0], gst: e.target.value }],
                              })
                            }
                            error={!!errors.gst}
                            helperText={errors.gst}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleVariantAdd}
                            fullWidth
                          >
                            Add
                          </Button>
                        </Grid>
                      </Grid>
                      {errors.variants && (
                        <Typography color="error" sx={{ mt: 2 }}>
                          {errors.variants}
                        </Typography>
                      )}
                      {product.variants.length > 0 && (
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Size</TableCell>
                                <TableCell>Batch Number</TableCell>
                                <TableCell align="right">Cost Price</TableCell>
                                <TableCell align="right">Selling Price</TableCell>
                                <TableCell align="right">Discount (%)</TableCell>
                                <TableCell align="right">Stock</TableCell>
                                <TableCell align="right">GST (%)</TableCell>
                                <TableCell align="right">Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {product.variants.map((v, index) => (
                                <TableRow key={index}>
                                  <TableCell>{v.size}</TableCell>
                                  <TableCell>{v.batches[0].batchNumber}</TableCell>
                                  <TableCell align="right">₹{v.batches[0].costPrice}</TableCell>
                                  <TableCell align="right">₹{v.batches[0].sellingPrice}</TableCell>
                                  <TableCell align="right">{v.batches[0].discount}</TableCell>
                                  <TableCell align="right">{v.batches[0].stock}</TableCell>
                                  <TableCell align="right">{v.batches[0].gst}</TableCell>
                                  <TableCell align="right">
                                    <IconButton onClick={() => handleVariantEdit(index)} color="primary">
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleVariantDelete(index)} color="secondary">
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  </Grid>

                  {/* Buttons at Bottom */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                      <Button variant="outlined" color="error" onClick={handleClear}>
                        Clear
                      </Button>
                      <Button variant="contained" color="success" type="submit">
                        Add Product
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? "dark" : "light"}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AddProduct;