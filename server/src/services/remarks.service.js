const pool = require("./database/db");
const moment = require("jalali-moment");
const citationsDescription = require("../utils/citationDescriptionGenerator");
require("dotenv").config();

// find remarks types
const findRemarksTypes = async () => {
  const punishmentsTypes = await pool.execute(
    `SELECT 
      remark_type_id as id,
      remark_type_code as code,
      remark_type_title as description
    FROM judicial_remarks_types`,
  );
  return punishmentsTypes;
};

// find remarks_wrongdoing
const findRemarksWrongdoing = async () => {
  const punishments_wrongdoing = await pool.execute(
    `SELECT punishments_wrongdoings_id as id, 
      punishments_wrongdoings_description as description, 
      punishments_wrongdoings_row, 
      punishments_wrongdoings_recommended_days_off, 
      punishments_wrongdoings_table_number FROM judicial_punishments_wrongdoings`,
  );
  return punishments_wrongdoing;
};

// find remarks_wrongdoing
const findDisciplinaryCitations = async () => {
  const disciplinaryCitations = await pool.execute(
    `SELECT * FROM judicial_punishments_wrongdoings`,
  );

  const disciplinaryCitationsRef = disciplinaryCitations[0].map((item) => {
    return {
      id: item["punishments_wrongdoings_id"],
      description: citationsDescription(
        item["punishments_wrongdoings_row"],
        item["punishments_wrongdoings_table_number"],
        item["punishments_wrongdoings_made"],
      ),
    };
  });

  return [disciplinaryCitationsRef];
};

// add remark type
const addRemarkType = async (orgs) => {
  const remarkType = await pool.execute(
    `INSERT INTO judicialapp.judicial_remarks_types
      (
      remark_type_code
      ,remark_type_title
      )
      VALUES
      (
      ${orgs.code} -- remark_type_code - TINYINT(3) NOT NULL
      ,'${orgs.description}' -- remark_type_title - VARCHAR(255) NOT NULL
      )`,
  );
  return remarkType;
};

// edit remark type
const editRemarkType = async (orgs) => {
  const remarkType = await pool.execute(
    `UPDATE judicialapp.judicial_remarks_types 
      SET
        remark_type_code = ${orgs.code} -- remark_type_code - TINYINT(3) NOT NULL
      ,remark_type_title = '${orgs.description}' -- remark_type_title - VARCHAR(255) NOT NULL
      WHERE
        remark_type_id = ${orgs.id} -- remark_type_id - TINYINT(3) NOT NULL`,
  );
  return remarkType;
};

// delete remark type
const deleteRemarkType = async (id) => {
  const remarkType = await pool.execute(
    `DELETE FROM judicialapp.judicial_remarks_types
    WHERE
      remark_type_id = ${id} -- remark_type_id - TINYINT(3) NOT NULL`,
  );
  return remarkType;
};

