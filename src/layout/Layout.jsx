import React from "react";
import { Outlet } from "react-router-dom";

// Mui Modules
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

// Layout Components
import HeaderDrawer from "./HeaderDrawer";
import MenuAccount from "../components/accountMenu/AccountMenu";
import SidebarDrawer from "./SidebarDrawer";
import { ToastContainer } from "react-toastify";
// import Footer from "./Footer";

// Layout Variables
import { drawerWidth } from "../variables";
import WithProtectedRoutes from "../hocs/withProtectedRoutes";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function Layout() {
  // Drawer State
  const [open, setOpen] = React.useState(true);
  // Profile MenuState
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Drawer Handlers
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  //Profile Menu Options
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F7F9FB" }}>
      <HeaderDrawer
        open={open}
        handleProfileMenuOpen={handleProfileMenuOpen}
        handleDrawerOpen={handleDrawerOpen}
      />
      <MenuAccount
        isMenuOpen={isMenuOpen}
        anchorEl={anchorEl}
        handleMenuClose={handleMenuClose}
      />
      <SidebarDrawer
        open={open}
        handleDrawerClose={() => handleDrawerClose()}
        drawerWidth={drawerWidth}
        handleDrawerOpen={handleDrawerOpen}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: 500 }}>
        <DrawerHeader />
        <ToastContainer />
        <Outlet />
        {/* <Footer /> */}
      </Box>
    </Box>
  );
}
export default WithProtectedRoutes(Layout);
