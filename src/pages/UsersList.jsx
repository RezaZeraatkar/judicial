import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
// import TextField from "@mui/material/TextField";
import { createTheme, useTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import * as locales from "@mui/material/locale";
// Mui Icons
// import Add from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";

// Components
import CustomDataGrid from "../components/datagrid/customDataGrid_bulk";
// import EditButton from "../components/Buttons/editButton";
import renderCellExpand from "../components/datagrid/renderCellExpand";

// API
import {
  useGetUsersQuery,
  selectAllUsersEntities,
  selectUsersIds,
  useUpdateUserMutation,
} from "../services/api/list/list.js";

// Variables
const ToolBarHeaderText = "لیست کاربران";
const Height = 500;

// function UserForm({ cols, handleClick }) {
//   const [values, setValues] = React.useState({});

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setValues({ ...values, [name]: value });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     handleClick(values);
//     setValues({});
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <IconButton variant="contained" color="primary" type="submit">
//         <Add />
//       </IconButton>
//       {cols.map((col) => {
//         if (col.show) {
//           return (
//             <TextField
//               size="small"
//               key={col.field}
//               name={col.field}
//               label={col.headerName}
//               value={values[col.field] || ""}
//               onChange={handleInputChange}
//             />
//           );
//         } else return null;
//       })}
//     </form>
//   );
// }

export default function UsersList(props) {
  const navigate = useNavigate();
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);

  const [snackbar, setSnackbar] = React.useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);
  const cols = [
    {
      field: "id",
      headerName: "شناسه",
      flex: 0.5,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      hideable: false,
      show: false,
    },
    {
      field: "row",
      headerName: "ردیف",
      flex: 0.5,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      show: false,
    },
    {
      field: "name",
      headerName: "نام",
      flex: 0.8,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      // editable: true,
      show: true,
    },
    {
      field: "username",
      headerName: "نام کاربری",
      flex: 1,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      renderCell: renderCellExpand,
      // editable: true,
      show: true,
    },
    {
      field: "Actions",
      width: 15,
      align: "left",
      headerAlign: "right",
      headerClassName: "DatagridHeaderBGC",
      headerName: "",
      sortable: false,
      hideable: false,
      show: false,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <Delete />
          </IconButton>
        );
      },
    },
  ];
  let rows = [];

  // users selector
  const users = useSelector((state) => selectAllUsersEntities(state));
  const userIds = useSelector((state) => selectUsersIds(state));

  // request to get rows for table
  const { isSuccess, isFetching, isError, error } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();

  const theme = useTheme();

  useEffect(() => {
    if (isError) {
      // handle Errors [todo: must be extracted to its hook]
      if (error.status === 401) {
        navigate("/login");
      } else if (error.status === 400) {
        toast.error(error.data.message, { position: "top-right" });
      } else if (error.status === 500) {
        toast.error(error.data.message, { position: "top-right" });
      } else {
        toast.error(error.data.message, { position: "top-right" });
      }
    }
  }, [navigate, isError, error]);

  if (isSuccess) {
    rows = userIds?.map((userId, index) => ({
      id: users[userId].id,
      row: `${index + 1}`,
      name: `${users[userId].name}`,
      username: `${users[userId].username}`,
    }));
  }

  const handleDeleteClick = async (id) => {
    // console.log(id);
    try {
      // const deletedPunishment = await deleteApplause(id).unwrap();
      // toast.success(deletedPunishment.message, { position: "top-right" });
    } catch (error) {
      // if (error.status === 401) {
      //   return <Navigate to="/login" />;
      // } else if (error.status === 400) {
      //   // dispatch(deleteRecommender());
      //   toast.error(error.data.message, { position: "top-right" });
      // } else if (error.status === 500) {
      //   // dispatch(deleteRecommender());
      //   toast.error(error.data.message, { position: "top-right" });
      // } else {
      //   toast.error(error.data.message, { position: "top-right" });
      // }
    }
  };

  // const handleAddUser = (user) => {
  //   console.log(user);
  //   // setRows((prevRows) => [
  //   //   ...prevRows,
  //   //   {
  //   //     id: rows.length + 1,
  //   //     row: `${rows.length + 1}`,
  //   //     ...user,
  //   //   },
  //   // ]);
  // };

  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales["faIR"]),
    [theme],
  );

  function computeMutation(newRow, oldRow) {
    if (newRow.name !== oldRow.name) {
      return `نام از '${oldRow.name}' به '${newRow.name}'`;
    }
    if (newRow.username !== oldRow.username) {
      return `نام کاربری از '${oldRow.age || ""}' به '${newRow.age || ""}'`;
    }
    return null;
  }

  // const processRowUpdate = React.useCallback((newRow, oldRow) => {
  //   const mutation = computeMutation(newRow, oldRow);
  //   if (mutation) {
  //     // Save the arguments to resolve or reject the promise later
  //     setPromiseArguments({ newRow, oldRow });
  //   } else {
  //     // Nothing was changed
  //     setPromiseArguments(null);
  //   }
  // }, []);

  const handleNo = () => {
    // const { oldRow } = promiseArguments;
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      await updateUser(newRow);
      setSnackbar({
        children: "اطلاعات کاربر با موفقیت ویرایش شد!",
        severity: "success",
      });
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: error.message, severity: "error" });
      setPromiseArguments(null);
    }
  };

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog maxWidth="xs" open={!!promiseArguments}>
        <DialogTitle>آیا مطمئنید؟</DialogTitle>
        <DialogContent dividers>
          {`در صورت تایید ${mutation} تغییر خواهت یافت.`}
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            خیر
          </Button>
          <Button onClick={handleYes}>بله</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <ThemeProvider theme={themeWithLocale}>
      {renderConfirmDialog()}
      <Box>
        <Paper sx={{ mb: 2, p: "15px" }}>
          <Typography variant="h5">{ToolBarHeaderText}</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              py: 1,
            }}
          ></Box>
          <Box
            sx={{
              height: Height,
              width: "100%",
              "& .textAlignRight": {
                direction: "ltr",
                textAlign: "right",
              },
            }}
            dir="ltr"
          >
            <CustomDataGrid
              rows={rows}
              columns={cols}
              height={Height}
              // processRowUpdate={processRowUpdate}
              loading={isFetching}
              // toolbar={() => (
              //   <UserForm cols={cols} handleClick={handleAddUser} />
              // )}
            />
            {!!snackbar && (
              <Snackbar
                open
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
              >
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
              </Snackbar>
            )}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
