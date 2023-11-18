const pool = require("./database/db");
require("dotenv").config();

// find Jensiat
const findJensiat = async () => {
  const Jensiat = await pool.execute(
    `SELECT jens_id as id, jens_title as description, jens_code as code FROM judicial_jens`,
  );
  return Jensiat;
};

// find Jaygah
const findJaygah = async () => {
  const Jaygah = await pool.execute(
    `SELECT jaygah_id as id, jaygah_title as description, jaygah_code as code FROM judicial_jaygah`,
  );
  return Jaygah;
};

// find daraje
const findDaraje = async () => {
  const daraje = await pool.execute(
    `SELECT daraje_id as id, daraje_title as description, daraje_code	as code FROM judicial_daraje`,
  );
  return daraje;
};

// find marig
const findMarig = async () => {
  const marig = await pool.execute(
    `SELECT marig_id as id, marig_title as description, marig_code as code FROM judicial_marig`,
  );
  return marig;
};

// find Ozviat Type
const findOzviat = async () => {
  const ozviat = await pool.execute(
    `SELECT ozviat_type_id as id, ozviat_type_title as description, ozviat_type_code as code FROM judicial_ozviat_type`,
  );
  return ozviat;
};

// find Tahsilat
const findTahsilat = async () => {
  const Tahsilat = await pool.execute(
    `SELECT tahsili_id as id, tahsili_title as description, tahsili_code as code FROM judicial_tahsili 
    ORDER BY judicial_tahsili.tahsili_sort ASC, judicial_tahsili.tahsili_code ASC`,
  );
  return Tahsilat;
};

// find vahed
const findVahed = async () => {
  const vahed = await pool.execute(
    `SELECT vahed_id as id, vahed_title as description, vahed_code as code FROM judicial_vahed`,
  );
  return vahed;
};

// find vaziat jesmani
const findVazjesmani = async () => {
  const vazjesmani = await pool.execute(
    `SELECT vazjesmani_id as id, vazjesmani_title as description, vazjesmani_code as code FROM judicial_vazjesmani`,
  );
  return vazjesmani;
};

// find vaziat ravani
const findVazRavani = async () => {
  const vazravani = await pool.execute(
    `SELECT vazravani_id as id, vazravani_title as description, vazravani_code as code FROM judicial_vazravani`,
  );
  return vazravani;
};

// find vaziat ravani
const findVkhedmat = async () => {
  const vkhedmat = await pool.execute(
    `SELECT vkhedmat_id as id, vkhedmat_title as description, vkhedmat_code as code FROM judicial_vkhedmat`,
  );
  return vkhedmat;
};

// find raste
const findRaste = async () => {
  const raste = await pool.execute(
    `SELECT raste_id as id, raste_title as description, raste_code as code FROM judicial_raste`,
  );
  return raste;
};

const findEmployeeFormInputs = async () => {
  const jensiat = await pool.execute(
    `SELECT jens_id as id, jens_title as description, jens_code as code FROM judicial_jens`,
  );
  const jaygah = await pool.execute(
    `SELECT jaygah_id as id, jaygah_title as description, jaygah_code as code FROM judicial_jaygah`,
  );
  const daraje = await pool.execute(
    `SELECT daraje_id as id, daraje_title as description, daraje_code	as code FROM judicial_daraje`,
  );
  const rotbe = await pool.execute(
    `SELECT rotbe_id as id, rotbe_title as description, rotbe_code	as code FROM judicial_rotbe`,
  );
  const marig = await pool.execute(
    `SELECT marig_id as id, marig_title as description, marig_code as code FROM judicial_marig`,
  );
  const ozviat = await pool.execute(
    `SELECT ozviat_type_id as id, ozviat_type_title as description, ozviat_type_code as code FROM judicial_ozviat_type`,
  );
  const vahed = await pool.execute(
    `SELECT vahed_id as id, vahed_title as description, vahed_code as code FROM judicial_vahed`,
  );
  const vazjesmani = await pool.execute(
    `SELECT vazjesmani_id as id, vazjesmani_title as description, vazjesmani_code as code FROM judicial_vazjesmani`,
  );
  const vazravani = await pool.execute(
    `SELECT vazravani_id as id, vazravani_title as description, vazravani_code as code FROM judicial_vazravani`,
  );
  const vkhedmat = await pool.execute(
    `SELECT vkhedmat_id as id, vkhedmat_title as description, vkhedmat_code as code FROM judicial_vkhedmat`,
  );
  const raste = await pool.execute(
    `SELECT raste_id as id, raste_title as description, raste_code as code FROM judicial_raste`,
  );

  const tahsilat = await pool.execute(
    `SELECT tahsili_id as id, tahsili_title as description, tahsili_code as code FROM judicial_tahsili 
    ORDER BY judicial_tahsili.tahsili_sort ASC, judicial_tahsili.tahsili_code ASC`,
  );

  return {
    vahed: {
      title: "واحد",
      name: "vahed",
      value: vahed[0],
    },
    vkhedmat: {
      title: "وضعیت خدمتی",
      name: "vkhedmat",
      value: vkhedmat[0],
    },
    raste: {
      title: "رسته",
      name: "raste",
      value: raste[0],
    },
    jaygah: {
      title: "جایگاه",
      name: "jaygah",
      value: jaygah[0],
    },
    tahsilat: {
      title: "تحصیلات",
      name: "tahsilat",
      value: tahsilat[0],
    },
    marig: {
      title: "وضعیت تاهل",
      name: "marig",
      value: marig[0],
    },
    ozviat: {
      title: "نوع عضویت",
      name: "ozviat",
      value: ozviat[0],
    },
    daraje: { title: "درجه", name: "daraje", value: daraje[0] },
    rotbe: { title: "رتبه", name: "rotbe", value: rotbe[0] },
    vazjesmani: {
      title: "وضعیت جسمانی",
      name: "vazjesmani",
      value: vazjesmani[0],
    },
    vazravani: {
      title: "وضعیت روانی",
      name: "vazravani",
      value: vazravani[0],
    },

    jensiat: {
      title: "جنسیت",
      name: "jensiat",
      value: jensiat[0],
    },
  };
};

module.exports = {
  findJensiat,
  findJaygah,
  findDaraje,
  findMarig,
  findOzviat,
  findTahsilat,
  findVahed,
  findVazjesmani,
  findVazRavani,
  findVkhedmat,
  findRaste,
  findEmployeeFormInputs,
};
