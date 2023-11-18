import React from "react";
// Mui Modules
import { styled, useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import MuiDrawer from "@mui/material/Drawer";
import Collapse from "@mui/material/Collapse";
import Link from "@mui/material/Link";

// MUi Icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ReportIcon from "@mui/icons-material/Report";

// Layout Variables
import { drawerWidth, listItems } from "../variables";

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SidebarDrawer(props) {
  const theme = useTheme();
  const { pathname } = useLocation();
  // Drawer Props
  const { open, handleDrawerClose, handleDrawerOpen } = props;

  // Collapsable list item state and handlers
  const [openSubItem, setOpen] = React.useState(true);

  const handleClick = () => {
    if (!open) {
      handleDrawerOpen();
      setOpen(true);
    } else {
      setOpen(!openSubItem);
    }
  };
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {listItems.map((item, index) => (
          <ListItem key={item.id} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={handleClick}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 0.5 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {item.sunItems.length > 0
                ? openSubItem
                  ? open && <ExpandLess />
                  : open && <ExpandMore />
                : null}
            </ListItemButton>
            {item.sunItems.length > 0 && open ? (
              <Collapse in={openSubItem} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.sunItems.map((item) => (
                    <Link key={item.id} href={item.path} underline="none">
                      <ListItemButton
                        sx={{ pl: 0 }}
                        selected={pathname === item.path ? true : false}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </Link>
                  ))}
                </List>
              </Collapse>
            ) : null}
          </ListItem>
        ))}
        <Link href="/reports" underline="none">
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={pathname === "/reports" ? true : false}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 1 : "auto",
                  justifyContent: "center",
                }}
              >
                <ReportIcon />
              </ListItemIcon>
              <ListItemText
                primary={"استعلام سوابق (گزارشات)"}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/personal-reports" underline="none">
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={pathname === "/personal-reports" ? true : false}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 1 : "auto",
                  justifyContent: "center",
                }}
              >
                <ReportIcon />
              </ListItemIcon>
              <ListItemText
                primary={"استعلام گزارشات فردی"}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
}
