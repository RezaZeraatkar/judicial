const express = require("express");
const path = require("path");
const fs = require("fs");
const { createReport } = require("docx-templates");
const { normalize, schema } = require("normalizr");

const {
  findPunishmentsTypes,
  deletePunishmentType,
  addPunishmentTypes,
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
} = require("../../services/punishments.service");
const { findEmployeeByCode } = require("../../services/employees.service");
const isValidIranianNationalCode = require("../../utils/isValidNationalCode");
const requestGarrisonAPI = require("../../utils/garrisonApi");

const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");
const { persianDate } = require("../../utils/persianDate");
const { punishmentsColsMapping } = require("../../vars/columnsMapping");
// Define the schema for the punishment object
const punishmentSchema = new schema.Entity("punishments");
// Define the schema for the array of punishment
const punishmentListSchema = new schema.Array(punishmentSchema);

const router = express.Router();

// get Punishments types
router.get("/punishments-types", async (req, res, next) => {
  try {
    const [punishmentTypes, fields] = await findPunishmentsTypes();
    return handleSuccess(res, "", punishmentTypes, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// add Punishments types
router.post("/add-punishment-type", async (req, res, next) => {
  try {
    const [punishmentType, fields] = await addPunishmentTypes(req.body);
    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت ذخیره شد",
      punishmentType,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// delete Punishments types
router.delete("/delete-punishment-type", async (req, res, next) => {
  try {
    const [punishmentType, fields] = await deletePunishmentType(req.body);
    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت حذف شد",
      punishmentType,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// update Punishments types
router.put("/update-punishment-type", async (req, res, next) => {
  try {
    const [punishmentType, fields] = await updatePunishmentType(req.body);
    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت ویرایش شد",
      punishmentType,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get notorious services
router.get("/punishment-wrongdoings", async (req, res, next) => {
  try {
    const [notoriousServices, fields] = await findPunishmentsWrongdoing();
    return handleSuccess(res, "", notoriousServices, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get punishment disciplinary citations
router.get("/punishment-disciplinary-citations", async (req, res, next) => {
  try {
    const [disciplinaryCitations, fields] = await findDisciplinaryCitations();
    return handleSuccess(res, "", disciplinaryCitations, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

router.post("/add-punishment-wrongdoing", async (req, res, next) => {
  try {
    const [punishmentsWrongdoing, fields] = await addPunishmentWrongdoing(
      req.body,
    );
    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت ذخیره شد",
      punishmentsWrongdoing,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// delete punishment wrongdoing
router.delete("/delete-punishment-wrongdoing", async (req, res, next) => {
  try {
    const [deletedPunishmentWrongdoing, fields] =
      await deletePunishmentWrongdoing(req.body);
    return handleSuccess(
      res,
      "حدف رکورد موفقیت‌آمیز بود",
      deletedPunishmentWrongdoing,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// update punishment wrongdoing
router.put("/update-punishment-wrongdoing", async (req, res, next) => {
  try {
    const [updatedPunishmentWrongdoing, fields] =
      await updatePunishmentWrongdoing(req.body);
    return handleSuccess(
      res,
      "ویرایش با موفقیت انجام شد!",
      updatedPunishmentWrongdoing,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// create/add punishments
router.post("/add-punishments", async (req, res, next) => {
  try {
    let recommender = {};
    let commander = {};
    let applauser = {};
    let applauseSpec = {};
    let {
      punishment_recommender_nationality_code,
      punishment_commander_nationality_code,
      punishment_subject_nationality_code,
      punishment_subject_ozviat_type,
      punishment_subject_pasdari_code,
    } = req.body;

    if (punishment_recommender_nationality_code) {
      [recommender] = await findEmployeeByCode(
        punishment_recommender_nationality_code,
      );
    }
    if (!punishment_commander_nationality_code) {
      return next(
        new HandleError("مقام دستوردهنده را انتخاب نکرده‌اید!", [], 401),
      );
    }
    [commander] = await findEmployeeByCode(
      punishment_commander_nationality_code,
    );
    // if punishment_subject_ozviat_type = 1 => pasdar employee, else soldier
    if (punishment_subject_ozviat_type == 1) {
      [applauser] = await findEmployeeByCode(
        punishment_subject_nationality_code,
      );
    } else if (punishment_subject_ozviat_type == 2) {
      const soldierAPI = await requestGarrisonAPI(
        `${req.GarrisonBaseUrl}/soldier.php?code=${punishment_subject_nationality_code}`,
        next,
      );
      if (soldierAPI.status == 200) {
        applauser = soldierAPI.data;
        // else subject is a soldier, send a request to garrison api and get the soldier record
      } else {
        return next(
          new HandleError(
            "خطا در دسترسی به سامانه سربازان (garrison)",
            [],
            500,
          ),
        );
      }
    } else {
      return next(new HandleError("تنبیه‌شونده را انتخاب کنید!", [], 500));
    }

    const user_id = Number(req.session.userdata.id);
    const punishment_type_id = req.body["punishment_type"].id;
    const punishment_wrongdoins_type =
      req.body["punishment_wrongdoins_type"].id;
    const citation_cases_id = req.body["punishment_citation_cases"].id;
    const punishment_description = req.body["punishment_description"];
    const punishment_date = req.body["punishment_date"];
    const punishment_do_date = req.body["punishment_do_date"];
    const punishment_count = req.body["punishment_count"];
    const punishment_kasr_hoghoogh = req.body["punishment_kasr_hoghoogh"];

    applauseSpec = {
      user_id,
      punishment_type_id,
      punishment_wrongdoins_type,
      citation_cases_id,
      ozviat_type: punishment_subject_ozviat_type,
      punishment_description,
      punishment_date,
      punishment_do_date,
      punishment_count,
      punishment_subject_pasdari_code,
      punishment_kasr_hoghoogh,
    };
    const [punishment, fields] = await createPunishments(
      recommender[0],
      commander[0],
      applauser[0],
      applauseSpec,
    );
    return handleSuccess(res, "تشویق با موفقیت ثبت شد!", punishment, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// edit punishment
router.patch("/edit_punishment", async (req, res, next) => {
  try {
    let applauseSpec = {};
    const { id, punishment_subject_ozviat_type } = req.body;

    const user_id = Number(req.session.userdata.id);
    const punishment_type_id = req.body["punishment_type"].id;
    const punishment_wrongdoins_type =
      req.body["punishment_wrongdoins_type"].id;
    const citation_cases_id = req.body["punishment_citation_cases"].id;
    const punishment_description = req.body["punishment_description"];
    const punishment_date = req.body["punishment_date"];
    const punishment_do_date = req.body["punishment_do_date"];
    const punishment_count = req.body["punishment_count"];
    const punishment_kasr_hoghoogh = req.body["punishment_kasr_hoghoogh"];

    applauseSpec = {
      id,
      user_id,
      punishment_type_id,
      punishment_wrongdoins_type,
      citation_cases_id,
      ozviat_type: punishment_subject_ozviat_type,
      punishment_description,
      punishment_date,
      punishment_do_date,
      punishment_count,
      punishment_kasr_hoghoogh,
    };
    const [punishment, fields] = await updatePunishment(applauseSpec);
    return handleSuccess(res, "تشویق با موفقیت ویرایش شد!", punishment, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// find Punishments
router.post("/punishments", async (req, res, next) => {
  try {
    // calculate pagination values
    let { page, pageSize } = req.query;
    let { filterModel, sortModel } = req.body;

    let filterStr = "1=1";
    let sortStr = "punishment_updated_at DESC";

    pageSize = Number(pageSize);
    page = Number(page) * pageSize;

    // prepare filtering string for quick search
    if (filterModel.length > 0) {
      function generateStringFromArray(values) {
        let stringParts = [];
        values.forEach((val) => {
          if (isValidIranianNationalCode(val)) {
            stringParts.push(`punishment_subject_nationality_code = '${val}'`);
          } else if (!!parseInt(val)) {
            stringParts.push(`punishment_subject_parvande_code = ${val}`);
          } else
            stringParts.push(
              `CONCAT(punishment_subject_surname, ' ',  
                punishment_commander_surname, ' ', 
                punishment_recommender_surname, ' ', 
                punishment_description, ' ', 
                pdate(punishment_date), ' ', 
                jst.status_title, ' ', 
                apt.punishments_type_description) LIKE '%${val}%'`,
            );
        });
        return stringParts.join(" AND ");
      }

      filterStr = generateStringFromArray(filterModel);
    }

    // prepare sort options
    if (sortModel?.length > 0) {
      const sortCol = sortModel[0]?.field;
      const sortType = sortModel[0]?.sort?.toUpperCase();

      switch (sortCol) {
        case "parvandeCode":
          sortStr = `CAST(${punishmentsColsMapping[sortCol]} AS UNSIGNED) ${sortType}`;
          break;

        case "nationalCode":
          sortStr = `CAST(${punishmentsColsMapping[sortCol]} AS UNSIGNED) ${sortType}`;
          break;

        default:
          sortStr = `${punishmentsColsMapping[sortCol]} ${sortType}`;
          break;
      }
    }

    const punishmentsData = await findPunishments({
      page,
      pageSize,
      filterStr,
      sortStr,
    });
    const totalRows = punishmentsData.punishmentsTotalRows;
    const punishments = punishmentsData.punishments;

    // Normalize the punishments array
    const normalizedPunishments = normalize(punishments, punishmentListSchema);

    return handleSuccess(
      res,
      "",
      { punishments: normalizedPunishments, rowCount: totalRows },
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get punishment
router.get("/getpunishment/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [punishment, fields] = await findPunishment(id);
    return handleSuccess(res, "", punishment, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// update punishment status
router.put("/update_punishment_status", async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const [updatedStatus, fields] = await updatePunishmentStatus(
      req,
      id,
      status,
    );
    return handleSuccess(res, "", { ...updatedStatus, status: status }, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// delete punishment
router.delete("/delete_punishment/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [deletedPunishment, fields] = await deletePunishment(id);

    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت حذف شد",
      deletedPunishment,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// print punishment
router.get("/printpunishment/:id", async (req, res, next) => {
  const { id } = req.params;
  let punishment_subject = {};
  let commander = {};
  let recommender = {};

  try {
    const [punishment] = await findPunishment(id);

    const punishment_subject_nationality_code =
      punishment[0]["punishment_subject_nationality_code"];
    const commander_nationality_code =
      punishment[0]["punishment_commander_nationality_code"];
    const recommender_nationality_code =
      punishment[0]["punishment_recommender_nationality_code"];

    if (punishment[0]["punishment_subject_ozviat_type"] == 2) {
      // Get Soldier Data

      const soldierAPI = await requestGarrisonAPI(
        `${req.GarrisonBaseUrl}/soldier.php?code=${punishment_subject_nationality_code}`,
        next,
      );

      if (soldierAPI.status == 200) {
        punishment_subject = { ...soldierAPI.data[0] };
      }
    } else {
      const [appl] = await findEmployeeByCode(
        punishment_subject_nationality_code,
      );
      punishment_subject = appl[0] ? appl[0] : {};
    }

    const [comm] = await findEmployeeByCode(commander_nationality_code);
    commander = comm[0] ? comm[0] : {};
    if (recommender_nationality_code) {
      const [recomm] = await findEmployeeByCode(recommender_nationality_code);
      recommender = recomm[0] ? recomm[0] : {};
    }

    // console.log("DATA: ", punishment_subject, commander, recommender);

    const data = {
      rec_name: recommender?.firstname || "",
      rec_surname: recommender?.surname || "",
      rec_p_code: recommender?.pasdari_code || "",
      rec_unit: recommender?.vahed_title || "",
      rec_rank: recommender?.daraje_title || "",
      rec_pos: recommender?.jaygah_title || "",
      rec_resp: recommender?.masoliat || "",
      com_name: commander?.firstname || "",
      com_surname: commander?.surname || "",
      com_p_code: commander?.pasdari_code || "",
      com_unit: commander?.vahed_title || "",
      com_rank: commander?.daraje_title || "",
      com_pos: commander?.jaygah_title || "",
      com_resp: commander?.masoliat || "",
      ap_name: punishment_subject?.firstname || "",
      ap_surname: punishment_subject?.surname || "",
      ap_fathername: punishment_subject?.fathername || "",
      ap_unit: punishment_subject?.vahed_title || "",
      ap_rank: punishment_subject?.daraje_title || "",
      ap_pos: punishment_subject?.jaygah_title || "",
      ap_nationality_code: punishment_subject?.nationalcode || "",
      ap_p_code: punishment_subject?.pasdari_code || "",
      ap_phone: punishment_subject?.phone || "",
      ap_c_job: punishment_subject?.job || "",
      ap_tahsil: punishment_subject?.tahsili_title || "",
      ap_p_job: punishment_subject?.p_job || "",
      ap_p_sanavat: punishment_subject?.p_sanavat || "",
      ap_n_sanavat: punishment_subject?.n_sanavat || "",
      ap_masoliat: punishment_subject?.masoliat || "",
      ap_bazneshastehi: punishment_subject?.bazneshastehi || "",
      ap_jaygah: punishment_subject?.jaygah_title || "",
      ap_city: punishment_subject?.city || "",
      ap_jebhe_moddat: punishment_subject?.jebhe_moddat || "",
      ap_janbazi: punishment_subject?.janbazi || "",
      ap_nomre: punishment_subject?.nomre || "",
      ap_vorud: persianDate(punishment_subject?.ezamDate) || "",
      notorious_services_type:
        punishment[0]?.punishments_wrongdoings_description || "",
      applause_type: punishment[0]?.punishments_type_description || "",
      applause_count: punishment[0]?.punishment_count || "",
      applause_description: punishment[0]?.punishment_description || "",
      citations_description: punishment[0]?.citations_description || "",
    };

    const templateFilePath = path.join(
      __dirname,
      "..",
      "..",
      "docxTemplates",
      "tanbih.docx",
    );
    const template = fs.readFileSync(templateFilePath);

    const buffer = await createReport({
      template,
      data: data,
      cmdDelimiter: ["{", "}"],
    });

    fs.writeFileSync("tanbih.docx", buffer);
    // const [applause, fields] = await findApplause(id);
    const fileName = "tanbih.docx";
    return res.download("tanbih.docx", fileName, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
      }
      // else {
      //   console.log(`File sent: ${fileName}`);
      // }
    });
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

module.exports = router;
