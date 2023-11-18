const pool = require("./database/db");
const moment = require("jalali-moment");
const citationsDescription = require("../utils/citationDescriptionGenerator");
require("dotenv").config();

// create Applauses types
const createApplausesTypes = async ({ description, code }) => {
  const applausesTypes = await pool.execute(
    `INSERT INTO judicial_applause_type(applause_type_description, applause_type_code) 
    VALUES ('${description}', ${code})`,
  );
  return applausesTypes;
};

// read Applauses types
const findApplausesTypes = async () => {
  const applausesTypes = await pool.execute(
    `SELECT 
      applause_type_id as id,
      applause_type_code as code,
      applause_type_description as description
    FROM judicial_applause_type`,
  );
  return applausesTypes;
};

// update Applauses types
const updateApplausesTypes = async ({ id, description, code }) => {
  const updatedApplauseType = await pool.execute(`
    UPDATE judicial_applause_type 
      SET 
        applause_type_description='${description}',
        applause_type_code='${code}'
      WHERE applause_type_id=${id}
  `);

  return updatedApplauseType;
};

const deleteApplausesTypes = async (id) => {
  const applauses = await pool.execute(
    `CALL judicialapp.deleteApplauseType(${id});`,
  );
  return applauses;
};

// Create Notorious Services
const createNotoriousServices = async ({
  notorious_services_row,
  description,
  notorious_services_recommended_days_off,
  notorious_services_table_number,
  made,
  code,
}) => {
  const notoriousServices = await pool.execute(
    `INSERT INTO judicial_applauses_notorious_services(
      notorious_services_row, 
      notorious_services_description,
      notorious_services_recommended_days_off, 
      notorious_services_table_number,
      notorious_services_made,
      notorious_services_code
    )
    VALUES 
      (
        ${notorious_services_row},
        '${description}',
        ${notorious_services_recommended_days_off},
        ${notorious_services_table_number},
        ${made},
        ${code}
      )
    `,
  );
  return notoriousServices;
};

// Find Notorious Services
const findNotoriousServices = async () => {
  const notoriousServices = await pool.execute(
    `SELECT notorious_services_id as id, 
      notorious_services_description as description, 
      notorious_services_row, 
      notorious_services_recommended_days_off,
      notorious_services_code as code,
      notorious_services_made as made,
      notorious_services_table_number FROM judicial_applauses_notorious_services
      `,
  );
  return notoriousServices;
};

// Update Notorious Services
const updateNotoriousServices = async ({
  id,
  description,
  notorious_services_recommended_days_off,
  notorious_services_row,
  notorious_services_table_number,
  made,
  code,
}) => {
  const notoriousServices = await pool.execute(
    `
    UPDATE judicial_applauses_notorious_services 
      SET 
        notorious_services_row=${notorious_services_row},
        notorious_services_description='${description}',
        notorious_services_recommended_days_off=${notorious_services_recommended_days_off},
        notorious_services_table_number=${notorious_services_table_number},
        notorious_services_made=${made},
        notorious_services_code=${code}
      WHERE notorious_services_id=${id}
  `,
  );
  return notoriousServices;
};

// delete Notorious Services
const deleteNotoriousServices = async ({ id }) => {
  const notoriousServices = await pool.execute(
    `CALL judicialapp.deleteNotoriousService(${id})`,
  );
  return notoriousServices;
};

// Find Disciplinary Citations
const findDisciplinaryCitations = async () => {
  const disciplinaryCitations = await pool.execute(
    `SELECT * FROM judicial_applauses_notorious_services`,
  );

  const disciplinaryCitationsRef = disciplinaryCitations[0].map((item) => {
    return {
      id: item["notorious_services_id"],
      description: citationsDescription(
        item["notorious_services_row"],
        item["notorious_services_table_number"],
        item["notorious_services_made"],
      ),
    };
  });

  return [disciplinaryCitationsRef];
};

