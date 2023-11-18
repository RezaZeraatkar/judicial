require("dotenv").config();
const pool = require("./database/db");
const moment = require("moment");

const citationsDescription = require("../utils/citationDescriptionGenerator");

// find punishments types
const findPunishmentsTypes = async () => {
  const punishmentsTypes = await pool.execute(
    `SELECT 
      punishments_type_id as id,
      punishments_type_code as code,
      punishments_type_description as description
    FROM judicial_punishments_type`,
  );
  return punishmentsTypes;
};

// delete punishment type
const deletePunishmentType = async ({ id }) => {
  const punishmentType = await pool.execute(
    `CALL judicialapp.deletePunishmentType(${id})`,
  );
  return punishmentType;
};

// find punishments_wrongdoing
const findPunishmentsWrongdoing = async () => {
  const punishments_wrongdoing = await pool.execute(
    `SELECT punishments_wrongdoings_id as id, 
      punishments_wrongdoings_description as description, 
      punishments_wrongdoings_row, 
      punishments_wrongdoings_recommended_days_off, 
      punishments_wrongdoings_table_number,
      punishments_wrongdoings_code,
      punishments_wrongdoings_made
      FROM judicial_punishments_wrongdoings`,
  );
  return punishments_wrongdoing;
};

// find punishments_wrongdoing
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

// add Punishment Wrongdoings
const addPunishmentWrongdoing = async ({
  punishments_wrongdoings_row,
  description,
  punishments_wrongdoings_recommended_days_off,
  punishments_wrongdoings_table_number,
  made,
  code,
}) => {
  const punishmentsWrongdoing = await pool.execute(
    `INSERT INTO judicial_punishments_wrongdoings(
      punishments_wrongdoings_row, 
      punishments_wrongdoings_description,
      punishments_wrongdoings_recommended_days_off, 
      punishments_wrongdoings_table_number,
      punishments_wrongdoings_made,
      punishments_wrongdoings_code
    )
    VALUES 
      (
        ${punishments_wrongdoings_row},
        '${description}',
        ${punishments_wrongdoings_recommended_days_off},
        ${punishments_wrongdoings_table_number},
        ${made},
        ${code}
      )
    `,
  );
  return punishmentsWrongdoing;
};

// delete Punishment Wrongdoings
const deletePunishmentWrongdoing = async ({ id }) => {
  const deletedPunishmentWrongdoing = await pool.execute(
    `CALL judicialapp.deletePunishmentWrongdoing(${id})`,
  );
  return deletedPunishmentWrongdoing;
};

// Update punishments types
const updatePunishmentWrongdoing = async ({
  id,
  description,
  punishments_wrongdoings_recommended_days_off,
  punishments_wrongdoings_row,
  punishments_wrongdoings_table_number,
  made,
  code,
}) => {
  const punishmentWrongdoing = await pool.execute(
    `
    UPDATE judicial_punishments_wrongdoings 
      SET 
        punishments_wrongdoings_row=${punishments_wrongdoings_row},
        punishments_wrongdoings_description='${description}',
        punishments_wrongdoings_recommended_days_off=${punishments_wrongdoings_recommended_days_off},
        punishments_wrongdoings_table_number=${punishments_wrongdoings_table_number},
        punishments_wrongdoings_made=${made},
        punishments_wrongdoings_code=${code}
      WHERE punishments_wrongdoings_id=${id}
  `,
  );
  return punishmentWrongdoing;
};

// Update Punishment Types
const updatePunishmentType = async ({ id, description, code }) => {
  const punishmentType = await pool.execute(
    `
    UPDATE judicial_punishments_type 
      SET 
        punishments_type_description='${description}',
        punishments_type_code=${code}
      WHERE punishments_type_id=${id}
  `,
  );
  return punishmentType;
};

// create Punishment types
const addPunishmentTypes = async ({ description, code }) => {
  const punishmentsTypes = await pool.execute(
    `INSERT INTO judicial_punishments_type(punishments_type_description, punishments_type_code) 
    VALUES ('${description}', ${code})`,
  );
  return punishmentsTypes;
};

