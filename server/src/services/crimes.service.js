const pool = require("./database/db");
const moment = require("jalali-moment");
require("dotenv").config();

// find crimes types
const findCrimesTypes = async () => {
  const crimesTypes = await pool.execute(
    `SELECT 
      crimes_type_id as id, 
      crimes_type_code as code, 
      crimes_type_title as description 
    FROM judicial_crimes_types`,
  );
  return crimesTypes;
};

// find Crimes Judicial Audit Referee
const findCrimesJudicialAuditReferee = async () => {
  const crimes_audit_ref = await pool.execute(
    `SELECT judicial_audit_ref_id as id, 
      judicial_audit_ref_code as code,
      judicial_audit_ref_title as description
      FROM judicial_crimes_judicial_audit_referee`,
  );
  return crimes_audit_ref;
};

// add hoghoughi organizations
const addHoghughiOrganizations = async (orgs) => {
  const hoghughiOrganizations = await pool.execute(
    `INSERT INTO judicialapp.judicial_hoghughi_organizations
      (
        hoghughi_organizations_code
        ,hoghughi_organizations_title
      )
      VALUES
      (
        ${orgs.code} -- hoghughi_organizations_code - TINYINT(3) NOT NULL
        ,'${orgs.description}' -- hoghughi_organizations_title - VARCHAR(70) NOT NULL
      )`,
  );
  return hoghughiOrganizations;
};

// find hoghoughi organizations
const findHoghughiOrganizations = async () => {
  const hoghughiOrganizations = await pool.execute(
    `SELECT hoghughi_organizations_id as id, hoghughi_organizations_title as description, hoghughi_organizations_code as code FROM judicial_hoghughi_organizations`,
  );
  return hoghughiOrganizations;
};

// edit hoghoughi organizations
const editHoghughiOrganizations = async (orgs) => {
  const hoghughiOrganizations = await pool.execute(
    `UPDATE judicialapp.judicial_hoghughi_organizations
    SET
    hoghughi_organizations_code =  ${orgs.code} -- hoghughi_organizations_code - TINYINT(3) NOT NULL
    ,hoghughi_organizations_title = '${orgs.description}' -- hoghughi_organizations_title - VARCHAR(70) NOT NULL
    WHERE
    hoghughi_organizations_id = ${orgs.id} -- hoghughi_organizations_id - INT(11) NOT NULL`,
  );
  return hoghughiOrganizations;
};

// delete hoghoughi organizations
const deleteHoghughiOrganizations = async (id) => {
  const hoghughiOrganizations = await pool.execute(
    `DELETE FROM judicialapp.judicial_hoghughi_organizations
      WHERE
      hoghughi_organizations_id = ${id} -- hoghughi_organizations_id - INT(11) NOT NULL`,
  );
  return hoghughiOrganizations;
};

// add judicial Audit Referee
const addJudicialAuditReferee = async (orgs) => {
  const judicialAuditRef = await pool.execute(
    `INSERT INTO judicialapp.judicial_crimes_judicial_audit_referee
      (
      judicial_audit_ref_code
      ,judicial_audit_ref_title
      )
    VALUES
      (
      ${orgs.code} -- judicial_audit_ref_code - TINYINT(1) NOT NULL
      ,'${orgs.description}' -- judicial_audit_ref_title - VARCHAR(50) NOT NULL
      )`,
  );
  return judicialAuditRef;
};

// edit judicial Audit Referee
const editJudicialAuditReferee = async (orgs) => {
  const judicialAuditRef = await pool.execute(
    `UPDATE judicialapp.judicial_crimes_judicial_audit_referee 
    SET
      judicial_audit_ref_code = ${orgs.code} -- judicial_audit_ref_code - TINYINT(1) NOT NULL
    ,judicial_audit_ref_title = '${orgs.description}' -- judicial_audit_ref_title - VARCHAR(50) NOT NULL
    WHERE
      judicial_audit_ref_id = ${orgs.id} -- judicial_audit_ref_id - TINYINT(3) NOT NULL`,
  );
  return judicialAuditRef;
};

// delete judicial audit referee
const deleteJudicialAuditReferee = async (id) => {
  const judicialAuditRef = await pool.execute(
    `DELETE FROM judicialapp.judicial_crimes_judicial_audit_referee
      WHERE
        judicial_audit_ref_id = ${id} -- judicial_audit_ref_id - TINYINT(3) NOT NULL`,
  );
  return judicialAuditRef;
};

