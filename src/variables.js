import { v4 as uuidv4 } from "uuid";
// Mui Icons
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";

// MUI Gloabl Changes for customizations.
export const drawerWidth = 200;
export const TableBorder = "1px solid rgb(0,0,0, 0.2)";

// FAKE Data Creators !!!!!!!!!!!!!!!!!!!!!!
export const listItems = [
  {
    id: uuidv4(),
    text: "اطلاعات پایه",
    icon: <PersonSearchIcon />,
    sunItems: [
      {
        id: uuidv4(),
        text: "اطلاعات پایوران",
        path: "/employeeInfo",
        icon: "",
      },
      {
        id: uuidv4(),
        text: "اطلاعات سربازان",
        path: "/soldierInfo",
        icon: "",
      },
    ],
  },
  {
    id: uuidv4(),
    text: "اطلاعات قضایی",
    icon: <GavelOutlinedIcon />,
    sunItems: [
      {
        id: uuidv4(),
        text: "تشویقات",
        path: "/applauses",
        icon: "",
      },
      {
        id: uuidv4(),
        text: "تنبیهات",
        path: "/punishments",
        icon: "",
      },
      {
        id: uuidv4(),
        text: "جرایم",
        path: "/crimes",
        icon: "",
      },
      {
        id: uuidv4(),
        text: "تذکرات",
        path: "/remarks",
        icon: "",
      },
    ],
  },
];

// functions to create fake data
export function createTableRowsData(
  row,
  parvandeCode,
  name,
  pasdariCode,
  nationalCode,
  fathername,
  educaionalLevel,
  organizationalLevel,
  sexuality,
  registerType,
  militaryRank,
  militaryLevel,
  address,
  phoneNumner,
  physicalState,
  mentalState,
  serviceStatus,
  serviceCategory,
  birthDate,
  serviceEntryDate,
  maritalStatus,
) {
  return {
    row,
    parvandeCode,
    name,
    pasdariCode,
    nationalCode,
    fathername,
    educaionalLevel,
    organizationalLevel,
    sexuality,
    registerType,
    militaryRank,
    militaryLevel,
    address,
    phoneNumner,
    physicalState,
    mentalState,
    serviceStatus,
    serviceCategory,
    birthDate,
    serviceEntryDate,
    maritalStatus,
  };
}

export function createHeadCellsData(tableHeader) {
  return tableHeader;
}
