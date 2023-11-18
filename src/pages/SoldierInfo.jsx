import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomDataGrid from "../components/datagrid/customDataGrid_bulk";
import renderCellExpand from "../components/datagrid/renderCellExpand";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Employee API Request Slices
import {
  useGetSoldiersQuery,
  selectAllSoldiersEnts,
  selectSoldiersIds,
} from "../services/api/garrisonAppApi";
import useServerErrors from "../utils/useServerErrors";

const Height = 500;

const cols = [
  {
    field: "id",
    headerName: "شناسه",
    align: "center",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    hideable: false,
  },
  {
    field: "row",
    headerName: "ردیف",
    width: 10,
    align: "center",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
  },
  {
    field: "parvandeCode",
    headerName: "شماره پرونده",
    align: "right",
    headerAlign: "center",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "name",
    headerName: "نام و نام خانوادگی",
    width: 150,
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "pasdariCode",
    headerName: "کد پاسداری",
    align: "left",
    width: 82,
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "nationalCode",
    headerName: "کد ملی",
    align: "left",
    headerAlign: "right",
    width: 82,
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "fathername",
    headerName: "نام پدر",
    width: 80,
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "educaionalLevel",
    headerName: "تحصیلات",
    width: 70,
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "vahed_title",
    headerName: "رده خدمتی",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "sexuality",
    headerName: "جنسیت",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "registerType",
    headerName: "عضویت",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "militaryRank",
    headerName: "درجه",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "militaryLevel",
    headerName: "رتبه",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "address",
    headerName: "آدرس",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "phoneNumber",
    headerName: "شماره تلفن",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "physicalState",
    headerName: "وضعیت جسمانی",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "mentalState",
    headerName: "وضعیت روانی",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "serviceStatus",
    headerName: "وضعیت خدمتی",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "serviceCategory",
    headerName: "رسته خدمتی",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "birthDate",
    headerName: "تاریخ تولد",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "serviceEntryDate",
    headerName: "تاریخ اعزام",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
  {
    field: "maritalStatus",
    headerName: "وضعیت تاهل",
    align: "left",
    headerAlign: "right",
    headerClassName: "DatagridHeaderBGC",
    renderCell: renderCellExpand,
  },
];

export default function EmployeeInfo() {
  let rows = [];
  const handleServerErrors = useServerErrors();
  const employees = useSelector((state) => selectAllSoldiersEnts(state));
  const employeesIds = useSelector((state) => selectSoldiersIds(state));
  const { isLoading, isFetching, isSuccess, isError, error } =
    useGetSoldiersQuery();

  useEffect(() => {
    handleServerErrors(error);
  }, [isError, error, handleServerErrors]);

  if (isSuccess) {
    rows = employeesIds.map((employeeId, index) => ({
      id: employeeId,
      row: index + 1,
      parvandeCode: Number(employees[employeeId]["code"]) || "",
      name:
        `${employees[employeeId]["firstname"]} ${employees[employeeId]["surname"]}` ||
        "",
      pasdariCode: employees[employeeId]["pasdari_code"] || "",
      nationalCode: employees[employeeId]["nationalcode"] || "",
      fathername: employees[employeeId]["fathername"] || "",
      educaionalLevel: employees[employeeId]["tahsili_title"] || "",
      vahed_title: employees[employeeId]["vahed_title"] || "",
      sexuality: "مرد",
      registerType: employees[employeeId]["ozviyat_type_title"] || "",
      militaryRank: employees[employeeId]["daraje_title"] || "",
      militaryLevel: employees[employeeId]["daraje_title"] || "",
      address: employees[employeeId]["homeAddress"] || "",
      phoneNumber: employees[employeeId]["phoneNumber"] || "",
      physicalState: employees[employeeId]["vazjesmaniTitle"] || "",
      mentalState: employees[employeeId]["vazravaniTitle"] || "",
      serviceStatus: employees[employeeId]["vkhedmatTitle"] || "",
      serviceCategory: employees[employeeId]["serviceCategory"] || "",
      birthDate: employees[employeeId]["birthdate"] || "",
      serviceEntryDate: employees[employeeId]["ezamDate"] || "",
      maritalStatus: employees[employeeId]["marigTitle"] || "",
    }));
  }

  return (
    <Box>
      <Paper sx={{ mb: 2, p: "15px" }}>
        <Typography variant="h5">اطلاعات سربازان</Typography>
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
            isLoading={isFetching || isLoading}
          />
        </Box>
      </Paper>
    </Box>
  );
}