// insert into applauses table
const createApplauses = async (
  recommender,
  commander,
  applauser,
  applauseSpec,
) => {
  const EMPTY_ID_FIELD = 255;
  const createdApplause = await pool.execute(
    `INSERT INTO judicialapp.judicial_applauses
      (
        user_id
       ,recommender_pasdari_code
       ,recommender_parvande_code
       ,recommender_nationality_code
       ,recommender_name
       ,recommender_surname
       ,recommender_fathername
       ,recommender_ozviyat_type
       ,recommender_rank
       ,recommender_position
       ,recommender_unit
       ,recommender_raste
       ,recommender_rotbe
       ,recommender_education
       ,recommender_vazkhedmati
       ,recommender_jens
       ,recommender_phone
       ,recommender_marig
       ,recommender_vazjesmani
       ,recommender_ezamdate
       ,recommender_vazravani
       ,recommender_birthdate
       ,recommender_responsibility
       ,recommender_address
       ,commander_pasdari_code
       ,commander_parvande_code
       ,commander_nationality_code
       ,commander_name
       ,commander_surname
       ,commander_fathername
       ,commander_ozviyat_type
       ,commander_ezamdate
       ,commander_vazravani
       ,commander_rank
       ,commander_position
       ,commander_birthdate
       ,commander_phone
       ,commander_marig
       ,commander_vazjesmani
       ,commander_unit
       ,commander_jens
       ,commander_vazkhedmati
       ,commander_raste
       ,commander_rotbe
       ,commander_education
       ,commander_responsibility
       ,commander_address
       ,applauser_pasdari_code
       ,applauser_nationality_code
       ,applauser_parvande_code
       ,applauser_name
       ,applauser_surname
       ,applauser_fathername
       ,applauser_rank
       ,applauser_position
       ,applauser_unit
       ,applauser_education
       ,applauser_ozviat_type
       ,applauser_phone
       ,applauser_vazravani
       ,applauser_birthdate
       ,applauser_vazjesmani
       ,applauser_marig
       ,applauser_jens
       ,applauser_ozviat_code
       ,applauser_raste
       ,applauser_rotbe
       ,applauser_vazkhedmati
       ,applauser_ezamdate
       ,applauser_address
       ,applauser_responsibility
       ,applause_type
       ,applause_description
       ,applause_date
       ,applause_count
       ,applause_padash
       ,notorious_services_type
       ,citation_cases
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
        ,${recommender?.ozviyat_code || EMPTY_ID_FIELD}
        ,${recommender?.daraje || EMPTY_ID_FIELD}
        ,${recommender?.jaygah || EMPTY_ID_FIELD}
        ,${recommender?.unit || EMPTY_ID_FIELD}
        ,${recommender?.RastehAsli || EMPTY_ID_FIELD}
        ,${recommender?.rotbe || EMPTY_ID_FIELD}
        ,${recommender?.education || EMPTY_ID_FIELD}
        ,${recommender?.vkhedmat || EMPTY_ID_FIELD}
        ,${recommender?.Jens || EMPTY_ID_FIELD}
        ,'${recommender?.phone_number || ""}'
        ,${recommender?.marig || EMPTY_ID_FIELD}
        ,${recommender?.vazjesmani || EMPTY_ID_FIELD}
        ,'${
          moment(recommender?.ezamDate).isValid()
            ? moment(recommender?.ezamDate).format("YYYY/MM/DD")
            : "0000-00-00"
        }'
        ,${recommender?.vazravani || EMPTY_ID_FIELD}
        ,'${
          moment(recommender?.birthdate).isValid()
            ? moment(recommender?.birthdate).format("YYYY/MM/DD")
            : "0000-00-00"
        }'
        ,'${recommender?.masoliat || ""}'
        ,'${recommender?.address || ""}'
        ,${commander?.pasdari_code ? `'${commander?.pasdari_code}'` : null}
        ,${commander?.code ? `'${commander?.code}'` : null}
        ,${commander?.nationalcode ? `'${commander?.nationalcode}'` : null}
        ,${commander?.firstname ? `'${commander?.firstname}'` : null}
        ,${commander?.surname ? `'${commander?.surname}'` : null}
        ,${commander?.fathername ? `'${commander?.fathername}'` : null}
        ,${commander?.ozviyat_code || null}
        ,'${
          moment(commander?.ezamDate).isValid()
            ? moment(commander?.ezamDate).format("YYYY/MM/DD")
            : "0000-00-00"
        }'
        ,${commander?.vazravani || null}
        ,${commander?.daraje || null}
        ,${commander?.jaygah || null}
        ,'${
          moment(commander?.birthdate).isValid()
            ? moment(commander?.birthdate).format("YYYY/MM/DD")
            : "0000-00-00"
        }'
        ,'${commander?.phone_number || ""}'
        ,${commander?.marig || null}
        ,${commander?.vazjesmani || null}
        ,${commander?.unit || null}
        ,${commander?.Jens || null}
        ,${commander?.vkhedmat || null}
        ,${commander?.RastehAsli || null}
        ,${commander?.rotbe || null}
        ,${commander?.education || null}
        ,'${commander?.masoliat || ""}'
        ,'${commander?.address || ""}'
        ,${
          applauser?.pasdari_code ||
          applauseSpec?.applauser_pasdari_code ||
          null
        }
        ,${applauser?.nationalcode ? `'${applauser?.nationalcode}'` : null}
        ,${applauser?.code ? `'${applauser?.code}'` : null}
        ,${applauser?.firstname ? `'${applauser?.firstname}'` : null}
        ,${applauser?.surname ? `'${applauser?.surname}'` : null}
        ,${applauser?.fathername ? `'${applauser?.fathername}'` : null}
        ,${applauser?.daraje || null}
        ,${
          applauser?.ozviyat_type == 1
            ? applauser?.jaygah || null
            : EMPTY_ID_FIELD
        }
        ,${applauser?.unit > 0 ? applauser?.unit : null}
        ,${applauser?.education > 0 ? applauser?.education : null}
        ,${applauser?.ozviyat_type || null}
        ,'${applauser?.phone_number || ""}'
        ,${applauser?.vazravani > 0 ? applauser?.vazravani : null}
        ,'${
          moment(applauser?.birthdate).isValid()
            ? moment(applauser?.birthdate).format("YYYY/MM/DD")
            : "0000-00-00"
        }'
        ,${applauser?.vazjesmani > 0 ? applauser?.vazjesmani : null}
        ,${applauser?.marig > 0 ? applauser?.marig : null}
        ,${applauser?.Jens > 0 ? applauser?.Jens : null}
        ,${applauser?.ozviyat_code > 0 ? applauser?.ozviyat_code : null}
        ,${
          applauser?.ozviyat_type == 1
            ? applauser?.RastehAsli > 0
              ? applauser?.RastehAsli
              : null
            : EMPTY_ID_FIELD
        }
        ,${
          applauser?.ozviyat_type == 1
            ? applauser?.rotbe > 0
              ? applauser?.rotbe
              : null
            : EMPTY_ID_FIELD
        }
        ,${applauser?.vkhedmat > 0 ? applauser?.vkhedmat : null}
        ,'${
          moment(applauser?.ezamDate).isValid()
            ? moment(applauser?.ezamDate).format("YYYY/MM/DD")
            : "0000-00-00"
        }'
        ,'${applauser?.address || ""}'
        ,'${applauser?.masoliat || ""}'
        ,${applauseSpec?.applause_type_id || null}
        ,${
          applauseSpec?.applause_description
            ? `'${applauseSpec?.applause_description}'`
            : null
        }
        ,'${
          moment(applauseSpec?.applause_date).isValid()
            ? applauseSpec?.applause_date
            : null
        }'
        ,${applauseSpec?.applause_count || 0}
        ,${applauseSpec?.applause_padash || 0}
        ,${applauseSpec?.notorious_services_type_id || null}
        ,${applauseSpec?.citation_cases_id || null}
      )`,
  );

  return createdApplause;
};

