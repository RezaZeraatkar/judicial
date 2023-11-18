const pool = require("./database/db");

require("dotenv").config();
const {
  findApplausesTypes,
  findNotoriousServices,
  findDisciplinaryCitations,
} = require("../services/applauses.service");
const {
  findPunishmentsTypes,
  findPunishmentsWrongdoing,
} = require("../services/punishments.service");
const {
  findCrimesTypes,
  findCrimesJudicialAuditReferee,
} = require("../services/crimes.service");
const {
  findRemarksTypes,
  findRemarksWrongdoing,
} = require("../services/remarks.service");

const moment = require("jalali-moment");

// find remarks types
const findReport = async (filter) => {
  const report = await pool.execute(`CALL comprehensive_report('${filter}')`);
  return report;
};

// find Statistical Report On Applauses
const findReportsOnApplauses = async (report_type, filterString) => {
  // filterstr will constructed from from_date, to_date and otherFilters;
  let ReportQueryProcedure = `CALL pivot_applauses_report('${report_type}','${filterString}')`;
  const report = await pool.execute(ReportQueryProcedure);

  return report;
};

// find Statistical Report On punishments
const findReportsOnPunishments = async (report_type, filterString) => {
  // filterstr will constructed from from_date, to_date and otherFilters;
  let ReportQueryProcedure = `CALL pivot_punishments_report('${report_type}','${filterString}')`;
  const report = await pool.execute(ReportQueryProcedure);

  return report;
};

// find Statistical Report On crimes
const findReportsOnCrimes = async (report_type, filterString) => {
  // filterstr will constructed from from_date, to_date and otherFilters;
  let ReportQueryProcedure = `CALL pivot_crimes_report('${report_type}','${filterString}')`;
  const report = await pool.execute(ReportQueryProcedure);

  return report;
};

// find Statistical Report On Remarks
const findReportsOnRemarks = async (report_type, filterString) => {
  // filterstr will constructed from from_date, to_date and otherFilters;
  let ReportQueryProcedure = `CALL pivot_remarks_report('${report_type}','${filterString}')`;
  const report = await pool.execute(ReportQueryProcedure);

  return report;
};

// find Statistical Report On Applauses
const findStatisticalReportsOnApplauses = async (filterString) => {
  let ReportQueryProcedure = `CALL pivot_applauses_total('${filterString}')`;
  const report = await pool.execute(ReportQueryProcedure);

  return report;
};

// find Statistical Report On punishments
const findStatisticalReportsOnPunishments = async (filterString) => {
  let ReportQueryProcedure = `CALL pivot_punishments_total('${filterString}')`;
  const report = await pool.execute(ReportQueryProcedure);

  return report;
};

// find Statistical Report On punishments
const findStatisticalReportsOnCrimes = async (filterString) => {
  let ReportQueryProcedure = `CALL pivot_crimes_total('${filterString}')`;
  const report = await pool.execute(ReportQueryProcedure);

  return report;
};

// find Statistical Report On remraks
const findStatisticalReportsOnRemarks = async (filterString) => {
  let ReportQueryProcedure = `CALL pivot_remarks_total('${filterString}')`;
  const report = await pool.execute(ReportQueryProcedure);

  return report;
};

// find Statistical Report lables
const findStatsReportLabels = async () => {
  let LabelsQuery = `SELECT DISTINCT ozviat_type_label as label 
                        FROM judicial_ozviat_type 
                        WHERE ozviat_type_id > 3
                        UNION SELECT rank_level_label as label FROM judicial_rank_level
                        UNION SELECT jens_label as label FROM judicial_jens
                        UNION SELECT soldier_ranks_level_label as label FROM judicial_soldier_ranks_level
                        `;
  const labels = await pool.execute(LabelsQuery);

  return labels;
};
// find all personnels based on positional or rank levels
const findPersonnelsTotalStatsBasedOnLevels = async (total_soldiers) => {
  let QUERY = `SELECT jp.personnel_id AS id, 
  jrl.rank_level_label AS label, 
  jot.ozviat_type_title AS title, 
  COUNT(jrl.rank_level_label) AS total FROM judicial_personnels jp
  LEFT OUTER JOIN judicial_ozviat_type jot
  ON jp.Ozvieat = jot.ozviat_type_id
  LEFT OUTER JOIN judicial_daraje jd
  ON jp.DarajehMosavab = jd.daraje_id
  LEFT OUTER JOIN judicial_rank_level jrl
  ON jd.daraje_level_id = jrl.rank_level_code
  WHERE jot.ozviat_category = 1
  GROUP BY jrl.rank_level_label
  UNION
  SELECT jp.personnel_id AS id, jjens.jens_label AS label, jot.ozviat_type_title AS title, 
  COUNT(jot.ozviat_type_label) AS total FROM judicial_personnels jp
    LEFT OUTER JOIN judicial_ozviat_type jot
    ON jp.Ozvieat = jot.ozviat_type_id
    LEFT OUTER JOIN judicial_jens jjens
    ON jp.Jens = jjens.jens_id
    WHERE jot.ozviat_category = 2
    GROUP BY jjens.jens_label
  UNION
  SELECT jp.personnel_id AS id, jot.ozviat_type_label AS label, jot.ozviat_type_title AS title, COUNT(jot.ozviat_type_label) AS total FROM judicial_personnels jp
    LEFT OUTER JOIN judicial_ozviat_type jot
    ON jp.Ozvieat = jot.ozviat_type_id
    WHERE jot.ozviat_category = 3
    GROUP BY jot.ozviat_type_label
  UNION
  SELECT jp.personnel_id AS id, jot.ozviat_type_label AS label, jot.ozviat_type_title AS title, COUNT(jot.ozviat_type_label) AS total FROM judicial_personnels jp
    LEFT OUTER JOIN judicial_ozviat_type jot
    ON jp.Ozvieat = jot.ozviat_type_id
    WHERE jot.ozviat_category = 4
    GROUP BY jot.ozviat_type_label
  UNION
  SELECT jp.personnel_id AS id, jot.ozviat_type_label AS label, jot.ozviat_type_title AS title, COUNT(jot.ozviat_type_label) AS total FROM judicial_personnels jp
    LEFT OUTER JOIN judicial_ozviat_type jot
    ON jp.Ozvieat = jot.ozviat_type_id
    WHERE jot.ozviat_category = 5
    GROUP BY jot.ozviat_type_label
  UNION
  SELECT jp.personnel_id AS id, jot.ozviat_type_label AS label, jot.ozviat_type_title AS title, COUNT(jot.ozviat_type_label) AS total FROM judicial_personnels jp
    LEFT OUTER JOIN judicial_ozviat_type jot
    ON jp.Ozvieat = jot.ozviat_type_id
    WHERE jot.ozviat_category = 6
    GROUP BY jot.ozviat_type_label
    UNION
  SELECT jp.personnel_id AS id, jot.ozviat_type_label AS label, jot.ozviat_type_title AS title, COUNT(jot.ozviat_type_label) AS total FROM judicial_personnels jp
    LEFT OUTER JOIN judicial_ozviat_type jot
    ON jp.Ozvieat = jot.ozviat_type_id
    WHERE jot.ozviat_category = 7
    GROUP BY jot.ozviat_type_label
    UNION
  SELECT 
        soldier_ranks_level_id AS id, 
        soldier_ranks_level_label AS label, 
        soldier_ranks_level_title AS title, 
        ${total_soldiers} AS total 
  FROM judicial_soldier_ranks_level`;
  const personnelsTotalStatsBasedOnLevels = await pool.execute(QUERY);

  return personnelsTotalStatsBasedOnLevels;
};