// insert into punishments table
const createPunishments = async (
  recommender,
  commander,
  applauser,
  applauseSpec,
) => {
  const EMPTY_ID_FIELD = 255;
  const createdpunishments = await pool.execute(
    `INSERT INTO judicialapp.judicial_punishments
        (
          punishment_user_id
          ,punishment_recommender_pasdari_code
          ,punishment_recommender_parvande_code
          ,punishment_recommender_nationality_code
          ,punishment_recommender_name
          ,punishment_recommender_surname
          ,punishment_recommender_fathername
          ,punishment_recommender_ozviyat_type
          ,punishment_recommender_rank
          ,punishment_recommender_position
          ,punishment_recommender_unit
          ,punishment_recommender_raste
          ,punishment_recommender_rotbe
          ,punishment_recommender_education
          ,punishment_recommender_jens
          ,punishment_recommender_marig
          ,punishment_recommender_vazkhedmati
          ,punishment_recommender_vazjesmani
          ,punishment_recommender_vazravani
          ,punishment_recommender_birthdate
          ,punishment_recommender_ezamdate
          ,punishment_recommender_phone
          ,punishment_recommender_responsibility
          ,punishment_recommender_address
          ,punishment_commander_pasdari_code
          ,punishment_commander_parvande_code
          ,punishment_commander_nationality_code
          ,punishment_commander_name
          ,punishment_commander_surname
          ,punishment_commander_fathername
          ,punishment_commander_ozviyat_type
          ,punishment_commander_rank
          ,punishment_commander_position
          ,punishment_commander_unit
          ,punishment_commander_ezamdate
          ,punishment_commander_address
          ,punishment_commander_vazkhedmati
          ,punishment_commander_vazravani
          ,punishment_commander_vazjesmani
          ,punishment_commander_phone
          ,punishment_commander_marig
          ,punishment_commander_jens
          ,punishment_commander_education
          ,punishment_commander_birthdate
          ,punishment_commander_rotbe
          ,punishment_commander_raste
          ,punishment_commander_responsibility
          ,punishment_subject_pasdari_code
          ,punishment_subject_nationality_code
          ,punishment_subject_parvande_code
          ,punishment_subject_name
          ,punishment_subject_surname
          ,punishment_subject_fathername
          ,punishment_subject_ozviat_code
          ,punishment_subject_rank
          ,punishment_subject_position
          ,punishment_subject_unit
          ,punishment_subject_education
          ,punishment_subject_rotbe
          ,punishment_subject_ozviat_type
          ,punishment_subject_jens
          ,punishment_subject_ezamdate
          ,punishment_subject_vazkhedmati
          ,punishment_subject_birthdate
          ,punishment_subject_marig
          ,punishment_subject_vazravani
          ,punishment_subject_vazjesmani
          ,punishment_subject_responsibilty
          ,punishment_subject_address
          ,punishment_subject_raste
          ,punishment_subject_phone
          ,punishment_type_id
          ,punishment_description
          ,punishment_date
          ,punishment_do_date
          ,punishment_count
          ,punishment_kasr_hoghoogh
          ,punishment_wrongdoins_type_id
          ,punishment_citation_cases_id
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
          ,${recommender?.Jens || EMPTY_ID_FIELD}
          ,${recommender?.marig || EMPTY_ID_FIELD}
          ,${recommender?.vkhedmat || EMPTY_ID_FIELD}
          ,${recommender?.vazjesmani || EMPTY_ID_FIELD}
          ,${recommender?.vazravani || EMPTY_ID_FIELD}
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
          ,'${recommender?.phone_number || ""}'
          ,'${recommender?.masoliat || ""}'
          ,'${recommender?.address || ""}'
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
          ,'${
            moment(commander["ezamDate"]).isValid()
              ? moment(commander["ezamDate"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,'${commander?.address || ""}'
          ,${commander?.vkhedmat || null}
          ,${commander?.vazravani || null}
          ,${commander?.vazjesmani || null}
          ,'${commander?.phone_number || ""}'
          ,${commander?.marig || null}
          ,${commander?.Jens || null}
          ,${commander?.education || null}
          ,'${
            moment(commander["birthdate"]).isValid()
              ? moment(commander["birthdate"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,${commander?.rotbe || null}
          ,${commander?.RastehAsli || null}
          ,'${commander?.masoliat || ""}'
          ,${
            applauser?.pasdari_code ||
            applauseSpec?.punishment_subject_pasdari_code ||
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
          ,${applauseSpec.punishment_type_id || null}
          ,${
            applauseSpec?.punishment_description
              ? `'${applauseSpec?.punishment_description}'`
              : null
          }
          ,'${
            moment(applauseSpec["punishment_date"]).isValid()
              ? moment(applauseSpec["punishment_date"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,'${
            moment(applauseSpec["punishment_do_date"]).isValid()
              ? moment(applauseSpec["punishment_do_date"]).format("YYYY/MM/DD")
              : "0000-00-00"
          }'
          ,${applauseSpec?.punishment_count || 0}
          ,${applauseSpec?.punishment_kasr_hoghoogh || 0}
          ,${applauseSpec?.punishment_wrongdoins_type || null}
          ,${applauseSpec.citation_cases_id || null}
        )
      `,
  );
  return createdpunishments;
};