// update applause
const updateApplause = async (applauseSpec) => {
  const updatedApplause = await pool.execute(`
    UPDATE judicialapp.judicial_applauses
    SET
        user_id = ${applauseSpec.user_id},
        applause_type = '${applauseSpec.applause_type_id}',
        applause_description = '${applauseSpec["applause_description"]}',
        applause_date = '${
          moment(applauseSpec["applause_date"]).isValid()
            ? moment(applauseSpec["applause_date"]).format("YYYY/MM/DD")
            : "0000-00-00"
        }',
        applause_count = '${applauseSpec["applause_count"]}',
        applause_padash = '${applauseSpec["applause_padash"]}',
        notorious_services_type = '${applauseSpec.notorious_services_type_id}',
        citation_cases = '${applauseSpec.citation_cases_id}'
    WHERE
        applauses_id = ${applauseSpec["id"]};
  `);

  return updatedApplause;
};

// find appluses
const findApplauses = async ({ page, pageSize, filterStr, sortStr }) => {
  const baseQuery = `SELECT
    (@row_number := @row_number + 1) AS row,
    apl.applauses_id AS id,
    apl.applauser_parvande_code AS parvandeCode,
    CONCAT(apl.applauser_surname, ' ', apl.applauser_name) AS name,
    apl.applauser_nationality_code AS nationalCode,
    CONCAT(apl.recommender_surname, ' ', apl.recommender_name) AS recommender,
    CONCAT(apl.commander_surname, ' ', apl.commander_name) AS commander,
    apl.applause_description AS applauseDescription,
    pdate(apl.applause_date) AS applauseDate,
    jst.status_title AS status,
    jst.status_id,
    apt.applause_type_description AS applauseType
    FROM (SELECT
            @row_number := ?) AS rn,
        judicial_applauses apl
          LEFT OUTER JOIN judicial_applause_type apt
            ON apl.applause_type = apt.applause_type_id
          LEFT OUTER JOIN judicial_applauses_notorious_services ans
            ON apl.notorious_services_type = ans.notorious_services_id
          LEFT OUTER JOIN judicial_status_table jst
            ON jst.status_id = apl.applause_status
    WHERE ${filterStr}`;
  const applauses = await pool.query(
    `${baseQuery}
    ORDER BY ${sortStr}
    LIMIT ?, ?;`,
    [page, page, pageSize],
  );
  const applausesTotalRows = await pool.query(`${baseQuery}`, [page]);

  return {
    applauses: applauses[0],
    applausesTotalRows: applausesTotalRows[0].length,
  };
};