// insert into remarks table
const createRemarks = async (
  recommender,
  commander,
  applauser,
  applauseSpec,
) => {
  const EMPTY_ID_FIELD = 255;
  const createdremark = await pool.execute(
    `INSERT INTO judicial_remarks(
      remark_user_id
      ,remark_recommender_pasdari_code
      ,remark_recommender_parvande_code
      ,remark_recommender_nationality_code
      ,remark_recommender_name
      ,remark_recommender_surname
      ,remark_recommender_fathername
      ,remark_recommender_ozviyat_type
      ,remark_recommender_rank
      ,remark_recommender_position
      ,remark_recommender_unit
      ,remark_recommender_rotbe
      ,remark_recommender_address
      ,remark_recommender_raste
      ,remark_recommender_birthdate
      ,remark_recommender_ezamdate
      ,remark_recommender_jens
      ,remark_recommender_vazkhedmati
      ,remark_recommender_vazjesmani
      ,remark_recommender_vazravani
      ,remark_recommender_phone
      ,remark_recommender_marig
      ,remark_recommender_education
      ,remark_recommender_responsibility
      ,remark_commander_pasdari_code
      ,remark_commander_parvande_code
      ,remark_commander_nationality_code
      ,remark_commander_name
      ,remark_commander_surname
      ,remark_commander_fathername
      ,remark_commander_ozviyat_type
      ,remark_commander_rank
      ,remark_commander_position
      ,remark_commander_unit
      ,remark_commander_rotbe
      ,remark_commander_address
      ,remark_commander_raste
      ,remark_commander_birthdate
      ,remark_commander_ezamdate
      ,remark_commander_jens
      ,remark_commander_vazkhedmati
      ,remark_commander_vazjesmani
      ,remark_commander_vazravani
      ,remark_commander_marig
      ,remark_commander_phone
      ,remark_commander_education
      ,remark_commander_responsibility
      ,remark_subject_pasdari_code
      ,remark_subject_nationality_code
      ,remark_subject_parvande_code
      ,remark_subject_name
      ,remark_subject_surname
      ,remark_subject_fathername
      ,remark_subject_ozviat_code
      ,remark_subject_rank
      ,remark_subject_position
      ,remark_subject_unit
      ,remark_subject_education
      ,remark_subject_rotbe
      ,remark_subject_ozviat_type
      ,remark_subject_jens
      ,remark_subject_ezamdate
      ,remark_subject_vazkhedmati
      ,remark_subject_birthdate
      ,remark_subject_marig
      ,remark_subject_vazravani
      ,remark_subject_vazjesmani
      ,remark_subject_responsibilty
      ,remark_subject_address
      ,remark_subject_raste
      ,remark_subject_phone
      ,remark_type_id
      ,remark_description
      ,remark_date
      ,remark_do_date
      ,remark_wrongdoins_type_id
      ,remark_citation_cases_id
      ) 
      VALUES 
      (
        ${applauseSpec.user_id}
          ,'${recommender?.pasdari_code || ""}'
          ,'${recommender?.code || ""}'
          ,'${recommender?.nationalcode || ""}'
          ,'${recommender?.firstname || ""}'
          ,'${recommender?.surname || ""}'
          ,'${recommender?.fathername || ""}'
          ,${recommender?.ozviyat_type || EMPTY_ID_FIELD}
          ,${recommender?.daraje || EMPTY_ID_FIELD}
          ,${recommender?.jaygah || EMPTY_ID_FIELD}
          ,${recommender?.unit || EMPTY_ID_FIELD}
          ,${recommender?.rotbe || EMPTY_ID_FIELD}
          ,'${recommender?.address || ""}'
          ,${recommender?.RastehAsli || EMPTY_ID_FIELD}
          ,'${
            moment(recommender?.birthdate).isValid()
              ? moment(recommender?.birthdate).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,'${
            moment(recommender?.ezamDate).isValid()
              ? moment(recommender?.ezamDate).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,${recommender?.Jens || EMPTY_ID_FIELD}
          ,${recommender?.vkhedmat || EMPTY_ID_FIELD}
          ,${recommender?.vazjesmani || EMPTY_ID_FIELD}
          ,${recommender?.vazravani || EMPTY_ID_FIELD}
          ,'${recommender?.phone_number || ""}'
          ,${recommender?.marig || EMPTY_ID_FIELD}
          ,${recommender?.education || EMPTY_ID_FIELD}
          ,'${recommender?.masoliat || ""}'
          ,${commander?.pasdari_code ? `'${commander?.pasdari_code}'` : null}
          ,${commander?.code ? `'${commander?.code}'` : null}
          ,${commander?.nationalcode ? `'${commander?.nationalcode}'` : null}
          ,${commander?.firstname ? `'${commander?.firstname}'` : null}
          ,${commander?.surname ? `'${commander?.surname}'` : null}
          ,${commander?.fathername ? `'${commander?.fathername}'` : null}
          ,${commander?.ozviyat_code || null}
          ,${commander?.daraje || null}
          ,${commander?.jaygah || null}
          ,${commander?.unit || null}
          ,${commander?.rotbe || null}
          ,'${commander?.address || ""}'
          ,${commander?.RastehAsli || null}
          ,'${
            moment(commander["birthdate"]).isValid()
              ? moment(commander["birthdate"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,'${
            moment(commander["ezamDate"]).isValid()
              ? moment(commander["ezamDate"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,${commander?.Jens || null}
          ,${commander?.vkhedmat || null}
          ,${commander?.vazjesmani || null}
          ,${commander?.vazravani || null}
          ,${commander?.marig || null}
          ,'${commander?.phone_number || ""}'
          ,${commander?.education || null}
          ,'${commander?.masoliat || ""}'
          ,${
            applauser?.pasdari_code ||
            applauseSpec?.remark_subject_pasdari_code ||
            null
          }
          ,${applauser?.nationalcode ? `'${applauser?.nationalcode}'` : null}
          ,${applauser?.code ? `'${applauser?.code}'` : null}
          ,${applauser?.firstname ? `'${applauser?.firstname}'` : null}
          ,${applauser?.surname ? `'${applauser?.surname}'` : null}
          ,${applauser?.fathername ? `'${applauser?.fathername}'` : null}
          ,${applauser?.ozviyat_code > 0 ? applauser?.ozviyat_code : null}
          ,${applauser?.daraje > 0 ? applauser?.daraje : null}
          ,${
            applauser?.ozviyat_type == 1
              ? applauser?.jaygah > 0
                ? applauser?.jaygah
                : null
              : EMPTY_ID_FIELD
          }
          ,${applauser?.unit > 0 ? applauser?.unit : null}
          ,${applauser?.education > 0 ? applauser?.education : null}
          ,${
            applauser?.ozviyat_type == 1
              ? applauser?.rotbe > 0
                ? applauser?.rotbe
                : null
              : EMPTY_ID_FIELD
          }
          ,${applauser?.ozviyat_type || null}
          ,${applauser?.Jens > 0 ? applauser?.Jens : null}
          ,'${
            moment(applauser["ezamDate"]).isValid()
              ? moment(applauser["ezamDate"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,${applauser?.vkhedmat > 0 ? applauser?.vkhedmat : null}
          ,'${
            moment(applauser["birthdate"]).isValid()
              ? moment(applauser["birthdate"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,${applauser?.marig > 0 ? applauser?.marig : null}
          ,${applauser?.vazravani > 0 ? applauser?.vazravani : null}
          ,${applauser?.vazjesmani > 0 ? applauser?.vazjesmani : null}
          ,'${applauser?.masoliat || ""}'
          ,'${applauser?.address || ""}'
          ,${
            applauser?.ozviyat_type == 1
              ? applauser?.RastehAsli > 0
                ? applauser?.RastehAsli
                : null
              : EMPTY_ID_FIELD
          }
          ,'${applauser?.phone_number || ""}'
          ,${applauseSpec.remark_type_id || null}
          ,${
            applauseSpec?.remark_description
              ? `'${applauseSpec?.remark_description}'`
              : null
          }
          ,'${
            moment(applauseSpec["remark_date"]).isValid()
              ? moment(applauseSpec["remark_date"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,'${
            moment(applauseSpec["remark_do_date"]).isValid()
              ? moment(applauseSpec["remark_do_date"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,${applauseSpec?.remark_wrongdoins_type || null}
          ,${applauseSpec?.citation_cases_id || null}
      )
      `,
  );
  return createdremark;
};