// update punishments
const updatePunishment = async (applauseSpec) => {
  const updatedpunishments = await pool.execute(`
    UPDATE judicialapp.judicial_punishments
      SET
        punishment_user_id = ${applauseSpec.user_id},
        punishment_type_id = '${applauseSpec.punishment_type_id}',
        punishment_description = '${applauseSpec["punishment_description"]}',
        punishment_date = '${
          moment(applauseSpec["punishment_date"]).isValid()
            ? moment(applauseSpec["punishment_date"]).format("YYYY/MM/DD")
            : "'0000-00-00'"
        }',
        punishment_do_date = '${
          moment(applauseSpec["punishment_do_date"]).isValid()
            ? moment(applauseSpec["punishment_do_date"]).format("YYYY/MM/DD")
            : "'0000-00-00'"
        }',
        punishment_count = '${applauseSpec["punishment_count"]}',
        punishment_kasr_hoghoogh = '${
          applauseSpec["punishment_kasr_hoghoogh"]
        }',
        punishment_wrongdoins_type_id = '${
          applauseSpec["punishment_wrongdoins_type"]
        }',
        punishment_citation_cases_id = '${applauseSpec.citation_cases_id}'
      WHERE punishment_id = ${applauseSpec["id"]};
`);

  return updatedpunishments;
};

// find punishments_wrongdoing
const findPunishments = async ({ page, pageSize, filterStr, sortStr }) => {
  const baseQuery = `SELECT
    (@row_number := @row_number + 1) AS row,
    pun.punishment_id AS id,
    pun.punishment_subject_parvande_code AS parvandeCode,
    CONCAT(pun.punishment_subject_surname, ' ', pun.punishment_subject_name) AS name,
    pun.punishment_subject_nationality_code AS nationalCode,
    CONCAT(pun.punishment_recommender_surname, ' ', pun.punishment_recommender_name) AS recommender,
    CONCAT(pun.punishment_commander_surname, ' ', pun.punishment_commander_name) AS commander,
    pun.punishment_description AS punishmentDescription,
    pdate(pun.punishment_date) AS punishmentDate,
    jst.status_title AS status,
    jst.status_id,
    apt.punishments_type_description AS punishmentType
    FROM (SELECT
            @row_number := ${page}) AS rn,
        judicial_punishments pun
          LEFT OUTER JOIN judicial_punishments_type apt
            ON pun.punishment_type_id = apt.punishments_type_id
          LEFT OUTER JOIN judicial_status_table jst
            ON jst.status_id = pun.punishment_status
    WHERE ${filterStr}`;
  const punishments = await pool.execute(
    `${baseQuery}
    ORDER BY ${sortStr}
    LIMIT ${page}, ${pageSize};`,
  );
  const punishmentsTotalRows = await pool.execute(`${baseQuery}`);

  return {
    punishments: punishments[0],
    punishmentsTotalRows: punishmentsTotalRows[0].length,
  };
};

// update punishments status
const updatePunishmentStatus = async (req, id, status) => {
  const user_id = req.session.userdata.id;
  const punishments = await pool.execute(`UPDATE judicial_punishments p
                                        SET 
                                          punishment_user_id=${user_id}, 
                                          punishment_status=${status}
                                        WHERE 
                                          p.punishment_id = ${id}`);
  return punishments;
};

// delete punishments status
const deletePunishment = async (id) => {
  const punishments = await pool.execute(`DELETE FROM judicial_punishments 
                                          WHERE judicial_punishments.punishment_id = ${id}`);
  return punishments;
};

// find punishments data
const findPunishment = async (id) => {
  const punishments = await pool.execute(`CALL get_punishment(${id})`);

  punishments[0][0][0]["citations_description"] = citationsDescription(
    punishments[0][0][0]["punishments_wrongdoings_row"],
    punishments[0][0][0]["punishments_wrongdoings_table_number"],
    punishments[0][0][0]["punishments_wrongdoings_made"],
  );

  return punishments[0];
};

module.exports = {
  addPunishmentTypes,
  findPunishmentsTypes,
  deletePunishmentType,
  updatePunishmentType,
  findPunishmentsWrongdoing,
  findDisciplinaryCitations,
  addPunishmentWrongdoing,
  deletePunishmentWrongdoing,
  updatePunishmentWrongdoing,
  createPunishments,
  findPunishments,
  updatePunishmentStatus,
  deletePunishment,
  findPunishment,
  updatePunishment,
};
