import React from "react";
// Mui Modules
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiAppBar from "@mui/material/AppBar";

// MUi Icons
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

// Layout Variables
import { drawerWidth } from "../variables";

// Layout Components
import ListMenu from "../components/ListMenu/ListMenu";
// Logo
import Logo from "../assets/images/invertedlogo.png";

// styledComponents
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function HeaderDrawer(props) {
  const { handleProfileMenuOpen, open, handleDrawerOpen } = props;
  // Profile MenuState Handlers
  const menuId = "account-menu";
  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Link
          href="/"
          underline="none"
          sx={{
            display: { xs: "none", sm: "flex" },
            fontSize: 18,
            fontWeight: "bold",
            alignItems: "center",
            color: "#FFF",
          }}
        >
          <Box
            component="img"
            sx={{ marginRight: "10px" }}
            height="24px"
            width="24px"
            src={Logo}
          ></Box>
          <Typography variant="h6">نرم‌افزار قضایی</Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <ListMenu />
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
