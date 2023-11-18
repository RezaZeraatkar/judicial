const express = require("express");
const path = require("path");
const fs = require("fs");

const { createReport } = require("docx-templates");
// const { normalize, schema } = require("normalizr");
const {
  findReport,
  findReportsOnApplauses,
  findReportsOnPunishments,
  findReportsOnCrimes,
  findReportsOnRemarks,
  findStatisticalReportsOnApplauses,
  findStatisticalReportsOnPunishments,
  findStatisticalReportsOnCrimes,
  findStatisticalReportsOnRemarks,
  findStatsReportLabels,
  findPersonnelsTotalStatsBasedOnLevels,
  findExcelReportHeaders,
  findExcelComprehensiveReportHeaders,
  findReportFilters,
  findPersonalReport,
} = require("../../services/reports.service");
const { findHoghughiOrganizations } = require("../../services/crimes.service");
const { flattenizer } = require("../../utils/normalizer");
// const requestGarrisonAPI = require("../../utils/garrisonApi");
const { aggregateRows } = require("../../utils/aggregateRows");
const handleSqlFilteringOptions = require("../../utils/handleSqlFilteringOptions");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");

const router = express.Router();

// دریافت گزارشات
router.post("/report", async (req, res, next) => {
  var total_soldiers = 0;
  try {
    const {
      report_type,
      report_filter,
      report_date_range,
      from_date,
      to_date,
      is_valid,
      notorious_services_type,
      applause_type,
      punishment_wrongdoins_type,
      punishment_type,
      crimes_crime_type,
      crimes_judicial_audit_reference,
      remark_wrongdoins_type,
      remark_type,
      ...filters
    } = req.body;

    const reqBody = {
      report_type,
      report_filter,
      report_date_range,
      from_date,
      to_date,
      is_valid,
      notorious_services_type,
      applause_type,
      punishment_wrongdoins_type,
      punishment_type,
      crimes_crime_type,
      crimes_judicial_audit_reference,
      remark_wrongdoins_type,
      remark_type,
      filters,
    };

    // console.log(reqBody);

    const filterString = handleSqlFilteringOptions(reqBody);

    // GET Soldiers Data From garrison API
    // const soldierAPI = await requestGarrisonAPI(
    //   `${req.GarrisonBaseUrl}/soldiers.php`,
    //   next,
    // );
    // if (soldierAPI.status == 200) {
    //   total_soldiers = soldierAPI.data.length;
    // } else {
    //   return next(
    //     new HandleError("خطا در دسترسی به سامانه سربازان (garrison)", [], 500),
    //   );
    // }

    let [personnelsTotalStatsBasedOnLevels] =
      await findPersonnelsTotalStatsBasedOnLevels(total_soldiers);

    let [labels] = await findStatsReportLabels();

    switch (report_type) {
      // گزارش از تشویقات
      case 1:
        // گزارش براساس رده
        if (report_filter == 1) {
          // GET Payvar Nezami Stats divided into rank level
          const [reportData] = await findReportsOnApplauses(
            "vahed_title",
            filterString,
          );
          const [headers] = await findExcelReportHeaders();
          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
          });

          // prepare and normalize data
          const rows = aggregateRows(
            reportData,
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          // console.log(rows);

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        // گزارش براساس محتوا
        if (report_filter == 2) {
          const [reportData] = await findReportsOnApplauses(
            "title",
            filterString,
          );
          const [headers] = await findExcelReportHeaders();
          // const [personnelsTotalStatsBasedOnLevels] =
          //   await findPersonnelsTotalStatsBasedOnLevels();
          // const [labels] = await findStatsReportLabels();

          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
          });

          // prepare and normalize data
          const rows = aggregateRows(
            reportData,
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          // console.log(rows);

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        // گزارش آماری
        if (report_filter == 3) {
          const [reportData] = await findStatisticalReportsOnApplauses(
            filterString,
          );
          const [headers] = await findExcelReportHeaders();
          // const [personnelsTotalStatsBasedOnLevels] =
          //   await findPersonnelsTotalStatsBasedOnLevels();
          //   const [labels] = await findStatsReportLabels();
          const [org] = await findHoghughiOrganizations();

          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
            initialLabelGroup.title = org[0]["description"];
            initialLabelGroup.total = 0;
          });

          // prepare and normalize data
          const rows = flattenizer(
            reportData[0],
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        break;
      // گزارش از تنبیهات
      case 2:
        // گزارش براساس رده
        if (report_filter == 1) {
          // GET Payvar Nezami Stats divided into rank level
          const [reportData] = await findReportsOnPunishments(
            "vahed_title",
            filterString,
          );

          const [headers] = await findExcelReportHeaders();
          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
          });

          // prepare and normalize data
          const rows = aggregateRows(
            reportData,
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          // console.log(rows);

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        // گزارش براساس محتوا
        if (report_filter == 2) {
          // GET Payvar Nezami Stats divided into rank level
          const [reportData] = await findReportsOnPunishments(
            "title",
            filterString,
          );

          const [headers] = await findExcelReportHeaders();
          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
          });

          // prepare and normalize data
          const rows = aggregateRows(
            reportData,
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          // console.log(rows);

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        // گزارش آماری
        if (report_filter == 3) {
          const [reportData] = await findStatisticalReportsOnPunishments(
            filterString,
          );
          const [headers] = await findExcelReportHeaders();
          // const [personnelsTotalStatsBasedOnLevels] =
          //   await findPersonnelsTotalStatsBasedOnLevels();
          //   const [labels] = await findStatsReportLabels();
          const [org] = await findHoghughiOrganizations();

          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
            initialLabelGroup.title = org[0]["description"];
            initialLabelGroup.total = 0;
          });

          // prepare and normalize data
          const rows = flattenizer(
            reportData[0],
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          // console.log(rows);

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        break;
      // گزارش از جرائم
      case 3:
        // گزارش براساس رده
        if (report_filter == 1) {
          // GET Payvar Nezami Stats divided into rank level
          const [reportData] = await findReportsOnCrimes(
            "vahed_title",
            filterString,
          );

          const [headers] = await findExcelReportHeaders();
          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
          });

          // prepare and normalize data
          const rows = aggregateRows(
            reportData,
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          // console.log(rows);

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        // گزارش براساس محتوا
        if (report_filter == 2) {
          // GET Payvar Nezami Stats divided into rank level
          const [reportData] = await findReportsOnCrimes("title", filterString);

          const [headers] = await findExcelReportHeaders();
          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
          });

          // prepare and normalize data
          const rows = aggregateRows(
            reportData,
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          // console.log(rows);

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        // گزارش آماری
        if (report_filter == 3) {
          const [reportData] = await findStatisticalReportsOnCrimes(
            filterString,
          );
          const [headers] = await findExcelReportHeaders();
          // const [personnelsTotalStatsBasedOnLevels] =
          //   await findPersonnelsTotalStatsBasedOnLevels();
          //   const [labels] = await findStatsReportLabels();
          const [org] = await findHoghughiOrganizations();

          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
            initialLabelGroup.title = org[0]["description"];
            initialLabelGroup.total = 0;
          });

          // prepare and normalize data
          const rows = flattenizer(
            reportData[0],
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        break;
      // گزارش از تذکرات
      case 4:
        // گزارش براساس رده
        if (report_filter == 1) {
          // GET Payvar Nezami Stats divided into rank level
          const [reportData] = await findReportsOnRemarks(
            "vahed_title",
            filterString,
          );

          const [headers] = await findExcelReportHeaders();
          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
          });

          // prepare and normalize data
          const rows = aggregateRows(
            reportData,
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          // console.log(rows);

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        // گزارش براساس محتوا
        if (report_filter == 2) {
          // GET Payvar Nezami Stats divided into rank level
          const [reportData] = await findReportsOnRemarks(
            "title",
            filterString,
          );

          const [headers] = await findExcelReportHeaders();
          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
          });

          // prepare and normalize data
          const rows = aggregateRows(
            reportData,
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          // console.log(rows);

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        // گزارش آماری
        if (report_filter == 3) {
          const [reportData] = await findStatisticalReportsOnRemarks(
            filterString,
          );
          const [headers] = await findExcelReportHeaders();
          // const [personnelsTotalStatsBasedOnLevels] =
          //   await findPersonnelsTotalStatsBasedOnLevels();
          //   const [labels] = await findStatsReportLabels();
          const [org] = await findHoghughiOrganizations();

          const initialLabelGroup = {};
          labels.forEach((label) => {
            initialLabelGroup[`${label.label}`] = 0;
            initialLabelGroup.title = org[0]["description"];
            initialLabelGroup.total = 0;
          });

          // prepare and normalize data
          const rows = flattenizer(
            reportData[0],
            initialLabelGroup,
            personnelsTotalStatsBasedOnLevels,
          );

          return handleSuccess(res, "", { rows, headers }, 200);
        }
        break;

      // دریافت گزارش جامع
      default:
        let rows = [];
        const [report] = await findReport(filterString);
        const [headers] = await findExcelComprehensiveReportHeaders();
        rows = report[0];

        return handleSuccess(res, "", { rows, headers }, 200);
      // break;
    }
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.get("/report/report-filters", async (req, res, next) => {
  try {
    const reportFilters = await findReportFilters();
    return handleSuccess(res, "", reportFilters, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// get personal report
router.post("/personnel-report", async (req, res, next) => {
  const { personnel } = req.body;
  const personnelCode = String(personnel).trim();

  try {
    let soldiers = [];
    // const soldierAPI = await requestGarrisonAPI(
    //   `${req.GarrisonBaseUrl}/soldier.php?code=${personnelCode}`,
    //   next,
    // );

    // if (soldierAPI?.status == 200) {
    //   soldiers = soldierAPI.data;
    // }

    const personnelReport = await findPersonalReport(
      personnelCode,
      soldiers,
      next,
    );
    return handleSuccess(res, "", personnelReport, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(error.message, [], 500));
  }
});

// print applause
router.get("/print-personal-report/:personnel", async (req, res, next) => {
  const { personnel } = req.params;
  const personnelCode = String(personnel).trim();

  try {
    let soldiers = [];
    // const soldierAPI = await requestGarrisonAPI(
    //   `${req.GarrisonBaseUrl}/soldier.php?code=${personnelCode}`,
    //   next,
    // );

    // if (soldierAPI?.status == 200) {
    //   soldiers = soldierAPI.data;
    // }

    const personnelReport = await findPersonalReport(personnelCode, soldiers);

    const templateFilePath = path.join(
      __dirname,
      "..",
      "..",
      "docxTemplates",
      "personalreport.docx",
    );
    const template = fs.readFileSync(templateFilePath);
    const buffer = await createReport({
      template,
      data: { report: personnelReport },
    });
    fs.writeFileSync("personalreport.docx", buffer);
    // const [applause, fields] = await findApplause(id);
    const fileName = "personalreport.docx";
    return res.download("personalreport.docx", fileName, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
      }
      // else {
      // console.log(`File sent: ${fileName}`);
      // }
    });
  } catch (error) {
    console.error(error);
    return next(new HandleError(error.message, [], 500));
  }
});

module.exports = router;
// const report = new schema.Entity(
//   "reportData",
//   {},
//   {
//     idAttribute: "id",
//   },
// );
// const normalizedReportData = normalize(reportData.payvarNezami, report);
// console.log(normalizedReportData);
