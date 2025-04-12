// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import NavigationBar from "../components/Navbar";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   CircularProgress,
//   Divider,
//   Card,
//   CardContent,
//   InputAdornment,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { motion } from "framer-motion";
// import PhoneIcon from "@mui/icons-material/Phone";
// import "./styles/LoginPage.css";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({ mobile: "", otp: "" });
//   const [loading, setLoading] = useState(true);
//   const [otpSent, setOtpSent] = useState(false);
//   const navigate = useNavigate();
//   const otpRefs = useRef([]);

//   useEffect(() => {
//     axios
//       .get("${API_BASE_URL}/api/users/profile", { withCredentials: true })
//       .then((response) => {
//         if (response.data) {
//           // Redirect based on user role: admin to dashboard, others to products
//           navigate(response.data.isAdmin ? "/admin-dashboard" : "/products");
//         }
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleOtpChange = (e, index) => {
//     const value = e.target.value;
//     if (/^\d$/.test(value) || value === "") {
//       const newOtp = formData.otp.split("");
//       newOtp[index] = value;
//       setFormData({ ...formData, otp: newOtp.join("") });
//       if (value && index < 5) {
//         otpRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleOtpKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
//       otpRefs.current[index - 1].focus();
//     }
//   };

//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     if (!/^\d{10}$/.test(formData.mobile)) {
//       toast.error("Mobile number must be 10 digits.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post("${API_BASE_URL}/api/users/login", { mobile: formData.mobile }, { withCredentials: true });
//       toast.success("OTP sent to your mobile!", { autoClose: 2000 });
//       setOtpSent(true);
//       setFormData({ ...formData, otp: "" });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     if (formData.otp.length !== 6) {
//       toast.error("Please enter a 6-digit OTP.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "${API_BASE_URL}/api/users/verify-login-otp",
//         { mobile: formData.mobile, otp: formData.otp },
//         { withCredentials: true }
//       );
//       toast.success("Login successful!", { autoClose: 1500 });
//       setTimeout(() => {
//         // Redirect based on user role: admin to dashboard, others to products
//         navigate(response.data.user.isAdmin ? "/admin-dashboard" : "/products");
//       }, 1500);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignUp = () => {
//     navigate("/register");
//   };

//   const theme = createTheme({
//     palette: { primary: { main: "#4CAF50" }, secondary: { main: "#FF5722" }, background: { default: "#F5F7FA" } },
//     typography: { fontFamily: "'Roboto', sans-serif", h4: { fontWeight: 700 } },
//     components: {
//       MuiCard: { styleOverrides: { root: { borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" } } },
//       MuiButton: { styleOverrides: { root: { borderRadius: "8px", textTransform: "none", padding: "12px 24px" } } },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": { borderRadius: "8px" },
//             "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4CAF50" },
//           },
//         },
//       },
//     },
//   });

//   const otpBoxVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
//   };

//   if (loading && !otpSent) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "background.default" }}>
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" } }}>
//           <CircularProgress size={60} sx={{ color: "primary.main" }} />
//         </motion.div>
//         <Typography sx={{ ml: 2, color: "text.secondary" }}>Checking session...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//         <NavigationBar />
//         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pt: 8, px: 2 }}>
//           <Card sx={{ maxWidth: 450, width: "100%" }}>
//             <CardContent sx={{ p: 4 }}>
//               <Typography variant="h4" sx={{ textAlign: "center", color: "primary.main", mb: 1 }}>
//                 Welcome Back
//               </Typography>
//               <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}>
//                 Login to AgriHub
//               </Typography>

//               {!otpSent ? (
//                 <form onSubmit={handleSendOTP}>
//                   <TextField
//                     fullWidth
//                     label="Mobile Number"
//                     name="mobile"
//                     type="tel"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     variant="outlined"
//                     required
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <PhoneIcon sx={{ color: "primary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{ mb: 3 }}
//                   />
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     disabled={loading}
//                     sx={{ py: 1.5, fontSize: "1.1rem" }}
//                   >
//                     {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
//                   </Button>
//                 </form>
//               ) : (
//                 <form onSubmit={handleVerifyOTP}>
//                   <Typography variant="body2" sx={{ textalign: "center", mb: 2, color: "text.secondary" }}>
//                     Enter the 6-digit OTP sent to {formData.mobile}
//                   </Typography>
//                   <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//                     {[...Array(6)].map((_, index) => (
//                       <motion.div
//                         key={index}
//                         variants={otpBoxVariants}
//                         initial="hidden"
//                         animate="visible"
//                         transition={{ delay: index * 0.1 }}
//                       >
//                         <TextField
//                           inputRef={(el) => (otpRefs.current[index] = el)}
//                           variant="outlined"
//                           inputProps={{
//                             maxLength: 1,
//                             style: { textAlign: "center", fontSize: "1.5rem", padding: "10px" },
//                           }}
//                           value={formData.otp[index] || ""}
//                           onChange={(e) => handleOtpChange(e, index)}
//                           onKeyDown={(e) => handleOtpKeyDown(e, index)}
//                           sx={{ width: "50px", "& .MuiOutlinedInput-root": { height: "60px" } }}
//                         />
//                       </motion.div>
//                     ))}
//                   </Box>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     disabled={loading}
//                     sx={{ py: 1.5, fontSize: "1.1rem" }}
//                   >
//                     {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
//                   </Button>
//                 </form>
//               )}

//               <Divider sx={{ my: 3 }} />
//               <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
//                 Don’t have an account?{" "}
//                 <Button onClick={handleSignUp} sx={{ color: "primary.main", textDecoration: "underline", p: 0 }}>
//                   Sign up
//                 </Button>
//               </Typography>
//             </CardContent>
//           </Card>
//         </Box>
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="colored"
//         />
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default LoginPage;
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "../components/Navbar";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import PhoneIcon from "@mui/icons-material/Phone";
import "./styles/LoginPage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LoginPage = () => {
  const [formData, setFormData] = useState({ mobile: "", otp: "" });
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/users/profile`, { withCredentials: true })
      .then((response) => {
        if (response.data) {
          navigate(response.data.isAdmin ? "/admin-dashboard" : "/products");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = formData.otp.split("");
      newOtp[index] = value;
      setFormData({ ...formData, otp: newOtp.join("") });
      if (value && index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Mobile number must be 10 digits.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/login`,
        { mobile: formData.mobile },
        { withCredentials: true }
      );
      toast.success("OTP sent to your mobile!", { autoClose: 2000 });
      setOtpSent(true);
      setFormData({ ...formData, otp: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/verify-login-otp`,
        { mobile: formData.mobile, otp: formData.otp },
        { withCredentials: true }
      );
      toast.success("Login successful!", { autoClose: 1500 });
      setTimeout(() => {
        navigate(response.data.user.isAdmin ? "/admin-dashboard" : "/products");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const theme = createTheme({
    palette: {
      primary: { main: "#4CAF50" },
      secondary: { main: "#FF5722" },
      background: { default: "#F5F7FA" },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      h4: { fontWeight: 700 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "none",
            padding: "12px 24px",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4CAF50",
            },
          },
        },
      },
    },
  });

  const otpBoxVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  if (loading && !otpSent) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
          }}
        >
          <CircularProgress size={60} sx={{ color: "primary.main" }} />
        </motion.div>
        <Typography sx={{ ml: 2, color: "text.secondary" }}>
          Checking session...
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <NavigationBar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pt: 8,
            px: 2,
          }}
        >
          <Card sx={{ maxWidth: 450, width: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                sx={{ textAlign: "center", color: "primary.main", mb: 1 }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}
              >
                Login to AgriHub
              </Typography>

              {!otpSent ? (
                <form onSubmit={handleSendOTP}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ py: 1.5, fontSize: "1.1rem" }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      mb: 2,
                      color: "text.secondary",
                    }}
                  >
                    Enter the 6-digit OTP sent to {formData.mobile}
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
                  >
                    {[...Array(6)].map((_, index) => (
                      <motion.div
                        key={index}
                        variants={otpBoxVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                      >
                        <TextField
                          inputRef={(el) => (otpRefs.current[index] = el)}
                          variant="outlined"
                          inputProps={{
                            maxLength: 1,
                            style: {
                              textAlign: "center",
                              fontSize: "1.5rem",
                              padding: "10px",
                            },
                          }}
                          value={formData.otp[index] || ""}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          sx={{
                            width: "50px",
                            "& .MuiOutlinedInput-root": { height: "60px" },
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ py: 1.5, fontSize: "1.1rem" }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </form>
              )}

              <Divider sx={{ my: 3 }} />
              <Typography
                variant="body2"
                sx={{ textAlign: "center", color: "text.secondary" }}
              >
                Don’t have an account?{" "}
                <Button
                  onClick={handleSignUp}
                  sx={{
                    color: "primary.main",
                    textDecoration: "underline",
                    p: 0,
                  }}
                >
                  Sign up
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
