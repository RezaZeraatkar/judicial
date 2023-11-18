import React, { useEffect } from "react";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

import { judicialAppApi } from "../../services/api/judicialAppApi";
import { useLogoutMutation } from "../../services/api/auth/logoutSlice";
import { useUserContext } from "../../hocs/UserProvider";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function AccountMenu(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [logout, { isSuccess }] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(judicialAppApi.util.resetApiState());
      navigate("/login");
    }
  }, [isSuccess, dispatch, navigate]);

  const {
    isMenuOpen,
    isListsOpen,
    anchorEl,
    handleMenuClose,
    handleListsMenuClose,
    anchorListsEl,
  } = props;
  return (
    <>
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isMenuOpen || false}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar /> {user?.name}
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          <Link href="/register">مدیریت کاربران</Link>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Link href="/settings">تنظیمات</Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          خروج
        </MenuItem>
      </Menu>
      {/* Lists Menu */}
      <Menu
        anchorEl={anchorListsEl}
        id="account-menu"
        open={isListsOpen || false}
        onClose={handleListsMenuClose}
        onClick={handleListsMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>کاربران</MenuItem>
        <MenuItem>
          <Link href="/users/list">لیست کاربران</Link>
        </MenuItem>
        <Divider />
        <MenuItem>تشویقات</MenuItem>
        <MenuItem>
          <Link href="applauses/notoriuos-services-list">نوع خدمات برجسته</Link>
        </MenuItem>
        <MenuItem>
          <Link href="applauses/applause-type-list">نوع تشویق</Link>
        </MenuItem>
        <Divider />
        <MenuItem>تنبیهات</MenuItem>
        <MenuItem>
          <Link href="punishments/punishment-wrongdoing-type-list">
            نوع عمل قابل تنبیه
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="punishments/punishment-type-list">نوع تنبیه</Link>
        </MenuItem>
        <Divider />
        <MenuItem>جرائم</MenuItem>
        <MenuItem>
          <Link href="crimes/hoghughi-list">شاکی‌های حقوقی</Link>
        </MenuItem>
        <MenuItem>
          <Link href="crimes/crime-type-list">نوع جرم</Link>
        </MenuItem>
        <MenuItem>
          <Link href="crimes/judicial-audit-referees-list">
            مراجع قضایی رسیدگی‌کننده
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem>تذکرات</MenuItem>
        <MenuItem>
          <Link href="remarks/remark-wrongdoing-list">نوع عمل قابل تذکر</Link>
        </MenuItem>
        <MenuItem>
          <Link href="remarks/remark-type-list">نوع تذکر</Link>
        </MenuItem>
      </Menu>
    </>
  );
}