const findExcelReportHeaders = async () => {
  let ReportQueryHeaders = `CALL excelReportHeaders()`;
  const report = await pool.execute(ReportQueryHeaders);

  return report;
};

const findExcelComprehensiveReportHeaders = async () => {
  let ReportQueryHeaders = `CALL comprehensive_report_headers()`;
  const report = await pool.execute(ReportQueryHeaders);

  return report;
};

// find report filters
const findReportFilters = async () => {
  const [applausesTypes] = await findApplausesTypes();
  const [notServices] = await findNotoriousServices();
  const [disCitations] = await findDisciplinaryCitations();
  const [punTypes] = await findPunishmentsTypes();
  const [punWrongDoings] = await findPunishmentsWrongdoing();
  const [crimeTypes] = await findCrimesTypes();
  const [crimeAuditReferee] = await findCrimesJudicialAuditReferee();
  const [remarkTypes] = await findRemarksTypes();
  const [remarkWrongDoing] = await findRemarksWrongdoing();

  const filters = {
    applausesTypes,
    notServices,
    disCitations,
    punTypes,
    punWrongDoings,
    crimeTypes,
    crimeAuditReferee,
    remarkTypes,
    remarkWrongDoing,
  };

  return filters;
};

const findPersonalReport = async (personnelCode, soldiers, next) => {
  // first earch into personnel table
  let personnelRecord = `CALL getPersonnelInfo('${personnelCode}')`;
  const [personnelData] = await pool.execute(personnelRecord);
  // then search into garrsion table (remote access to garrison server required!) one another
  // better approach would be to alter the all four section related to recording judicial infos
  // and save them into related tables
  // GET Soldiers Data From garrison API

  /* get soldiers and personnels info if they removed from judicial personnels and garrsion_register_ table
     at garrison api*/
  let applauser_procedure = `CALL getPersonnelData('${personnelCode}')`;
  const [recordedPersonnel] = await pool.execute(applauser_procedure);

  const personnel = {
    ...recordedPersonnel[0][0],
    ...personnelData[0][0],
    // ...soldiers[0],
    date_now: recordedPersonnel[0].length > 0 || personnelData[0].length > 0,
    // ||
    // soldiers.length > 0
    //   ? moment(Date.now()).locale("fa").format("YYYY/MM/DD")
    //   : "",
  };

  if (!personnel.nationalcode) {
    throw new Error("فردی با این مشخصات پیدا نشد!");
  }
  // get applauses that recorded into database related to this personnel
  let applauses_procedure = `CALL getApplausesInfo('${personnelCode}')`;
  const [applauses] = await pool.execute(applauses_procedure);

  // get punishments that recorded into database related to this personnel
  let punishment_procedure = `CALL getPunishmentsInfo('${personnelCode}')`;
  const [punsihments] = await pool.execute(punishment_procedure);
  // get crimes that recorded into database related to this personnel
  let crime_procedure = `CALL getCrimesInfo('${personnelCode}')`;
  const [crimes] = await pool.execute(crime_procedure);
  // get remarks that recorded into database related to this personnel
  let remark_procedure = `CALL getRemarksInfo('${personnelCode}')`;
  const [remarks] = await pool.execute(remark_procedure);

  const resData = {
    personnelData: personnel,
    applauses: applauses[0],
    punsihments: punsihments[0],
    crimes: crimes[0],
    remarks: remarks[0],
  };

  return resData;
};

module.exports = {
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
};