// update applause status
const updateApplauseStatus = async (req, id, status) => {
  const user_id = req.session.userdata.id;
  const applauses = await pool.execute(`UPDATE judicial_applauses a
                                        SET 
                                          user_id=${user_id}, 
                                          applause_status=${status}
                                        WHERE 
                                          a.applauses_id = ${id}`);
  return applauses;
};

// delete applause status
const deleteApplause = async (id) => {
  const applauses = await pool.execute(`DELETE FROM judicial_applauses
                                          WHERE applauses_id = ${id}`);
  return applauses;
};

// find applause data
const findApplause = async (id) => {
  const applause = await pool.execute(`CALL judicialapp.get_applause(${id});`);

  applause[0][0][0]["citations_description"] = citationsDescription(
    applause[0][0][0]["notorious_services_row"],
    applause[0][0][0]["notorious_services_table_number"],
    applause[0][0][0]["notorious_services_made"],
  );

  return applause[0];
};

module.exports = {
  createApplausesTypes,
  findApplausesTypes,
  updateApplausesTypes,
  deleteApplausesTypes,
  createNotoriousServices,
  findNotoriousServices,
  updateNotoriousServices,
  deleteNotoriousServices,
  findDisciplinaryCitations,
  createApplauses,
  findApplauses,
  updateApplauseStatus,
  deleteApplause,
  findApplause,
  updateApplause,
};
