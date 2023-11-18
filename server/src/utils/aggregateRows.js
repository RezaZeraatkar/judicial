/**
perpare data for datagrid component by
assigning proper keys to values
@arrOfObjects [{}, {}, ... {}]
@initialLabelGroup labels of the table columns
@totalStats to calculate percentages
@return [{key: value}] - keys comming from the above object keys
*/

const aggregateRows = (arrOfObjects, initialLabelGroup, totalStats) => {
  let newRows = arrOfObjects[0].map((report, idx) => {
    const newObj = { row: idx + 1, id: idx + 1, ...report };
    return { ...initialLabelGroup, ...newObj };
  });

  if (newRows.length === 0) {
    newRows = [{ ...initialLabelGroup, id: 1, row: 1 }];
  }

  const percentage = Object.assign({}, initialLabelGroup);

  totalStats.forEach((item) => {
    percentage[`${item.label}`] = `${parseFloat(
      newRows[newRows.length - 1][`${item.label}`] == 0
        ? 0
        : (newRows[newRows.length - 1][`${item.label}`] / item.total) * 100,
    ).toFixed(2)}%`;
  });

  const rows = [
    ...newRows,
    {
      ...{
        id: newRows.length + 1,
        title: "درصد",
        total: "100%",
      },
      ...percentage,
    },
  ];
  return rows;
};

module.exports = { aggregateRows };
