// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Avatar,
//   Button,
//   Card,
//   CardContent,
//   TextField,
//   Grid,
//   Container,
//   CircularProgress,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { motion } from "framer-motion";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Cancel";
// import defaultProfilePic from "../components/imgs/customer.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await axios.get("${API_BASE_URL}/api/users/profile", {
//           withCredentials: true,
//         });
//         setUser(response.data);
//         setFormData(response.data);
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         toast.error("Failed to load profile. Please log in again.", { autoClose: 2000 });
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserProfile();

//     const handleResize = () => setIsMobile(window.innerWidth < 600);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     if (!formData.firstName || !formData.lastName || !formData.mobile) {
//       toast.error("First Name, Last Name, and Mobile are required.", { autoClose: 2000 });
//       return;
//     }
//     if (!/^\d{10}$/.test(formData.mobile)) {
//       toast.error("Mobile number must be 10 digits.", { autoClose: 2000 });
//       return;
//     }
//     try {
//       const response = await axios.put("${API_BASE_URL}/api/users/update", formData, {
//         withCredentials: true,
//       });
//       setUser(response.data);
//       setIsEditing(false);
//       toast.success("Profile updated successfully!", { autoClose: 2000 });
//     } catch (error) {
//       console.error("Failed to update profile:", error);
//       toast.error("Failed to update profile. Please try again.", { autoClose: 2000 });
//     }
//   };

//   const handleEditClick = () => setIsEditing(true);
//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setFormData(user);
//   };

//   const theme = createTheme({
//     palette: {
//       primary: { main: "#2E7D32" },
//       secondary: { main: "#81C784" },
//       background: { default: "#F7F9F7", paper: "#FFFFFF" },
//       text: { primary: "#1A1A1A", secondary: "#616161" },
//     },
//     typography: { fontFamily: "'Poppins', sans-serif" },
//     components: {
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: "20px",
//             boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//             transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             "&:hover": {
//               transform: "translateY(-8px)",
//               boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
//             },
//             background: "#E8F5E9",
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: "10px",
//             textTransform: "none",
//             padding: "10px 20px",
//             fontWeight: 600,
//             backgroundColor: "#2E7D32",
//             color: "#FFF",
//             "&:hover": {
//               backgroundColor: "#81C784",
//               boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
//             },
//             transition: "all 0.3s ease",
//           },
//         },
//       },
//       MuiTextField: {
//         styleOverrides: {
//           root: {
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "10px",
//               "& fieldset": { borderColor: "#81C784" },
//               "&:hover fieldset": { borderColor: "#4CAF50" },
//               "&.Mui-focused fieldset": { borderColor: "#2E7D32" },
//             },
//           },
//         },
//       },
//     },
//   });

//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   if (loading) {
//     return (
//       <ThemeProvider theme={theme}>
//         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//           <CircularProgress color="primary" />
//         </Box>
//       </ThemeProvider>
//     );
//   }

