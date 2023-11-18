const pool = require("./database/db");
require("dotenv").config();

// Query Body for find employees features
const QUERY_BODY = `SELECT 
        personnel_id as id, 
        parvande as code,
        CodeP as pasdari_code,
        Name as firstname,
        Famil as surname,
        NamePadar as fathername,
        CodeMelli as nationalcode,
        DarajehMosavab as daraje,
        daraje_title as daraje_title,
        codevahed as unit,
        vahed_title as vahed_title,
        Jaygah as jaygah,
        jaygah_title,
        Jens,
        jens_title,
        MadrakTahsili as education,
        tahsili_title as tahsili_title,
        Ozvieat as ozviyat_code,
        '1' as ozviyat_type,
        ozviat_type_title as ozviyat_type_title,
        RastehAsli,
        raste_title,
        masoliat,
        rotbe,
	      rotbe_title,
	      phone_number,
        address,
        vazravani,
        vazravani_title,
        vazjesmani,
        vazjesmani_title,
        vkhedmat,
        vkhedmat_title,
        CodeTahol as marig,
        marig_title,
        SaleTavalod as birthdate,
        DVorud as ezamDate,
        updated_at
        FROM judicial_personnels gp
      LEFT OUTER JOIN judicial_ozviat_type jot
      ON jot.ozviat_type_id = gp.Ozvieat
      LEFT OUTER JOIN judicial_vahed jv
      ON jv.vahed_id = gp.codevahed
      LEFT OUTER JOIN judicial_daraje jd
      ON jd.daraje_id = gp.DarajehMosavab
      LEFT OUTER JOIN judicial_tahsili jt
      ON jt.tahsili_id = gp.MadrakTahsili
      LEFT OUTER JOIN judicial_vkhedmat jvk
      ON jvk.vkhedmat_id = gp.vkhedmat
      LEFT OUTER JOIN judicial_vazravani jvr
      ON jvr.vazravani_id = gp.vazravani
      LEFT OUTER JOIN judicial_vazjesmani jvj
      ON jvj.vazjesmani_id = gp.vazjesmani
      LEFT OUTER JOIN judicial_raste jr
      ON jr.raste_id = gp.RastehAsli
      LEFT OUTER JOIN judicial_jens jjens
      ON jjens.jens_id = gp.Jens
      LEFT OUTER JOIN judicial_rotbe jrotbe
      ON jrotbe.rotbe_id = gp.rotbe
      LEFT OUTER JOIN judicial_marig jmarig
      ON jmarig.marig_id = gp.CodeTahol
      LEFT OUTER JOIN judicial_jaygah jjaygah
      ON jjaygah.jaygah_id = gp.Jaygah`;

// save Employee
const saveEmployee = async (employee) => {
  const empl = await pool.execute(
    `INSERT INTO judicial_personnels(
      CodeP,
      parvande,
      Name,
      Famil,
      CodeMelli,
      NamePadar,
      MadrakTahsili,
      Jens,
      Ozvieat,
      DarajehMosavab,
      Jaygah,
      RastehAsli, 
      codevahed,
      SaleTavalod,
      DVorud,
      CodeTahol,
      masoliat,
      phone_number,
      address,
      vazravani,
      vazjesmani,
      vkhedmat,
      rotbe
      ) 
      VALUES 
      (
        ${employee["pasdari_code"]},
        ${employee["parvande_code"]},
        '${employee["name"]}',
        '${employee["surname"]}',
        '${employee["nationality_code"]}',
        '${employee["fathername"]}',
        ${employee["education"].id},
        ${employee["jens"].id},
        ${employee["ozviat_type"].id},
        ${employee["rank"].id},
        ${employee["jaygah"].id},
        ${employee["raste"].id},
        ${employee["vahed"].id},
        '${employee["birthdate"]}',
        '${employee["ezamdate"]}',
        ${employee["marig_status"].id},
        '${employee["masoliat"]}',
        '${employee["phone_number"]}',
        '${employee["address"]}',
        ${employee["vaziat_ravani"].id},
        ${employee["vaziat_jesmani"].id},
        ${employee["vaziat_khedmat"].id},
        ${employee["rotbe"].id}
      )
      `,
  );
  return empl;
};
// edit Employee
const updateEmployee = async (employee) => {
  const empl = await pool.execute(
    `UPDATE judicial_personnels
      SET 
        CodeP=${employee["pasdari_code"]},
        parvande=${employee["parvande_code"]},
        Name='${employee["name"]}',
        Famil='${employee["surname"]}',
        CodeMelli='${employee["nationality_code"]}',
        NamePadar='${employee["fathername"]}',
        MadrakTahsili= ${employee["education"].id},
        Jens=${employee["jens"].id},
        Ozvieat=${employee["ozviat_type"].id},
        DarajehMosavab= ${employee["rank"].id},
        Jaygah=${employee["jaygah"].id},
        rotbe='${employee["rotbe"].id}',
        RastehAsli= ${employee["raste"].id},
        codevahed='${employee["vahed"].id}',
        SaleTavalod='${employee["birthdate"]}',
        DVorud='${employee["ezamdate"]}',
        CodeTahol=${employee["marig_status"].id},
        masoliat='${employee["masoliat"]}',
        phone_number='${employee["phone_number"]}',
        address='${employee["address"]}',
        vazravani= ${employee["vaziat_ravani"].id},
        vazjesmani= ${employee["vaziat_jesmani"].id},
        vkhedmat=${employee["vaziat_khedmat"].id}
      WHERE personnel_id=${employee["id"]}
      `,
  );
  return empl;
};

// Update Employee masoliat
const updateEmployeeMasoliat = async ({ masoliat, id }) => {
  const pasdar = await pool.execute(
    `UPDATE judicial_personnels 
      SET 
        masoliat='${masoliat}'
      WHERE personnel_id=${id}
    `,
  );
  return pasdar;
};

// Find Employees
const findEmployees = async (code) => {
  const pasdar = await pool.execute(`${QUERY_BODY} ORDER BY updated_at DESC`);
  return pasdar;
};

// Find Employees by nationality code or pasdari code
const findEmployeeByCode = async (code) => {
  code = String(code).trim();
  const pasdar = await pool.execute(
    `${QUERY_BODY}
      WHERE CodeP = '${code}' OR parvande = '${code}' OR CodeMelli = '${code}' OR Famil LIKE '%${code}%'`,
  );
  return pasdar;
};

// Find Employees by pasdari code
const findEmployeePasdariCode = async (pasdari_code) => {
  const pasdar = await pool.execute(
    `SELECT CodeP FROM judicial_personnels
      WHERE CodeP = '${pasdari_code}'`,
  );
  return pasdar;
};

// Find Employees by parvande code
const findEmployeeParvandeCode = async (parvande_code) => {
  const pasdar = await pool.execute(
    `SELECT parvande FROM judicial_personnels
      WHERE parvande = '${parvande_code}'`,
  );
  return pasdar;
};

// Find Employees by nationality code
const findEmployeeByNationalityCode = async (nationalitycode) => {
  const pasdar = await pool.execute(
    `SELECT CodeMelli FROM judicial_personnels
      WHERE CodeMelli = '${nationalitycode}'`,
  );
  return pasdar;
};

module.exports = {
  saveEmployee,
  updateEmployee,
  updateEmployeeMasoliat,
  findEmployeeByCode,
  findEmployees,
  findEmployeePasdariCode,
  findEmployeeParvandeCode,
  findEmployeeByNationalityCode,
};