// insert into crimes table
const createCrime = async (mojrem, shaki, jormSpec) => {
  const EMPTY_ID_FIELD = 255;
  const createdCrime = await pool.execute(
    `INSERT INTO judicial_crimes
      (
      crimes_user_id
      ,crimes_mojrem_pasdari_code
      ,crimes_mojrem_parvande_code
      ,crimes_mojrem_name
      ,crimes_mojrem_surname
      ,crimes_mojrem_fathername
      ,crimes_mojrem_nationality_code
      ,crimes_mojrem_ozviyat_type
      ,crimes_mojrem_employee_type
      ,crimes_mojrem_rank
      ,crimes_mojrem_position
      ,crimes_mojrem_unit
      ,crimes_mojrem_rotbe
      ,crimes_mojrem_address
      ,crimes_mojrem_raste
      ,crimes_mojrem_birthdate
      ,crimes_mojrem_ezamdate
      ,crimes_mojrem_jens
      ,crimes_mojrem_vazkhedmati
      ,crimes_mojrem_vazjesmani
      ,crimes_mojrem_vazravani
      ,crimes_mojrem_marig
      ,crimes_mojrem_phone
      ,crimes_mojrem_responsibility
      ,crimes_mojrem_education
      ,crimes_shaki_employee_type
      ,crimes_shaki_type
      ,crimes_shaki_hoghughi
      ,crimes_shaki_number
      ,crimes_shaki_pasdari_code
      ,crimes_shaki_parvande_code
      ,crimes_shaki_name
      ,crimes_shaki_surname
      ,crimes_shaki_fathername
      ,crimes_shaki_nationality_code
      ,crimes_shaki_ozviyat_type
      ,crimes_shaki_rank
      ,crimes_shaki_position
      ,crimes_shaki_unit
      ,crimes_shaki_rotbe
      ,crimes_shaki_address
      ,crimes_shaki_raste
      ,crimes_shaki_birthdate
      ,crimes_shaki_ezamdate
      ,crimes_shaki_jens
      ,crimes_shaki_vazkhedmati
      ,crimes_shaki_vazjesmani
      ,crimes_shaki_vazravani
      ,crimes_shaki_marig
      ,crimes_shaki_phone
      ,crimes_shaki_responsibility
      ,crimes_shaki_education
      ,crimes_crime_date
      ,crimes_crime_type
      ,crimes_judicial_audit_reference
      ,crimes_jorm_occurance_date
      ,crimes_jorm_notify_date
      ,crimes_mojazat_amount
      ,crimes_hokm_date
      ,crimes_issued_hokm
      ,crimes_jorm_describtion
      )
      VALUES
      (
      ${jormSpec.user_id} -- crimes_user_id - INT(11) NOT NULL
      ,${
        mojrem?.pasdari_code || jormSpec?.crimes_mojrem_pasdari_code
          ? `'${mojrem?.pasdari_code || jormSpec?.crimes_mojrem_pasdari_code}'`
          : null
      } -- crimes_mojrem_pasdari_code - VARCHAR(255) NOT NULL
      ,${
        mojrem?.code ? `'${mojrem?.code}'` : null
      } -- crimes_mojrem_parvande_code - VARCHAR(12) NOT NULL
      ,${
        mojrem?.firstname ? `'${mojrem?.firstname}'` : null
      } -- crimes_mojrem_name - VARCHAR(255) NOT NULL
      ,${
        mojrem?.surname ? `'${mojrem?.surname}'` : null
      } -- crimes_mojrem_surname - VARCHAR(255) NOT NULL
      ,${
        mojrem?.fathername ? `'${mojrem?.fathername}'` : null
      } -- crimes_mojrem_fathername - VARCHAR(255) NOT NULL
      ,${
        mojrem?.nationalcode ? `'${mojrem?.nationalcode}'` : null
      } -- crimes_mojrem_nationality_code - VARCHAR(255) NOT NULL
      ,${
        mojrem?.ozviyat_code || null
      } -- crimes_mojrem_ozviyat_type - VARCHAR(255) NOT NULL
      ,${
        mojrem?.ozviyat_type ? `'${mojrem?.ozviyat_type}'` : null
      } -- crimes_mojrem_employee_type - VARCHAR(255) NOT NULL
      ,${mojrem?.daraje || null} -- crimes_mojrem_rank - VARCHAR(255) NOT NULL
      ,${
        mojrem?.jaygah || EMPTY_ID_FIELD
      } -- crimes_mojrem_position - VARCHAR(255) NOT NULL
      ,${mojrem?.unit || null} -- crimes_mojrem_unit - VARCHAR(255) NOT NULL
      ,${
        mojrem?.rotbe || EMPTY_ID_FIELD
      } -- crimes_mojrem_rotbe - INT(11) NOT NULL
      ,'${mojrem?.address || ""}' -- crimes_mojrem_address - TEXT NOT NULL
      ,${
        mojrem?.RastehAsli || EMPTY_ID_FIELD
      } -- crimes_mojrem_raste - INT(11) NOT NULL
      ,'${
        moment(mojrem?.birthdate || " ").isValid()
          ? moment(mojrem.birthdate || " ").format("YYYY-MM-DD")
          : "0000-00-00"
      }' -- crimes_mojrem_birthdate - DATE NOT NULL
      ,'${
        moment(mojrem?.ezamDate || " ").isValid()
          ? moment(mojrem?.ezamDate || " ").format("YYYY-MM-DD")
          : "0000-00-00"
      }' -- crimes_mojrem_ezamdate - DATE NOT NULL
      ,${mojrem?.Jens || null} -- crimes_mojrem_jens - INT(11) NOT NULL
      ,${
        mojrem?.vkhedmat || null
      } -- crimes_mojrem_vazkhedmati - INT(11) NOT NULL
      ,${
        mojrem?.vazjesmani || null
      } -- crimes_mojrem_vazjesmani - INT(11) NOT NULL
      ,${
        mojrem?.vazravani || null
      } -- crimes_mojrem_vazravani - INT(11) NOT NULL
      ,${mojrem?.marig || null} -- crimes_mojrem_marig - INT(11) NOT NULL
      ,'${
        mojrem?.phone_number || ""
      }' -- crimes_mojrem_phone - VARCHAR(11) NOT NULL
      ,'${
        mojrem?.masoliat || ""
      }' -- crimes_mojrem_responsibility - VARCHAR(255) NOT NULL
      ,${
        mojrem?.education || null
      } -- crimes_mojrem_education - INT(11) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2
          ? '""'
          : jormSpec?.crimes_shaki_employee_type
          ? `'${jormSpec?.crimes_shaki_employee_type}'`
          : null
      } -- crimes_shaki_employee_type - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type ? `'${jormSpec?.crimes_shaki_type}'` : null
      } -- crimes_shaki_type - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 1
          ? '""'
          : jormSpec?.crimes_shaki_hoghughi_id || null
      } -- crimes_shaki_hoghughi - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2
          ? '""'
          : jormSpec?.crimes_shaki_number
          ? `'${jormSpec?.crimes_shaki_number}'`
          : null
      } -- crimes_shaki_number - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2
          ? '""'
          : shaki?.pasdari_code || jormSpec?.crimes_shaki_pasdari_code
          ? `'${shaki?.pasdari_code || jormSpec?.crimes_shaki_pasdari_code}'`
          : null
      } -- crimes_shaki_pasdari_code - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2
          ? '""'
          : shaki?.code
          ? `'${shaki?.code}'`
          : null
      } -- crimes_shaki_parvande_code - VARCHAR(12) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2
          ? '""'
          : shaki?.firstname
          ? `'${shaki?.firstname}'`
          : null
      } -- crimes_shaki_name - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2
          ? '""'
          : shaki?.surname
          ? `'${shaki?.surname}'`
          : null
      } -- crimes_shaki_surname - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2
          ? '""'
          : shaki?.fathername
          ? `'${shaki?.fathername}'`
          : null
      } -- crimes_shaki_fathername - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2
          ? '""'
          : shaki?.nationalcode
          ? `'${shaki?.nationalcode}'`
          : null
      } -- crimes_shaki_nationality_code - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2 ? 0 : shaki?.ozviyat_code || null
      } -- crimes_shaki_ozviyat_type - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2 ? 0 : shaki?.daraje || null
      } -- crimes_shaki_rank - VARCHAR(255) NOT NULL
      ,${
        shaki?.jaygah || EMPTY_ID_FIELD
      } -- crimes_shaki_position - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2 ? 0 : shaki?.unit || null
      } -- crimes_shaki_unit - VARCHAR(255) NOT NULL
      ,${
        shaki?.rotbe || EMPTY_ID_FIELD
      } -- crimes_shaki_rotbe - INT(11) NOT NULL
      ,'${
        jormSpec?.crimes_shaki_type == 2 ? '""' : shaki?.address || " "
      }' -- crimes_shaki_address - TEXT NOT NULL
      ,${
        shaki?.RastehAsli || EMPTY_ID_FIELD
      } -- crimes_shaki_raste - INT(11) NOT NULL
      ,'${
        moment(shaki?.birthdate || " ").isValid()
          ? moment(shaki?.birthdate || " ").format("YYYY-MM-DD")
          : "0000-00-00"
      }' -- crimes_shaki_birthdate - DATE NOT NULL
      ,'${
        moment(shaki?.ezamDate || " ").isValid()
          ? moment(shaki?.ezamDate || " ").format("YYYY-MM-DD")
          : "0000-00-00"
      }' -- crimes_shaki_ezamdate - DATE NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2 ? 0 : shaki?.Jens || null
      } -- crimes_shaki_jens - INT(11) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2 ? 0 : shaki?.vkhedmat || null
      } -- crimes_shaki_vazkhedmati - INT(11) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2 ? 0 : shaki?.vazjesmani || null
      } -- crimes_shaki_vazjesmani - INT(11) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2 ? 0 : shaki?.vazravani || null
      } -- crimes_shaki_vazravani - INT(11) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2 ? 0 : shaki?.marig || null
      } -- crimes_shaki_marig - INT(11) NOT NULL
      ,'${
        jormSpec?.crimes_shaki_type == 2 ? " " : shaki?.phone_number || " "
      }' -- crimes_shaki_phone - VARCHAR(11) NOT NULL
      ,'${
        jormSpec?.crimes_shaki_type == 2 ? " " : shaki?.masoliat || " "
      }' -- crimes_shaki_responsibility - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_shaki_type == 2 ? 0 : shaki?.education || null
      } -- crimes_shaki_education - INT(11) NOT NULL
      ,'${
        moment(jormSpec?.crimes_crime_date || " ").isValid()
          ? moment(jormSpec?.crimes_crime_date || " ").format("YYYY-MM-DD")
          : "0000-00-00"
      }' -- crimes_crime_date - DATE NOT NULL
      ,${
        jormSpec?.crime_type_id || null
      } -- crimes_crime_type - VARCHAR(5) NOT NULL
      ,${
        jormSpec?.crimes_judicial_audit_reference_id || null
      } -- crimes_judicial_audit_reference - VARCHAR(5) NOT NULL
      ,'${
        moment(jormSpec?.crimes_jorm_occurance_date || " ").isValid()
          ? moment(jormSpec?.crimes_jorm_occurance_date || " ").format(
              "YYYY-MM-DD",
            )
          : "0000-00-00"
      }' -- crimes_jorm_occurance_date - DATE NOT NULL
      ,'${
        moment(jormSpec?.crimes_jorm_notify_date || " ").isValid()
          ? moment(jormSpec?.crimes_jorm_notify_date || " ").format(
              "YYYY-MM-DD",
            )
          : "0000-00-00"
      }' -- crimes_jorm_notify_date - DATE NOT NULL
      ,${
        jormSpec?.crimes_mojazat_amount
          ? `'${jormSpec?.crimes_mojazat_amount}'`
          : null
      } -- crimes_mojazat_amount - TEXT NOT NULL
      ,'${
        moment(jormSpec?.crimes_hokm_date || " ").isValid()
          ? moment(jormSpec?.crimes_hokm_date || " ").format("YYYY-MM-DD")
          : "0000-00-00"
      }' -- crimes_hokm_date - DATE NOT NULL
      ,${
        jormSpec?.crimes_issued_hokm
          ? `'${jormSpec?.crimes_issued_hokm}'`
          : null
      } -- crimes_issued_hokm - VARCHAR(255) NOT NULL
      ,${
        jormSpec?.crimes_jorm_describtion
          ? `'${jormSpec?.crimes_jorm_describtion}'`
          : null
      } -- crimes_jorm_describtion - TEXT NOT NULL
      );
      `,
  );
  return createdCrime;
};

