const express = require("express");
const httpStatus = require("http-status");
const xlsx = require("xlsx");

const { normalize, schema } = require("../../utils/normalizr");
const pool = require("../../services/database/db");
const handleSuccess = require("../../utils/handleSuccess");
const handleError = require("../../utils/handleError");
const moment = require("jalali-moment");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(
      new handleError(
        "لطفا فایل موردنظر را برای آپلود انتخاب کنید!",
        [],
        httpStatus.BAD_REQUEST,
      ),
    );
  }

  if (
    !file.filename.includes(".xlsx") ||
    !file.filename.includes(".xls") ||
    !file.mimetype.includes("spreadsheet")
  ) {
    return next(
      new handleError(
        "فایل انتخابی باید اکسل باشد!",
        [],
        httpStatus.BAD_REQUEST,
      ),
    );
  }

  if (file.size > 2 * 1024 * 1024) {
    return next(
      new handleError(
        "حجم فایل انتخابی باید کمتر از 2 مگابایت باشد!",
        [],
        httpStatus.NOT_ACCEPTABLE,
      ),
    );
  }

  // Read the uploaded Excel file
  const workbook = xlsx.readFile(file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  // Convert Excel data to JSON
  const personnelData = xlsx.utils.sheet_to_json(sheet);

  // Insert or update records in the MySQL table
  // for (const person of personnelData) {
  //   const {
  //     CodeP,
  //     parvande,
  //     Name,
  //     Famil,
  //     CodeMelli,
  //     NamePadar,
  //     MadrakTahsili,
  //     Jens,
  //     Ozvieat,
  //     DarajehMosavab,
  //     Jaygah,
  //     rotbe,
  //     RastehAsli,
  //     codevahed,
  //     SaleTavalod,
  //     DVorud,
  //     CodeTahol,
  //     masoliat,
  //     phone_number,
  //     address,
  //     vazravani,
  //     vazjesmani,
  //     vkhedmat,
  //   } = person;
  // }

  try {
    // Madrak Tahsili
    const MadrakTahsili = await pool.execute(`
          SELECT
            *
          FROM judicial_tahsili
          `);
    const madrakTahsiliSchema = schema.Entity(
      "madrakTahsili",
      MadrakTahsili[0],
      {
        idAttribute: "tahsili_code",
      },
    );

    const normalizedMadrakTahsiliData = normalize(
      MadrakTahsili[0],
      madrakTahsiliSchema,
    );

    // vaziyat khedmat
    const vaziatKhedmati = await pool.execute(`
          SELECT
            *
          FROM judicial_vkhedmat
          `);
    const vaziatKhedmatiSchema = schema.Entity(
      "vaziatKhedmati",
      vaziatKhedmati[0],
      {
        idAttribute: "vkhedmat_code",
      },
    );

    const normalizedvaziatKhedmatiData = normalize(
      vaziatKhedmati[0],
      vaziatKhedmatiSchema,
    );

    // vaziyat ravani
    const vaziatRavani = await pool.execute(`
          SELECT
            *
          FROM judicial_vazravani
          `);
    const vaziatRavaniSchema = schema.Entity("vaziatRavani", vaziatRavani[0], {
      idAttribute: "vazravani_code",
    });

    const normalizedvaziatRavaniData = normalize(
      vaziatRavani[0],
      vaziatRavaniSchema,
    );

    // vaziyat jesmani
    const vaziatJesmani = await pool.execute(`
          SELECT
            *
          FROM judicial_vazjesmani
          `);
    const vaziatJesmaniSchema = schema.Entity(
      "vaziatJesmani",
      vaziatJesmani[0],
      {
        idAttribute: "vazjesmani_code",
      },
    );

    const normalizedvaziatJesmaniData = normalize(
      vaziatJesmani[0],
      vaziatJesmaniSchema,
    );

    // vahed
    const vahed = await pool.execute(`
          SELECT
            *
          FROM judicial_vahed
          `);
    const vahedSchema = schema.Entity("vahed", vahed[0], {
      idAttribute: "vahed_code",
    });

    const normalizedvahedData = normalize(vahed[0], vahedSchema);

    // rotbe
    const rotbe = await pool.execute(`
          SELECT
            *
          FROM judicial_rotbe
          `);
    const rotbeSchema = schema.Entity("rotbe", rotbe[0], {
      idAttribute: "rotbe_code",
    });

    const normalizedrotbeData = normalize(rotbe[0], rotbeSchema);

    // raste
    const raste = await pool.execute(`
          SELECT
            *
          FROM judicial_raste
          `);
    const rasteSchema = schema.Entity("raste", raste[0], {
      idAttribute: "raste_code",
    });

    const normalizedrasteData = normalize(raste[0], rasteSchema);

    // ozviat Type
    const ozviatType = await pool.execute(`
          SELECT
            *
          FROM judicial_ozviat_type
          `);
    const ozviatTypeSchema = schema.Entity("ozviatType", ozviatType[0], {
      idAttribute: "ozviat_type_code",
    });

    const normalizedozviatTypeData = normalize(ozviatType[0], ozviatTypeSchema);

    // marig Type
    const marig = await pool.execute(`
          SELECT
            *
          FROM judicial_marig
          `);
    const marigSchema = schema.Entity("marig", marig[0], {
      idAttribute: "marig_code",
    });

    const normalizedMarigData = normalize(marig[0], marigSchema);

    // jaygah Type
    const jaygah = await pool.execute(`
          SELECT
            *
          FROM judicial_jaygah
          `);
    const jaygahSchema = schema.Entity("jaygah", marig[0], {
      idAttribute: "jaygah_code",
    });

    const normalizedJaygahData = normalize(jaygah[0], jaygahSchema);

    // daraje Type
    const daraje = await pool.execute(`
          SELECT
            *
          FROM judicial_daraje
          `);
    const darajeSchema = schema.Entity("daraje", daraje[0], {
      idAttribute: "daraje_code",
    });

    const normalizedDarajeData = normalize(daraje[0], darajeSchema);

    // jensiat
    const jens = await pool.execute(`
          SELECT
            *
          FROM judicial_jens
          `);
    const jensSchema = schema.Entity("jens", jens[0], {
      idAttribute: "jens_code",
    });

    const normalizedJensData = normalize(jens[0], jensSchema);

    const defaultId = 255;

    const errorsPersonnelFields = [];

    // Insert or update records in the MySQL table
    const queryValues = personnelData.map(
      ({
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
        rotbe,
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
      }) => {
        if (!moment(SaleTavalod).isValid() || !moment(DVorud).isValid()) {
          errorsPersonnelFields.push(CodeP);
        }

        return [
          CodeP,
          parvande,
          Name,
          Famil,
          CodeMelli,
          NamePadar,
          normalizedMadrakTahsiliData.result[MadrakTahsili]?.tahsili_id ||
            defaultId,
          normalizedJensData.result[Jens]?.jens_id || defaultId,
          normalizedozviatTypeData.result[Ozvieat]?.ozviat_type_id || defaultId,
          normalizedDarajeData.result[DarajehMosavab]?.daraje_id || defaultId,
          normalizedJaygahData.result[Jaygah]?.jaygah_id || defaultId,
          normalizedrotbeData.result[rotbe]?.rotbe_id || defaultId,
          normalizedrasteData.result[RastehAsli]?.raste_id || defaultId,
          normalizedvahedData.result[codevahed]?.vahed_id || defaultId,
          moment
            .from(SaleTavalod, "fa", "YYYYMMDD")
            .local("en")
            .format("YYYY-MM-DD"),
          moment
            .from(DVorud, "fa", "YYYYMMDD")
            .local("en")
            .format("YYYY-MM-DD"),
          normalizedMarigData.result[CodeTahol]?.marig_id || defaultId,
          masoliat,
          phone_number,
          address,
          normalizedvaziatRavaniData.result[vazravani]?.vazravani_id ||
            defaultId,
          normalizedvaziatJesmaniData.result[vazjesmani]?.vazjesmani_id ||
            defaultId,
          normalizedvaziatKhedmatiData.result[vkhedmat]?.vkhedmat_id ||
            defaultId,
        ];
      },
    );
    await pool.query(
      `INSERT INTO judicial_personnels (CodeP, parvande, Name, Famil, CodeMelli, NamePadar, MadrakTahsili, Jens, Ozvieat, DarajehMosavab, Jaygah, rotbe, RastehAsli, codevahed, SaleTavalod, DVorud, CodeTahol, masoliat, phone_number, address, vazravani, vazjesmani, vkhedmat) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE 
      Name = VALUES(Name),
      Famil = VALUES(Famil),
      NamePadar = VALUES(NamePadar), 
      MadrakTahsili = VALUES(MadrakTahsili), 
      Jens = VALUES(Jens), 
      Ozvieat = VALUES(Ozvieat), 
      DarajehMosavab = VALUES(DarajehMosavab), 
      Jaygah = VALUES(Jaygah), 
      rotbe = VALUES(rotbe), 
      RastehAsli = VALUES(RastehAsli), 
      codevahed = VALUES(codevahed), 
      SaleTavalod = VALUES(SaleTavalod), 
      DVorud = VALUES(DVorud), 
      CodeTahol = VALUES(CodeTahol), 
      masoliat = VALUES(masoliat), 
      phone_number = VALUES(phone_number), 
      address = VALUES(address), 
      vazravani = VALUES(vazravani), 
      vazjesmani = VALUES(vazjesmani), 
      vkhedmat = VALUES(vkhedmat)`,
      [queryValues],
    );

    return handleSuccess(
      res,
      "به روزرسانی اطلاعات کارکنان با موفقیت انجام شد",
      errorsPersonnelFields,
      httpStatus.OK,
    );
  } catch (error) {
    console.error(error);
    return next(
      new handleError(
        "خطا در به روزرسانی اطلاعات کارکنان",
        [],
        httpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  }
});

module.exports = router;
