import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  Box,
  Avatar,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import WorkIcon from "@mui/icons-material/Work";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import CategoryIcon from "@mui/icons-material/Category";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import "./styles/Sidebar.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const Sidebar = ({ onToggleSidebar, isMobile, open, setOpen }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("${API_BASE_URL}/api/users/me", { withCredentials: true });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    axios
      .post("${API_BASE_URL}/api/users/logout", {}, { withCredentials: true })
      .then(() => {
        const savedDataKey = `savedCustomerData_${user?.username}`;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        localStorage.removeItem(savedDataKey);
        setUser(null);
        navigate("/login");
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
    { text: "Manage Vendor", icon: <StorefrontIcon />, path: "/manage-vendors" },
    { text: "Manage Category", icon: <CategoryIcon />, path: "/manage-category" },
    { text: "Manage Products", icon: <ShoppingCartIcon />, path: "/manage-products" },
    { text: "Manage Customers", icon: <PeopleIcon />, path: "/manage-customers" },
    { text: "Manage Inventory", icon: <InventoryIcon />, path: "/manage-inventory" },
    { text: "Manage Services", icon: <BuildIcon />, path: "/manage-service" },
    { text: "Manage Orders", icon: <ShoppingBagIcon />, path: "/manage-orders" },
    { text: "Manage Labor", icon: <WorkIcon />, path: "/add-labor" },
  ];

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={() => isMobile && setOpen(false)}
      sx={{
        width: open ? 260 : 70,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? 260 : 70,
          boxSizing: "border-box",
          transition: "width 0.3s ease-in-out",
          background: "#F5F7FA", // Light background consistent with other pages
          color: "#212121",
          borderRight: "1px solid #E0E0E0",
          zIndex: 1200,
        },
      }}
      ModalProps={{
        keepMounted: true, // Better performance on mobile
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          padding: "12px 16px",
          backgroundColor: "#2E7D32", // Primary color from theme
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        {open && (
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFF", letterSpacing: "1px" }}>
            AgriHub Admin
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={() => setOpen(!open)} sx={{ color: "#FFF" }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Box>

      {/* User Profile */}
      {open && user && (
        <Box sx={{ padding: "16px", textAlign: "center", bgcolor: "#E8F5E9" }}>
          <Avatar
            sx={{
              bgcolor: "#2E7D32",
              margin: "0 auto",
              width: 50,
              height: 50,
              border: "2px solid #2E7D32",
            }}
          >
            {user.username?.charAt(0) || "U"}
          </Avatar>
          <Typography variant="body1" sx={{ mt: 1, color: "#212121", fontWeight: "medium" }}>
            {user.username || "Admin"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#757575" }}>
            {user.email || "admin@agrihub.com"}
          </Typography>
        </Box>
      )}
      <Divider sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }} />

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => isMobile && setOpen(false)}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              borderRadius: location.pathname === item.path ? "0.5rem" : "0",
              bgcolor: location.pathname === item.path ? "#81C78433" : "transparent", // Light secondary color for active
              "&:hover": {
                bgcolor: "#81C78433",
                "& .MuiListItemIcon-root": { color: "#2E7D32" },
                transition: "background-color 0.3s ease-in-out",
              },
              transition: "background-color 0.3s ease-in-out",
              margin: "4px 8px",
              width: location.pathname === item.path ? "calc(100% - 8px)" : "auto",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: open ? 40 : 0,
                color: location.pathname === item.path ? "#2E7D32" : "#757575",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <Collapse in={open} orientation="horizontal" timeout="auto">
              <ListItemText
                primary={item.text}
                sx={{
                  color: location.pathname === item.path ? "#2E7D32" : "#212121",
                  "& .MuiTypography-root": {
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    fontSize: "14px",
                  },
                }}
              />
            </Collapse>
          </ListItemButton>
        ))}
      </List>

      {/* Logout */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            justifyContent: open ? "initial" : "center",
            "&:hover": { bgcolor: "#81C78433" },
            transition: "background-color 0.3s ease-in-out",
            margin: "4px 8px",
          }}
        >
          <ListItemIcon sx={{ minWidth: open ? 40 : 0, color: "#757575" }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <Collapse in={open} orientation="horizontal" timeout="auto">
            <ListItemText
              primary="Logout"
              sx={{ color: "#212121", "& .MuiTypography-root": { fontWeight: 500 } }}
            />
          </Collapse>
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;