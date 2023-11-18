const express = require("express");
const { normalize, schema } = require("normalizr");

const {
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
} = require("../../services/remarks.service");
const isValidIranianNationalCode = require("../../utils/isValidNationalCode");
const { findEmployeeByCode } = require("../../services/employees.service");
const requestGarrisonAPI = require("../../utils/garrisonApi");
const handleSuccess = require("../../utils/handleSuccess");
const HandleError = require("../../utils/handleError");
const { remarksColsMapping } = require("../../vars/columnsMapping");

const router = express.Router();

// Define the schema for the applause object
const remarkSchema = new schema.Entity("remarks");
// Define the schema for the array of applauses
const remarkListSchema = new schema.Array(remarkSchema);

// get notorious services
router.get("/remark-wrongdoings", async (req, res, next) => {
  try {
    const [notoriousServices, fields] = await findRemarksWrongdoing();
    return handleSuccess(res, "", notoriousServices, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// get remark disciplinary citations
router.get("/remark-disciplinary-citations", async (req, res, next) => {
  try {
    const [disciplinaryCitations, fields] = await findDisciplinaryCitations();
    return handleSuccess(res, "", disciplinaryCitations, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// create/add remarks
router.post("/add-remarks", async (req, res, next) => {
  try {
    let recommender = {};
    let commander = {};
    let applauser = {};
    let applauseSpec = {};
    let {
      remark_recommender_nationality_code,
      remark_commander_nationality_code,
      remark_subject_nationality_code,
      remark_subject_ozviat_type,
    } = req.body;

    // if remark_subject_ozviat_type = 1 => pasdar employee, else soldier
    [recommender] = await findEmployeeByCode(
      remark_recommender_nationality_code,
    );
    [commander] = await findEmployeeByCode(remark_commander_nationality_code);
    if (remark_subject_ozviat_type == 1) {
      [applauser] = await findEmployeeByCode(remark_subject_nationality_code);
    } else {
      const soldierAPI = await requestGarrisonAPI(
        `${req.GarrisonBaseUrl}/soldier.php?code=${remark_subject_nationality_code}`,
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
    }

    const user_id = Number(req.session.userdata.id);
    const remark_type_id = req.body["remark_type"].id;
    const remark_wrongdoins_type = req.body["remark_wrongdoins_type"].id;
    const citation_cases_id = req.body["remark_citation_cases"].id;
    const remark_description = req.body["remark_description"];
    const remark_date = req.body["remark_date"];
    const remark_do_date = req.body["remark_do_date"];

    applauseSpec = {
      user_id,
      remark_type_id,
      remark_wrongdoins_type,
      citation_cases_id,
      ozviat_type: remark_subject_ozviat_type,
      remark_description,
      remark_date,
      remark_do_date,
    };
    const [remark, fields] = await createRemarks(
      recommender[0],
      commander[0],
      applauser[0],
      applauseSpec,
    );
    return handleSuccess(res, "تشویق با موفقیت ثبت شد!", remark, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// edit remark
router.patch("/edit-remark", async (req, res, next) => {
  try {
    let applauseSpec = {};
    let { id, remark_subject_ozviat_type } = req.body;

    const user_id = Number(req.session.userdata.id);
    const remark_type_id = req.body["remark_type"].id;
    const remark_wrongdoins_type = req.body["remark_wrongdoins_type"].id;
    const citation_cases_id = req.body["remark_citation_cases"].id;
    const remark_description = req.body["remark_description"];
    const remark_date = req.body["remark_date"];
    const remark_do_date = req.body["remark_do_date"];

    applauseSpec = {
      id,
      user_id,
      remark_type_id,
      remark_wrongdoins_type,
      citation_cases_id,
      ozviat_type: remark_subject_ozviat_type,
      remark_description,
      remark_date,
      remark_do_date,
    };
    const [remark, fields] = await updateRemark(applauseSpec);
    return handleSuccess(res, "تشویق با موفقیت ویرایش شد!", remark, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

router.post("/remarks", async (req, res, next) => {
  try {
    let { page, pageSize } = req.query;
    let { filterModel, sortModel } = req.body;

    let filterStr = "1=1";
    let sortStr = "rmk.remark_updated_at DESC";

    pageSize = Number(pageSize);
    page = Number(page) * pageSize;

    if (filterModel?.length > 0) {
      function generateStringFromArray(values) {
        let stringParts = [];
        values.forEach((val) => {
          if (isValidIranianNationalCode(val)) {
            stringParts.push(`rmk.remark_subject_nationality_code = '${val}'`);
          } else if (!!parseInt(val)) {
            stringParts.push(`rmk.remark_subject_parvande_code = ${val}`);
          } else
            stringParts.push(
              `CONCAT(rmk.remark_subject_surname, ' ',  
          rmk.remark_commander_surname, ' ', 
          rmk.remark_recommender_surname, ' ', 
          rmk.remark_description, ' ', 
          pdate(rmk.remark_date), ' ', 
          jst.status_title, ' ', 
          rmt.remark_type_title) LIKE '%${val}%'`,
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
          sortStr = `CAST(${remarksColsMapping[sortCol]} AS UNSIGNED) ${sortType}`;
          break;

        case "nationalCode":
          sortStr = `CAST(${remarksColsMapping[sortCol]} AS UNSIGNED) ${sortType}`;
          break;

        default:
          sortStr = `${remarksColsMapping[sortCol]} ${sortType}`;
          break;
      }
    }

    const remarksData = await findRemarks({
      page,
      pageSize,
      filterStr,
      sortStr,
    });
    const totalRows = remarksData.remarksTotalRows;
    const remarks = remarksData.remarks;

    // Normalize the remarks array
    const normalizedRemarks = normalize(remarks, remarkListSchema);

    return handleSuccess(
      res,
      "",
      { remarks: normalizedRemarks, rowCount: totalRows },
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get remark
router.get("/get-remark/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [remark, fields] = await findRemark(id);
    return handleSuccess(res, "", remark, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// update remark status
router.put("/update-remark-status", async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const [updatedStatus, fields] = await updateRemarkStatus(req, id, status);
    return handleSuccess(res, "", { ...updatedStatus, status: status }, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// delete remark
router.delete("/delete-remark/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [deletedremark, fields] = await deleteRemark(id);

    return handleSuccess(
      res,
      "رکورد موردنظر شما با موفقیت حذف شد",
      deletedremark,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// add remarks types
router.post("/add-remarks-type", async (req, res, next) => {
  try {
    const [remark_type, fields] = await addRemarkType(req.body);
    return handleSuccess(
      res,
      "رکورد مورد نظر شما با موفقیت افزوده شد!",
      remark_type,
      200,
    );
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// get remarks types
router.get("/remarks-types", async (req, res, next) => {
  try {
    const [remarkTypes, fields] = await findRemarksTypes();
    return handleSuccess(res, "", remarkTypes, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError("خطا در اجرای دستورات پایگاه داده", [], 500));
  }
});

// update remarks types
router.put("/edit-remarks-type", async (req, res, next) => {
  try {
    const [remarkType, fields] = await editRemarkType(req.body);
    return handleSuccess(res, "ویرایش با موفقیت انجام شد!", remarkType, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

// delete remark type
router.delete("/delete-remarks-type/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [remarkType, fields] = await deleteRemarkType(id);
    return handleSuccess(res, "رکورد موردنظر شما حذف شد!", remarkType, 200);
  } catch (error) {
    console.error(error);
    return next(new HandleError(null, [], 500, error));
  }
});

module.exports = router;
