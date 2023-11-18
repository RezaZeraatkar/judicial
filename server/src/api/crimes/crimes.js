const express = require("express");
const { normalize, schema } = require("normalizr");

const {
  findCrimesTypes,
  findCrimesJudicialAuditReferee,
  createCrime,
  findCrimes,
  updateCrimeStatus,
  deleteCrime,
  findCrime,
  updateCrime,
  findHoghughiOrganizations,
  addHoghughiOrganizations,
  editHoghughiOrganizations,
  deleteHoghughiOrganizations,
  addJudicialAuditReferee,
  editJudicialAuditReferee,
  deleteJudicialAuditReferee,
} = require("../../services/crimes.service");
const isValidIranianNationalCode = require("../../utils/isValidNationalCode");
const { findEmployeeByCode } = require("../../services/employees.service");
const requestGarrisonAPI = require("../../utils/garrisonApi");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");
const { crimesColsMapping } = require("../../vars/columnsMapping");

// Define the schema for the crime object
const crimeSchema = new schema.Entity("crimes");
// Define the schema for the array of crimes
const crimeListSchema = new schema.Array(crimeSchema);

const router = express.Router();

// get Crimes types
router.get("/crimes-types", async (req, res, next) => {
  try {
    const [crimeTypes, fields] = await findCrimesTypes();
    return handleSuccess(res, "", crimeTypes, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get notorious services
router.get("/crimes_judicial_audit_referee", async (req, res, next) => {
  try {
    const [judicialAuditReferee, fields] =
      await findCrimesJudicialAuditReferee();
    return handleSuccess(res, "", judicialAuditReferee, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// create/add crimes
router.post("/add-crime", async (req, res, next) => {
  try {
    let mojrem = {};
    let shaki = {};
    let jormSpec = {};
    let {
      crimes_mojrem_nationality_code,
      crimes_shaki_nationality_code,
      crimes_mojrem_employee_type,
      crimes_shaki_employee_type,
      crimes_shaki_type,
      crimes_shaki_number,
      crimes_mojrem_pasdari_code,
      crimes_shaki_pasdari_code,
    } = req.body;

    // if crimes_mojrem_employee_type = 1 => pasdar employee, else soldier
    if (crimes_mojrem_employee_type == 1) {
      [mojrem] = await findEmployeeByCode(crimes_mojrem_nationality_code);
    } else {
      const soldierAPI = await requestGarrisonAPI(
        `${req.GarrisonBaseUrl}/soldier.php?code=${crimes_mojrem_nationality_code}`,
        next,
      );
      if (soldierAPI.status == 200) {
        mojrem = soldierAPI.data;
        // else mojrem/shaki is a soldier, send a request to garrison api and get the soldier record
      } else {
        return next(
          new HandleError(
            "خطا در دسترسی به سامانه سربازان (garrison)",
            [],
            500,
          ),
        );
      }
    }
    // if crimes_shaki_employee_type = 1 => pasdar employee, else soldier
    if (crimes_shaki_employee_type == 1 && crimes_shaki_type == 1) {
      [shaki] = await findEmployeeByCode(crimes_shaki_nationality_code);
    } else if (crimes_shaki_employee_type == 2 && crimes_shaki_type == 1) {
      const soldierAPI = await requestGarrisonAPI(
        `${req.GarrisonBaseUrl}/soldier.php?code=${crimes_shaki_nationality_code}`,
        next,
      );
      if (soldierAPI.status == 200) {
        shaki = soldierAPI.data;
        // else mojrem/shaki is a soldier, send a request to garrison api and get the soldier record
      } else {
        return next(
          new HandleError(
            "خطا در دسترسی به سامانه سربازان (garrison)",
            [],
            500,
          ),
        );
      }
    }

    const user_id = Number(req.session.userdata.id);
    const crime_type_id = req.body["crimes_crime_type"].id;
    const crimes_hokm_date = req.body["crimes_hokm_date"];
    const crimes_crime_date = req.body["crimes_crime_date"];
    const crimes_issued_hokm = req.body["crimes_issued_hokm"];
    const crimes_jorm_describtion = req.body["crimes_jorm_describtion"];
    const crimes_jorm_notify_date = req.body["crimes_jorm_notify_date"];
    const crimes_jorm_occurance_date = req.body["crimes_jorm_occurance_date"];
    const crimes_judicial_audit_reference_id =
      req.body["crimes_judicial_audit_reference"].id;
    const crimes_mojazat_amount = req.body["crimes_mojazat_amount"];
    const crimes_shaki_hoghughi_id = req.body["crimes_shaki_hoghughi"].id;

    jormSpec = {
      user_id,
      crime_type_id,
      crimes_crime_date,
      crimes_hokm_date,
      crimes_issued_hokm,
      crimes_jorm_notify_date,
      crimes_jorm_occurance_date,
      crimes_jorm_describtion,
      crimes_mojrem_employee_type,
      crimes_shaki_employee_type,
      crimes_judicial_audit_reference_id,
      crimes_mojazat_amount,
      crimes_shaki_number,
      crimes_shaki_type,
      crimes_mojrem_pasdari_code,
      crimes_shaki_pasdari_code,
      crimes_shaki_hoghughi_id:
        crimes_shaki_type == 1 ? "" : crimes_shaki_hoghughi_id, // crimes_shaki_type = 1 => حقیقی else حقوقی
    };

    const [crime, fields] = await createCrime(mojrem[0], shaki[0], jormSpec);
    return handleSuccess(res, "جرم با موفقیت ثبت شد!", crime, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// edit Crime
router.patch("/edit_crime", async (req, res, next) => {
  try {
    let jormSpec = {};
    let {
      id,
      crimes_mojrem_employee_type,
      crimes_shaki_employee_type,
      crimes_shaki_type,
      crimes_shaki_number,
    } = req.body;

    const user_id = Number(req.session.userdata.id);
    const crime_type_id = req.body["crimes_crime_type"].id;
    const crimes_hokm_date = req.body["crimes_hokm_date"];
    const crimes_crime_date = req.body["crimes_crime_date"];
    const crimes_issued_hokm = req.body["crimes_issued_hokm"];
    const crimes_jorm_describtion = req.body["crimes_jorm_describtion"];
    const crimes_jorm_notify_date = req.body["crimes_jorm_notify_date"];
    const crimes_jorm_occurance_date = req.body["crimes_jorm_occurance_date"];
    const crimes_judicial_audit_reference_id =
      req.body["crimes_judicial_audit_reference"].id;
    const crimes_mojazat_amount = req.body["crimes_mojazat_amount"];
    const crimes_shaki_hoghughi_id = req.body["crimes_shaki_hoghughi"].id;

    jormSpec = {
      id,
      user_id,
      crime_type_id,
      crimes_crime_date,
      crimes_hokm_date,
      crimes_issued_hokm,
      crimes_jorm_notify_date,
      crimes_jorm_occurance_date,
      crimes_jorm_describtion,
      crimes_mojrem_employee_type,
      crimes_shaki_employee_type,
      crimes_judicial_audit_reference_id,
      crimes_mojazat_amount,
      crimes_shaki_number,
      crimes_shaki_type,
      crimes_shaki_hoghughi_id:
        crimes_shaki_type == 1 ? "" : crimes_shaki_hoghughi_id, // crimes_shaki_type = 1 => حقیقی else حقوقی
    };
    const [crime, fields] = await updateCrime(jormSpec);
    return handleSuccess(res, "تشویق با موفقیت ویرایش شد!", crime, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get Crimes
router.post("/crimes", async (req, res, next) => {
  try {
    let { page, pageSize } = req.query;
    let { filterModel, sortModel } = req.body;

    let filterStr = "1=1";
    let sortStr = "jc.crimes_updated_at DESC";

    pageSize = Number(pageSize);
    page = Number(page) * pageSize;

    if (filterModel.length > 0) {
      function generateStringFromArray(values) {
        let stringParts = [];
        values.forEach((val) => {
          if (isValidIranianNationalCode(val)) {
            stringParts.push(`jc.crimes_mojrem_nationality_code = '${val}'`);
          } else if (!!parseInt(val)) {
            stringParts.push(`jc.crimes_mojrem_parvande_code = ${val}`);
          } else
            stringParts.push(
              `CONCAT(jc.crimes_mojrem_surname, ' ',  
                jc.crimes_shaki_number, ' ', 
                jc.crimes_shaki_surname, ' ', 
                jst.status_title, ' ', 
                pdate(jc.crimes_jorm_occurance_date), ' ', 
                jc.crimes_issued_hokm, ' ', 
                jct.crimes_type_title) LIKE '%${val}%'`,
            );
        });
        return stringParts.join(" AND ");
      }

      filterStr = generateStringFromArray(filterModel);
    }

    if (sortModel?.length > 0) {
      const sortCol = sortModel[0]?.field;
      const sortType = sortModel[0]?.sort?.toUpperCase();

      switch (sortCol) {
        case "parvandeCode":
          sortStr = `CAST(${crimesColsMapping[sortCol]} AS UNSIGNED) ${sortType}`;
          break;

        case "nationalCode":
          sortStr = `CAST(${crimesColsMapping[sortCol]} AS UNSIGNED) ${sortType}`;
          break;

        default:
          sortStr = `${crimesColsMapping[sortCol]} ${sortType}`;
          break;
      }
    }

    const crimesData = await findCrimes({
      page,
      pageSize,
      filterStr,
      sortStr,
    });
    const totalRows = crimesData.crimesTotalRows;
    const crimes = crimesData.crimes;

    // Normalize the crimes array
    const normalizedCrimes = normalize(crimes, crimeListSchema);

    return handleSuccess(
      res,
      "",
      { crimes: normalizedCrimes, rowCount: totalRows },
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get Crime
router.get("/getcrime/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [crime, fields] = await findCrime(id);
    return handleSuccess(res, "", crime, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// update Crime status
router.put("/update_crime_status", async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const [updatedStatus, fields] = await updateCrimeStatus(req, id, status);
    return handleSuccess(res, "", { ...updatedStatus, status: status }, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// delete Crime
router.delete("/delete_Crime/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [deletedCrime, fields] = await deleteCrime(id);

    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت حذف شد",
      deletedCrime,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get hoghughi organizations
router.get("/hoghughi-organizations", async (req, res, next) => {
  try {
    const [hoghughiOrganizations, fields] = await findHoghughiOrganizations();
    return handleSuccess(res, "", hoghughiOrganizations, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// add hoghoughi organizations
router.post("/add-hoghoughi", async (req, res, next) => {
  try {
    const [hoghughiOrganizations, fields] = await addHoghughiOrganizations(
      req.body,
    );
    return handleSuccess(
      res,
      "رکورد مورد نظر شما با موفقیت افزوده شد!",
      hoghughiOrganizations,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// update hoghoughi organizations
router.put("/edit-hoghoughi", async (req, res, next) => {
  try {
    const [hoghughiOrganizations, fields] = await editHoghughiOrganizations(
      req.body,
    );
    return handleSuccess(
      res,
      "ویرایش با موفقیت انجام شد!",
      hoghughiOrganizations,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// delete hoghoughi organizations
router.delete("/delete-hoghoughi/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [hoghughiOrganization, fields] = await deleteHoghughiOrganizations(
      id,
    );
    return handleSuccess(
      res,
      "رکورد موردنظر شما حذف شد!",
      hoghughiOrganization,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// add judicial audit Referee
router.post("/add-judicial-auditRef", async (req, res, next) => {
  try {
    const [judAuditRefree, fields] = await addJudicialAuditReferee(req.body);
    return handleSuccess(
      res,
      "رکورد مورد نظر شما با موفقیت افزوده شد!",
      judAuditRefree,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// update judicial audit Referee
router.put("/edit-judicial-audit-ref", async (req, res, next) => {
  try {
    const [judicialAuditReferee, fields] = await editJudicialAuditReferee(
      req.body,
    );
    return handleSuccess(
      res,
      "ویرایش با موفقیت انجام شد!",
      judicialAuditReferee,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// delete judicial audit Referee
router.delete("/delete-judicial-auditRef/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [judicialAuditReferee, fields] = await deleteJudicialAuditReferee(id);
    return handleSuccess(
      res,
      "رکورد موردنظر شما حذف شد!",
      judicialAuditReferee,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

module.exports = router;
