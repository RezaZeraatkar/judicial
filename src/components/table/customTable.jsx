import React from "react";
import styled from "@emotion/styled";

const Table = styled("table")(({ show }) => ({
  zIndex: 1000,
  backgroundColor: "#FFF",
  position: "absolute",
  borderCollapse: "collapse",
  display: show ? "block" : "none",

  "& thead": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    whiteSpace: "nowrap",
  },

  "& th, td": {
    border: "1px solid rgba(0, 0, 0, 0.2)",
    padding: "3px",
    whiteSpace: "nowrap",
  },

  "& tr": {
    cursor: "pointer",
  },

  "& tr:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
}));

export default function CustomTable({ data, show, setFormData }) {
  return (
    <Table dir="rtl" show={show}>
      <thead>
        <tr>
          <th>کدپرونده</th>
          <th>کدپاسداری</th>
          <th>نام</th>
          <th>نام خانوادگی</th>
          <th>نام پدر</th>
          <th>کدملی</th>
        </tr>
      </thead>
      <tbody>
        {data["ids"]?.map((soldierId) => (
          <tr key={soldierId} onClick={() => setFormData(soldierId)}>
            <td>{data["entities"][`${soldierId}`].code}</td>
            <td>{data["entities"][`${soldierId}`].pasdari_code}</td>
            <td>{data["entities"][`${soldierId}`].firstname}</td>
            <td>{data["entities"][`${soldierId}`].surname}</td>
            <td>{data["entities"][`${soldierId}`].fathername}</td>
            <td>{data["entities"][`${soldierId}`].nationalcode}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
