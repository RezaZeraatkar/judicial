import Excel from "exceljs";
import FileSaver from "file-saver";

export async function exportExcel(cols, rows) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("worksheet1");

  // worksheet setup and styles
  worksheet.views = [{ rightToLeft: true }];

  // define columns
  worksheet.columns = cols;

  // populate data
  worksheet.addRows(rows);

  // // Auto-fit columns
  // worksheet.columns.forEach((column) => {
  //   let maxLength = column.header.length;
  //   column.eachCell({ includeEmpty: true }, (cell) => {
  //     const columnLength = cell.value ? cell.value.toString().length : 10;
  //     maxLength = Math.max(maxLength, columnLength);
  //   });
  //   column.width = maxLength < 12 ? 12 : maxLength;
  // });

  // Set alignment and font for each cell
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.font = { name: "B Nazanin", size: 10, bold: false, italic: false };
    });
  });

  // Format header cells
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    // cell.border = { color: { argb: "FF000000" }, style: "thin" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFA500" },
    };
    cell.font = { name: "B Nazanin", size: 11, bold: true, italic: false };
  });

  // Set table style and enable filtering
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: rows.length + 1, column: cols.length },
  };

  // write to a new buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Download excel file
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const data = new Blob([buffer], { type: fileType });
  FileSaver.saveAs(data, "excel" + fileExtension);
}
