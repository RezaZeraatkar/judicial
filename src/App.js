import React from "react";
import { Routes, Route } from "react-router-dom";
// import { useUserContext } from "./hocs/UserProvider";

import Layout from "./layout/Layout";

// Pages Components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import EmployeeInfo from "./pages/EmployeeInfo";
import SoldierInfo from "./pages/SoldierInfo";
import Applauses from "./pages/Applauses";
import Punishments from "./pages/Punishments";
import Crimes from "./pages/Crimes";
import Remarks from "./pages/Remarks";
import Reports from "./pages/Reports";
import NoPage from "./pages/NoPage";
import NotoriousServices from "./pages/NotoriousServicesList";
import UsersList from "./pages/UsersList";
import ApplauseTypes from "./pages/ApplauseTypesList";
import PunishmentWrongdoingTypes from "./pages/punishmentWrongdoingTypeList";
import PunishmentsTypesList from "./pages/PunishmentTypesList";
import HoghughiList from "./pages/HoghughiList";
import JudicialAuditRefereesList from "./pages/JudicialAuditRefereesList";
import RemarkWrongdoingList from "./pages/RemarkWrongdoingList";
import RemarkTypeList from "./pages/RemarkTypeList";
import PersonalReport from "./pages/PersonalReport";
import Settings from "./pages/Settings";

// Define all routes with access levels
const allRoutes = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: Layout,
    routes: [
      { path: "/", component: Home },
      { path: "/employeeInfo", component: EmployeeInfo },
      { path: "/soldierInfo", component: SoldierInfo },
      { path: "/applauses", component: Applauses },
      { path: "/punishments", component: Punishments },
      { path: "/crimes", component: Crimes },
      { path: "/remarks", component: Remarks },
      { path: "/reports", component: Reports },
      { path: "/personal-reports", component: PersonalReport },
      { path: "/register", component: Register },
      { path: "/list/users", component: UsersList },
      {
        path: "/list/notoriuos-services-list",
        component: NotoriousServices,
      },
      {
        path: "/applauses/applause-type-list",
        component: ApplauseTypes,
      },
      {
        path: "/punishments/punishment-wrongdoing-type-list",
        component: PunishmentWrongdoingTypes,
      },
      {
        path: "/punishments/punishment-type-list",
        component: PunishmentsTypesList,
      },
      {
        path: "/crimes/hoghughi-list",
        component: HoghughiList,
      },
      {
        path: "/crimes/crime-type-list",
        component: UsersList,
      },
      {
        path: "/crimes/judicial-audit-referees-list",
        component: JudicialAuditRefereesList,
      },
      {
        path: "/remarks/remark-wrongdoing-list",
        component: RemarkWrongdoingList,
      },
      {
        path: "/remarks/remark-type-list",
        component: RemarkTypeList,
      },
      { path: "/settings", component: Settings },
      { path: "*", component: NoPage },
    ],
  },
];

// Fetch user access level (Replace this with your authentication logic)
// const getUserAccessLevel = () => {
// Implement your logic to retrieve the user's access level
// from local storage or server and return it
// };

// Filter routes based on user access level
// const filteredRoutes = allRoutes.filter((route) => {
//   if (route.accessLevel === "public") {
//     return true; // Allow public routes for everyone
//   }
//   const userAccessLevel = getUserAccessLevel();
//   return route.accessLevel === userAccessLevel;
// });

export default function App() {
  // const { user } = useUserContext();
  // console.log(user);
  const renderRoutes = (routes) =>
    routes.map((route) => (
      <Route key={route.path} path={route.path} element={<route.component />}>
        {route.routes && renderRoutes(route.routes)}
      </Route>
    ));

  return <Routes>{renderRoutes(allRoutes)}</Routes>;
}
