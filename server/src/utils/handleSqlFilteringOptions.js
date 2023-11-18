const pool = require("../services/database/db");
const moment = require("jalali-moment");

const convertFiltersToSQL = ({
  report_type,
  report_date_range,
  from_date,
  to_date,
  notorious_services_type,
  applause_type,
  punishment_wrongdoins_type,
  punishment_type,
  crimes_crime_type,
  crimes_judicial_audit_reference,
  remark_wrongdoins_type,
  remark_type,
  is_valid,
  filters,
}) => {
  let convertedFilters = {};
  let query = `1 = 1`;

  if (report_type == 1) {
    const notoriousServicesTypeIds = notorious_services_type
      ?.map((item) => item.id)
      .join(", ");
    const applauseTypeIds = applause_type?.map((item) => item.id).join(", ");

    if (notoriousServicesTypeIds?.length) {
      query += ` AND notorious_services_type_id IN(${notoriousServicesTypeIds})`;
    }
    if (applauseTypeIds?.length) {
      query += `  AND applause_type_id IN(${applauseTypeIds})`;
    }
  }

  if (report_type == 2) {
    const punishmentsWrongdoinsTypeIds = punishment_wrongdoins_type
      ?.map((item) => item.id)
      .join(", ");
    const punishmentsTypeIds = punishment_type
      ?.map((item) => item.id)
      .join(", ");

    if (punishmentsWrongdoinsTypeIds?.length) {
      query += ` AND punishment_wrongdoins_type_id IN(${punishmentsWrongdoinsTypeIds})`;
    }
    if (punishmentsTypeIds?.length) {
      query += `  AND punishment_type_id IN(${punishmentsTypeIds})`;
    }
  }

  if (report_type == 3) {
    const crimesJudicialAuditReferenceIds = crimes_judicial_audit_reference
      ?.map((item) => item.id)
      .join(", ");
    const crimesCrimeTypeIds = crimes_crime_type
      ?.map((item) => item.id)
      .join(", ");

    if (crimesJudicialAuditReferenceIds?.length) {
      query += ` AND crime_auditRef_id IN(${crimesJudicialAuditReferenceIds})`;
    }
    if (crimesCrimeTypeIds?.length) {
      query += `  AND crime_type_id IN(${crimesCrimeTypeIds})`;
    }
  }

  if (report_type == 4) {
    const remarksWrongdoinsTypeIds = remark_wrongdoins_type
      ?.map((item) => item.id)
      .join(", ");
    const remarksTypeIds = remark_type?.map((item) => item.id).join(", ");

    if (remarksWrongdoinsTypeIds?.length) {
      query += ` AND remark_wrongdoins_type_id IN(${remarksWrongdoinsTypeIds})`;
    }
    if (remarksTypeIds?.length) {
      query += `  AND remark_type_id IN(${remarksTypeIds})`;
    }
  }

  for (const key in filters) {
    const [filterType, filterValue] = key.split("-");

    if (!convertedFilters[filterType]) {
      convertedFilters[filterType] = [];
    }

    if (filters[key]) {
      convertedFilters[filterType].push(parseInt(filterValue));
    }
  }

  const sqlConditions = Object.entries(convertedFilters).map(
    ([filterType, filterValues]) => {
      const escapedValues = filterValues.map((value) => pool.escape(value));
      if (escapedValues.length)
        return `${filterType} IN (${escapedValues.join(",")})`;
      else return " 1 = 1 ";
    },
  );

  const filteringConditions = sqlConditions.join(" AND ");

  // report date range = 1 => براساس تاریخ ثبت
  // report date range = 2 => براساس تاریخ وقوع
  let dateFilter = "1 = 1";
  const is_from_date_type_date = moment(new Date(from_date)).isValid();
  const is_to_date_type_date = moment(new Date(to_date)).isValid();
  if (report_date_range && report_date_range == 2) {
    if (is_from_date_type_date && is_to_date_type_date) {
      dateFilter += ` AND DATE(do_date) BETWEEN "${from_date}" AND "${to_date}"`;
    } else if (is_from_date_type_date && !is_to_date_type_date) {
      dateFilter += ` AND DATE(do_date) >= "${from_date}"`;
    } else if (!is_from_date_type_date && is_to_date_type_date) {
      dateFilter += ` AND DATE(do_date) <= "${to_date}"`;
    }
  } else if (report_date_range && report_date_range == 1) {
    if (is_from_date_type_date && is_to_date_type_date) {
      dateFilter += ` AND DATE(created_date) BETWEEN "${from_date}" AND "${to_date}"`;
    } else if (is_from_date_type_date && !is_to_date_type_date) {
      dateFilter += ` AND DATE(created_date) >= "${from_date}"`;
    } else if (!is_from_date_type_date && is_to_date_type_date) {
      dateFilter += ` AND DATE(created_date) <= "${to_date}"`;
    }
  }

  let filter = `${dateFilter} AND ${
    filteringConditions ? filteringConditions : "1 = 1"
  } AND ${query}`;

  if (is_valid) {
    filter += ` AND is_valid = ${is_valid}`;
  }
  // console.log("filter: ", filter);

  return filter;
};

module.exports = convertFiltersToSQL;
