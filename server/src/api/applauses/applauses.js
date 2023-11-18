const express = require("express");
const path = require("path");
const fs = require("fs");
const { createReport } = require("docx-templates");
const { normalize, schema } = require("normalizr");

const isValidIranianNationalCode = require("../../utils/isValidNationalCode");
const {
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
} = require("../../services/applauses.service");
const { findEmployeeByCode } = require("../../services/employees.service");
const requestGarrisonAPI = require("../../utils/garrisonApi");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");
const { persianDate } = require("../../utils/persianDate");
const { applausesColsMapping } = require("../../vars/columnsMapping");

// Define the schema for the applause object
const applauseSchema = new schema.Entity("applauses");
// Define the schema for the array of applauses
const applauseListSchema = new schema.Array(applauseSchema);

const router = express.Router();

// create applauses types
router.post("/create-applause-types", async (req, res, next) => {
  try {
    const [applauseTypes, fields] = await createApplausesTypes(req.body);

    return handleSuccess(
      res,
      "رکورد جدید با موفقیت ثبت شد!",
      applauseTypes,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// read applauses types
router.get("/applause-types", async (req, res, next) => {
  try {
    const [applauseTypes, fields] = await findApplausesTypes();
    return handleSuccess(res, "", applauseTypes, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// update applauses types
router.put("/update-applause-types", async (req, res, next) => {
  try {
    const [applauseTypes, fields] = await updateApplausesTypes(req.body);
    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت ویرایش شد!",
      applauseTypes,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// delete applauses types
router.delete("/delete-applause-types/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [applauseTypes, fields] = await deleteApplausesTypes(id);
    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت حذف شد",
      applauseTypes,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// save notorious services
router.post("/notorious-services", async (req, res, next) => {
  try {
    const [notoriousServices, fields] = await createNotoriousServices(req.body);
    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت ذخیره شد",
      notoriousServices,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get notorious services
router.get("/notorious-services", async (req, res, next) => {
  try {
    const [notoriousServices, fields] = await findNotoriousServices();
    return handleSuccess(res, "", notoriousServices, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// update notorious services
router.put("/notorious-services", async (req, res, next) => {
  try {
    const [notoriousServices, fields] = await updateNotoriousServices(req.body);
    return handleSuccess(
      res,
      "ویرایش با موفقیت انجام شد!",
      notoriousServices,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// delete notorious services
router.delete("/notorious-services", async (req, res, next) => {
  try {
    const [notoriousServices, fields] = await deleteNotoriousServices(req.body);
    return handleSuccess(
      res,
      "حدف رکورد موفقیت‌آمیز بود",
      notoriousServices,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// Get Disciplinary Citations
router.get("/disciplinary-citations", async (req, res, next) => {
  try {
    const [disciplinaryCitations, fields] = await findDisciplinaryCitations();
    return handleSuccess(res, "", disciplinaryCitations, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// create applauses
router.post("/add-applauses", async (req, res, next) => {
  try {
    let recommender = {};
    let commander = {};
    let applauser = {};
    let applauseSpec = {};
    let {
      recommender_nationality_code,
      commander_nationality_code,
      applauser_nationality_code,
      applauser_pasdari_code,
      applauser_ozviat_type,
    } = req.body;

    if (recommender_nationality_code) {
      [recommender] = await findEmployeeByCode(recommender_nationality_code);
    }
    if (!commander_nationality_code) {
      return next(
        new HandleError("مقام دستوردهنده را انتخاب نکرده‌اید!", [], 401),
      );
    }
    [commander] = await findEmployeeByCode(commander_nationality_code);
    // if applauser_ozviat_type = 1 => pasdar employee, else soldier
    if (applauser_ozviat_type == 1) {
      [applauser] = await findEmployeeByCode(applauser_nationality_code);
    } else if (applauser_ozviat_type == 2) {
      const soldierAPI = await requestGarrisonAPI(
        `${req.GarrisonBaseUrl}/soldier.php?code=${applauser_nationality_code}`,
        next,
      );
      if (soldierAPI.status == 200) {
        applauser = soldierAPI.data;
        // else applauser is a soldier, send a request to garrison api and get the soldier record
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
      return next(new HandleError("تشویق‌شونده را انتخاب نکرده‌اید!", [], 500));
    }

    const user_id = Number(req.session.userdata.id);
    const applause_type_id = req.body["applause_type"].id;
    const notorious_services_type_id = req.body["notorious_services_type"].id;
    const citation_cases_id = req.body["citation_cases"].id;
    const applause_description = req.body["applause_description"];
    const applause_date = req.body["applause_date"];
    const applause_count = req.body["applause_count"];
    const applause_padash = req.body["applause_padash"];

    applauseSpec = {
      user_id,
      applause_type_id,
      notorious_services_type_id,
      citation_cases_id,
      ozviat_type: applauser_ozviat_type || applauser[0].ozviyat_type,
      applause_description,
      applause_date,
      applause_count,
      applause_padash,
      applauser_pasdari_code,
    };

    const [applause, fields] = await createApplauses(
      recommender[0],
      commander[0],
      applauser[0],
      applauseSpec,
    );
    return handleSuccess(res, "تشویق با موفقیت ثبت شد!", applause, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// edit applause
router.patch("/edit_applause", async (req, res, next) => {
  try {
    let applauseSpec = {};

    const { id } = req.body;
    const user_id = Number(req.session.userdata.id);
    const applause_type_id = req.body["applause_type"].id;
    const notorious_services_type_id = req.body["notorious_services_type"].id;
    const citation_cases_id = req.body["citation_cases"].id;
    const applause_description = req.body["applause_description"];
    const applause_date = req.body["applause_date"];
    const applause_count = req.body["applause_count"];
    const applause_padash = req.body["applause_padash"];

    applauseSpec = {
      id,
      user_id,
      applause_type_id,
      notorious_services_type_id,
      citation_cases_id,
      applause_description,
      applause_date,
      applause_count,
      applause_padash,
    };

    const [applause, fields] = await updateApplause(applauseSpec);
    return handleSuccess(res, "تشویق با موفقیت ویرایش شد!", applause, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get applauses
router.post("/applauses", async (req, res, next) => {
  try {
    // calcualte pagination values
    let { page, pageSize } = req.query;
    let { filterModel, sortModel } = req.body;

    let filterStr = "1=1";
    let sortStr = "apl.updated_at DESC";

    pageSize = Number(pageSize);
    page = Number(page) * pageSize;

    // prepare filtering string for quick search
    if (filterModel.length > 0) {
      function generateStringFromArray(values) {
        let stringParts = [];
        values.forEach((val) => {
          if (isValidIranianNationalCode(val)) {
            stringParts.push(`apl.applauser_nationality_code = '${val}'`);
          } else if (!!parseInt(val)) {
            stringParts.push(`apl.applauser_parvande_code = ${val}`);
          } else
            stringParts.push(
              `CONCAT(apl.applauser_surname, ' ',  
              apl.commander_surname, ' ', 
              apl.recommender_surname, ' ', 
              apl.applause_description, ' ', 
              pdate(apl.applause_date), ' ', 
              jst.status_title, ' ', 
              apt.applause_type_description) LIKE '%${val}%'`,
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
          sortStr = `CAST(${applausesColsMapping[sortCol]} AS UNSIGNED) ${sortType}`;
          break;

        case "nationalCode":
          sortStr = `CAST(${applausesColsMapping[sortCol]} AS UNSIGNED) ${sortType}`;
          break;

        default:
          sortStr = `${applausesColsMapping[sortCol]} ${sortType}`;
          break;
      }
    }

    const applausesData = await findApplauses({
      page,
      pageSize,
      filterStr,
      sortStr,
    });
    const totalRows = applausesData.applausesTotalRows;
    const applauses = applausesData.applauses;

    // Normalize the applauses array
    const normalizedApplauses = normalize(applauses, applauseListSchema);

    return handleSuccess(
      res,
      "",
      { appaluses: normalizedApplauses, rowCount: totalRows },
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get applause
router.get("/getapplause/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [applause, fields] = await findApplause(id);
    return handleSuccess(res, "", applause, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// update applause status
router.put("/update_applause_status", async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const [applauses, fields] = await updateApplauseStatus(req, id, status);

    return handleSuccess(res, "", applauses, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// delete applause
router.delete("/delete_applause/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [applauses, fields] = await deleteApplause(id);

    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت حذف شد",
      applauses,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// print applause
router.get("/printapplause/:id", async (req, res, next) => {
  const { id } = req.params;
  let applauser = {};
  let commander = {};
  let recommender = {};

  try {
    const [applause] = await findApplause(id);
    const applauser_nationality_code =
      applause[0]["applauser_nationality_code"];
    const commander_nationality_code =
      applause[0]["commander_nationality_code"];
    const recommender_nationality_code =
      applause[0]["recommender_nationality_code"];

    if (applause[0]["applauser_ozviat_type"] == 2) {
      // Get Soldier Data
      const soldierAPI = await requestGarrisonAPI(
        `${req.GarrisonBaseUrl}/soldier.php?code=${applauser_nationality_code}`,
        next,
      );

      if (soldierAPI.status == 200) {
        applauser = { ...soldierAPI.data[0] };
      }
    } else {
      const [appl] = await findEmployeeByCode(applauser_nationality_code);
      applauser = appl[0] ? appl[0] : {};
    }

    const [comm] = await findEmployeeByCode(commander_nationality_code);
    commander = comm[0] ? comm[0] : {};
    if (recommender_nationality_code) {
      const [recomm] = await findEmployeeByCode(recommender_nationality_code);
      recommender = recomm[0] ? recomm[0] : {};
    }

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
      ap_code: applauser?.code || "",
      ap_name: applauser?.firstname || "",
      ap_surname: applauser?.surname || "",
      ap_fathername: applauser?.fathername || "",
      ap_unit: applauser?.vahed_title || "",
      ap_rank: applauser?.daraje_title || "",
      ap_pos: applauser?.jaygah_title || "",
      ap_nationality_code: applauser?.nationalcode || "",
      ap_p_code: applauser?.pasdari_code || "",
      ap_phone: applauser?.phone || "",
      ap_c_job: applauser?.job || "",
      ap_vorud: persianDate(applauser?.ezamDate) || "",
      ap_tahsil: applauser?.tahsili_title || "",
      ap_p_job: applauser?.p_job || "",
      ap_p_sanavat: applauser?.p_sanavat || "",
      ap_n_sanavat: applauser?.n_sanavat || "",
      ap_masoliat: applauser?.masoliat || "",
      ap_bazneshastehi: applauser?.bazneshastehi || "",
      ap_jaygah: applauser?.jaygah_title || "",
      ap_city: applauser?.city || "",
      ap_jebhe_moddat: applauser?.jebhe_moddat || "",
      ap_janbazi: applauser?.janbazi || "",
      ap_nomre: applauser?.nomre || "",
      notorious_services_type:
        applause[0]?.notorious_services_description || "",
      applause_type: applause[0]?.applause_type_description || "",
      applause_count: applause[0]?.applause_count || "",
      applause_description: applause[0]?.applause_description || "",
      citations_description: applause[0]?.citations_description || "",
    };

    const templateFilePath = path.join(
      __dirname,
      "..",
      "..",
      "docxTemplates",
      "tashvighi.docx",
    );
    const template = fs.readFileSync(templateFilePath);

    const buffer = await createReport({
      template,
      data: data,
      cmdDelimiter: ["{", "}"],
    });

    fs.writeFileSync("tashvighi.docx", buffer);
    // const [applause, fields] = await findApplause(id);
    const fileName = "tashvighi.docx";
    return res.download("tashvighi.docx", fileName, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
      }
      // else {
      //   console.log(`File sent: ${fileName}`);
      // }
    });
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

module.exports = router;