// update remarks
const updateRemark = async (applauseSpec) => {
  const updatedRemark = await pool.execute(`
    UPDATE judicial_remarks
    SET
      remark_user_id = ${applauseSpec.user_id},
      remark_subject_ozviat_type = ${applauseSpec["ozviat_type"]},
      remark_type_id = '${applauseSpec.remark_type_id}',
      remark_description = '${applauseSpec["remark_description"]}',
      remark_date = '${
        moment(applauseSpec["remark_date"]).isValid()
          ? moment(applauseSpec["remark_date"]).format("YYYY/MM/DD")
          : "0000-00-00"
      }',
      remark_do_date = '${
        moment(applauseSpec["remark_do_date"]).isValid()
          ? moment(applauseSpec["remark_do_date"]).format("YYYY/MM/DD")
          : "0000-00-00"
      }',
      remark_wrongdoins_type_id = '${applauseSpec["remark_wrongdoins_type"]}',
      remark_citation_cases_id = '${applauseSpec.citation_cases_id}'
    WHERE remark_id = ${applauseSpec["id"]};
  `);

  return updatedRemark;
};

const findRemarks = async ({ page, pageSize, filterStr, sortStr }) => {
  const baseQuery = `SELECT
    (@row_number := @row_number + 1) AS row,
    rmk.remark_id AS id,
    rmk.remark_subject_parvande_code AS parvandeCode,
    CONCAT(rmk.remark_subject_surname, ' ', rmk.remark_subject_name) AS name,
    rmk.remark_subject_nationality_code AS nationalCode,
    CONCAT(rmk.remark_recommender_surname, ' ', rmk.remark_recommender_name) AS recommender,
    CONCAT(rmk.remark_commander_surname, ' ', rmk.remark_commander_name) AS commander,
    rmk.remark_description AS remarkDescription,
    pdate(rmk.remark_date) AS remarkDate,
    jst.status_title AS status,
    jst.status_id,
    rmt.remark_type_title AS remarkTypeDescription
    FROM (SELECT
            @row_number := ${page}) AS rn,
        judicialapp.judicial_remarks rmk
          LEFT OUTER JOIN judicialapp.judicial_remarks_types rmt
            ON rmk.remark_type_id = rmt.remark_type_id
          LEFT OUTER JOIN judicial_status_table jst
            ON jst.status_id = rmk.remark_status
    WHERE ${filterStr}`;
  const remarks = await pool.execute(
    `${baseQuery}
    ORDER BY ${sortStr}
    LIMIT ${page}, ${pageSize};`,
  );
  const remarksTotalRows = await pool.execute(`${baseQuery}`);

  return {
    remarks: remarks[0],
    remarksTotalRows: remarksTotalRows[0].length,
  };
};

// update remarks status
const updateRemarkStatus = async (req, id, status) => {
  const user_id = req.session.userdata.id;
  const remarks = await pool.execute(`UPDATE judicial_remarks jr
                                        SET 
                                          remark_user_id=${user_id}, 
                                          remark_status=${status}
                                        WHERE 
                                          jr.remark_id = ${id}`);
  return remarks;
};

// delete remarks status
const deleteRemark = async (id) => {
  const remarks = await pool.execute(`DELETE FROM judicial_remarks 
                                          WHERE judicial_remarks.remark_id = ${id}`);
  return remarks;
};

// find remarks data
const findRemark = async (id) => {
  const remark = await pool.execute(`CALL get_remark(${id})`);
  remark[0][0][0]["citations_description"] = citationsDescription(
    remark[0][0][0]["punishments_wrongdoings_row"],
    remark[0][0][0]["punishments_wrongdoings_table_number"],
    remark[0][0][0]["punishments_wrongdoings_made"],
  );

  return remark[0];
};

module.exports = {
  findRemarksTypes,
  findRemarksWrongdoing,
  findDisciplinaryCitations,
  createRemarks,
  findRemarks,
  updateRemarkStatus,
  deleteRemark,
  findRemark,
  updateRemark,
  addRemarkType,
  editRemarkType,
  deleteRemarkType,
};