//   if (!user) return null;

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: { xs: 4, sm: 6 } }}>
//         {/* Header Section */}
//         <Box
//           component={motion.section}
//           initial="hidden"
//           animate="visible"
//           variants={fadeIn}
//           sx={{ py: { xs: 4, sm: 5 }, bgcolor: "#E8F5E9", textAlign: "center" }}
//         >
//           <Container maxWidth="lg">
//             <Typography
//               variant={isMobile ? "h4" : "h2"}
//               sx={{
//                 fontWeight: 700,
//                 color: "primary.main",
//                 mb: 1.5,
//                 fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
//               }}
//             >
//               Your Profile
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{
//                 color: "text.secondary",
//                 maxWidth: "700px",
//                 mx: "auto",
//                 fontSize: { xs: "1rem", md: "1.2rem" },
//                 fontWeight: 400,
//               }}
//             >
//               Update your personal details below.
//             </Typography>
//           </Container>
//         </Box>

//         {/* Profile Content */}
//         <Box
//           component={motion.section}
//           initial="hidden"
//           animate="visible"
//           variants={fadeIn}
//           sx={{ py: { xs: 4, sm: 6 } }}
//         >
//           <Container maxWidth="lg">
//             <Grid container spacing={4}>
//               {/* Profile Card */}
//               <Grid item xs={12} md={4}>
//                 <Card>
//                   <CardContent sx={{ textAlign: "center", p: { xs: 3, sm: 4 } }}>
//                     <Avatar
//                       src={user.profilePhoto || defaultProfilePic}
//                       alt={`${user.firstName} ${user.lastName}`}
//                       sx={{
//                         width: { xs: 120, md: 150 },
//                         height: { xs: 120, md: 150 },
//                         mx: "auto",
//                         mb: 2,
//                         border: "4px solid #2E7D32",
//                       }}
//                     />
//                     <Typography
//                       variant={isMobile ? "h6" : "h5"}
//                       sx={{ fontWeight: "bold", color: "text.primary" }}
//                     >
//                       {user.firstName} {user.lastName}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                       {user.mobile}
//                     </Typography>
//                     {!isEditing && (
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<EditIcon />}
//                         onClick={handleEditClick}
//                         sx={{ width: "100%" }}
//                       >
//                         Edit Profile
//                       </Button>
//                     )}
//                   </CardContent>
//                 </Card>
//               </Grid>

//               {/* Details Card */}
//               <Grid item xs={12} md={8}>
//                 <Card>
//                   <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
//                     <Typography
//                       variant={isMobile ? "h6" : "h5"}
//                       sx={{ fontWeight: "bold", mb: 3, color: "text.primary" }}
//                     >
//                       Profile Details
//                     </Typography>
//                     <Grid container spacing={2}>
//                       {[
//                         { label: "Customer ID", name: "username", type: "text", disabled: true },
//                         { label: "First Name", name: "firstName", type: "text" },
//                         { label: "Last Name", name: "lastName", type: "text" },
//                         { label: "Phone", name: "mobile", type: "tel" },
//                       ].map(({ label, name, type, disabled }) => (
//                         <Grid container item spacing={2} key={name} sx={{ mb: 2 }}>
//                           <Grid item xs={12} sm={4}>
//                             <Typography variant="body1" sx={{ fontWeight: "medium", color: "text.primary" }}>
//                               {label}
//                             </Typography>
//                           </Grid>
//                           <Grid item xs={12} sm={8}>
//                             {isEditing && !disabled ? (
//                               <TextField
//                                 fullWidth
//                                 type={type}
//                                 name={name}
//                                 value={formData[name] || ""}
//                                 onChange={handleChange}
//                                 variant="outlined"
//                                 size={isMobile ? "small" : "medium"}
//                                 error={name === "mobile" && !/^\d{10}$/.test(formData[name] || "")}
//                                 helperText={
//                                   name === "mobile" && !/^\d{10}$/.test(formData[name] || "")
//                                     ? "Enter a valid 10-digit number"
//                                     : ""
//                                 }
//                               />
//                             ) : (
//                               <Typography variant="body1" color="text.secondary">
//                                 {user[name] || "N/A"}
//                               </Typography>
//                             )}
//                           </Grid>
//                         </Grid>
//                       ))}
//                     </Grid>

//                     {isEditing && (
//                       <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           startIcon={<SaveIcon />}
//                           onClick={handleSave}
//                         >
//                           Save Changes
//                         </Button>
//                         <Button
//                           variant="outlined"
//                           color="primary"
//                           startIcon={<CancelIcon />}
//                           onClick={handleCancelEdit}
//                         >
//                           Cancel
//                         </Button>
//                       </Box>
//                     )}
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
//           </Container>
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