// update crimes
const updateCrime = async (jormSpec) => {
  const updatedcrimes = await pool.execute(`
    UPDATE judicial_crimes
    SET crimes_user_id = ${jormSpec.user_id},
    crimes_mojrem_employee_type = '${
      jormSpec?.crimes_mojrem_employee_type || " "
    }',
    crimes_shaki_employee_type = '${
      jormSpec?.crimes_shaki_type == 2
        ? " "
        : jormSpec?.crimes_shaki_employee_type || " "
    }',
    crimes_shaki_type = '${jormSpec?.crimes_shaki_type || " "}',
    crimes_shaki_hoghughi = '${jormSpec?.crimes_shaki_hoghughi_id || " "}',
    crimes_shaki_number = '${
      jormSpec?.crimes_shaki_type == 2
        ? " "
        : jormSpec?.crimes_shaki_number || " "
    }',
    crimes_crime_date = '${
      moment(jormSpec?.crimes_crime_date || " ").isValid()
        ? moment(jormSpec?.crimes_crime_date || " ").format("YYYY-MM-DD")
        : "0000-00-00"
    }',
    crimes_crime_type = '${jormSpec?.crime_type_id || " "}',
    crimes_judicial_audit_reference = '${
      jormSpec?.crimes_judicial_audit_reference_id || " "
    }',
    crimes_jorm_occurance_date = '${
      moment(jormSpec?.crimes_jorm_occurance_date || " ").isValid()
        ? moment(jormSpec?.crimes_jorm_occurance_date || " ").format(
            "YYYY-MM-DD",
          )
        : "0000-00-00"
    }',
    crimes_jorm_notify_date = '${
      moment(jormSpec?.crimes_jorm_notify_date || " ").isValid()
        ? moment(jormSpec?.crimes_jorm_notify_date || " ").format("YYYY-MM-DD")
        : "0000-00-00"
    }',
    crimes_mojazat_amount = '${jormSpec?.crimes_mojazat_amount || " "}',
    crimes_hokm_date = '${
      moment(jormSpec?.crimes_hokm_date || " ").isValid()
        ? moment(jormSpec?.crimes_hokm_date || " ").format("YYYY-MM-DD")
        : "0000-00-00"
    }',
    crimes_issued_hokm = '${jormSpec?.crimes_issued_hokm || " "}',
    crimes_jorm_describtion = '${jormSpec?.crimes_jorm_describtion || " "}'
    WHERE crimes_id = ${jormSpec.id};
`);

  return updatedcrimes;
};

// find crimes_wrongdoing
const findCrimes = async ({ page, pageSize, filterStr, sortStr }) => {
  const baseQuery = `SELECT
    (@row_number := @row_number + 1) AS row,
    jc.crimes_id AS id,
    jc.crimes_mojrem_parvande_code AS parvandeCode,
    CONCAT(jc.crimes_mojrem_surname, ' ', jc.crimes_mojrem_name) AS name,
    jc.crimes_mojrem_nationality_code AS nationalCode,
    CONCAT(jc.crimes_shaki_surname, ' ', jc.crimes_shaki_name) AS shaki,
    jc.crimes_shaki_number AS shakiNumber,
    jct.crimes_type_title AS crimeType,
    jc.crimes_issued_hokm AS issuedVerdict,
    pdate(jc.crimes_jorm_occurance_date) AS crimeOccuranceDate,
    jst.status_title AS status,
    jst.status_id
    FROM (SELECT
            @row_number := ?) AS rn,
        judicial_crimes jc
          LEFT OUTER JOIN judicial_crimes_types jct
            ON jc.crimes_crime_type = jct.crimes_type_id
          LEFT OUTER JOIN judicial_status_table jst
            ON jst.status_id = jc.crime_status
    WHERE ${filterStr}`;
  const crimes = await pool.query(
    `${baseQuery}
    ORDER BY ${sortStr}
    LIMIT ?, ?;`,
    [page, page, pageSize],
  );
  const crimesTotalRows = await pool.query(`${baseQuery}`, [page]);

  return {
    crimes: crimes[0],
    crimesTotalRows: crimesTotalRows[0].length,
  };
};

// update crimes status
const updateCrimeStatus = async (req, id, status) => {
  const user_id = req.session.userdata.id;
  const crimes = await pool.execute(`UPDATE judicial_crimes jc
                                        SET 
                                          crimes_user_id=${user_id}, 
                                          crime_status=${status}
                                        WHERE 
                                          jc.crimes_id = ${id}`);
  return crimes;
};

// delete crimes status
const deleteCrime = async (id) => {
  const crimes = await pool.execute(
    `DELETE FROM judicial_crimes WHERE crimes_id = ${id}`,
  );
  return crimes;
};

// find crimes data
const findCrime = async (id) => {
  const crimes = await pool.execute(`CALL get_crime(${id})`);
  return crimes[0];
};

module.exports = {
  findCrimesTypes,
  findCrimesJudicialAuditReferee,
  createCrime,
  findCrimes,
  updateCrimeStatus,
  deleteCrime,
  findCrime,
  updateCrime,
  addHoghughiOrganizations,
  findHoghughiOrganizations,
  editHoghughiOrganizations,
  deleteHoghughiOrganizations,
  addJudicialAuditReferee,
  editJudicialAuditReferee,
  deleteJudicialAuditReferee,
};