// export default ProfilePage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import NavigationBar from "../components/Navbar"; // Assuming this exists
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultProfilePic from "../components/imgs/customer.png";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
          withCredentials: true,
        });
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        toast.error("Failed to load profile. Please log in again.", {
          autoClose: 2000,
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.mobile) {
      toast.error("First Name, Last Name, and Mobile are required.", {
        autoClose: 2000,
      });
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Mobile number must be 10 digits.", { autoClose: 2000 });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/users/update`,
        formData,
        { withCredentials: true }
      );
      setUser(response.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to update profile. Please try again.", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(user);
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
      h6: { fontWeight: 600 },
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  if (loading && !user) {
    return (
      <ThemeProvider theme={theme}>
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
              transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          >
            <CircularProgress size={60} sx={{ color: "primary.main" }} />
          </motion.div>
          <Typography sx={{ ml: 2, color: "text.secondary" }}>
            Loading profile...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) return null;

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
          <Card sx={{ maxWidth: 900, width: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <Typography
                  variant="h4"
                  sx={{
                    textAlign: "center",
                    color: "primary.main",
                    mb: 1,
                  }}
                >
                  Your Profile
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    mb: 4,
                  }}
                >
                  Manage your personal details
                </Typography>
              </motion.div>

              <Grid container spacing={3}>
                {/* Profile Avatar Section */}
                <Grid item xs={12} md={4}>
                  <motion.div variants={fadeIn} initial="hidden" animate="visible">
                    <Card sx={{ textAlign: "center", p: 3 }}>
                      <Avatar
                        src={user.profilePhoto || defaultProfilePic}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{
                          width: { xs: 100, md: 120 },
                          height: { xs: 100, md: 120 },
                          mx: "auto",
                          mb: 2,
                          border: "3px solid",
                          borderColor: "primary.main",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          mb: 1,
                        }}
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mb: 2 }}
                      >
                        {user.mobile}
                      </Typography>
                      {!isEditing && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={handleEditClick}
                          fullWidth
                          sx={{ py: 1.2 }}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                </Grid>

                {/* Profile Details Section */}
                <Grid item xs={12} md={8}>
                  <motion.div variants={fadeIn} initial="hidden" animate="visible">
                    <Card>
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            mb: 3,
                          }}
                        >
                          Profile Details
                        </Typography>
                        <Grid container spacing={2}>
                          {[
                            {
                              label: "Customer ID",
                              name: "username",
                              type: "text",
                              disabled: true,
                            },
                            {
                              label: "First Name",
                              name: "firstName",
                              type: "text",
                            },
                            { label: "Last Name", name: "lastName", type: "text" },
                            { label: "Phone", name: "mobile", type: "tel" },
                          ].map(({ label, name, type, disabled }) => (
                            <Grid
                              container
                              item
                              spacing={2}
                              key={name}
                              sx={{ mb: 2 }}
                            >
                              <Grid item xs={12} sm={4}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 500,
                                    color: "text.primary",
                                  }}
                                >
                                  {label}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={8}>
                                {isEditing && !disabled ? (
                                  <TextField
                                    fullWidth
                                    type={type}
                                    name={name}
                                    value={formData[name] || ""}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    error={
                                      name === "mobile" &&
                                      !/^\d{10}$/.test(formData[name] || "")
                                    }
                                    helperText={
                                      name === "mobile" &&
                                      !/^\d{10}$/.test(formData[name] || "")
                                        ? "Enter a valid 10-digit number"
                                        : ""
                                    }
                                  />
                                ) : (
                                  <Typography
                                    variant="body1"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {user[name] || "N/A"}
                                  </Typography>
                                )}
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>

                        {isEditing && (
                          <Box
                            sx={{
                              mt: 3,
                              display: "flex",
                              gap: 2,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<SaveIcon />}
                              onClick={handleSave}
                              disabled={loading}
                            >
                              {loading ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              startIcon={<CancelIcon />}
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />
              <Typography
                variant="body2"
                sx={{ textAlign: "center", color: "text.secondary" }}
              >
                Want to log out?{" "}
                <Button
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "primary.main",
                    textDecoration: "underline",
                    p: 0,
                  }}
                >
                  Log out
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

export default ProfilePage;