/**
perpare data for datagrid component by
assigning proper keys to values
@arrOfObjects [{}, {}, ... {}]
@initialLabelGroup labels of the table columns
@totalStats to calculate percentages
@return [{key: value}] - keys comming from the above object keys
*/
const flattenizer = (arrOfObjects, initialLabelGroup, totalStats) => {
  const flattenedData = [];

  arrOfObjects.forEach((item, idx) => {
    flattenedData.push({
      [item.label]: item.tedad,
    });
  });

  flattenedData.forEach((item, idx) => {
    const obj = Object.entries(item);
    obj.forEach((item, idx) => {
      initialLabelGroup.id = idx + 1;
      initialLabelGroup.total += item[1];
      initialLabelGroup[item[0]] = item[1];
    });
  });

  const total = Object.assign({}, initialLabelGroup);
  total.title = "جمع";

  const percentage = Object.assign({}, initialLabelGroup);
  percentage.title = "درصد";
  percentage.total = "100%";

  totalStats.forEach((item) => {
    percentage[`${item.label}`] = `${parseFloat(
      (total[`${item.label}`] / item.total) * 100,
    ).toFixed(2)}%`;
  });

  const perparedData = [initialLabelGroup, total, percentage];

  perparedData.forEach((item, idx) => {
    item.id = idx + 1;
    item.row = idx + 1;
  });

  return perparedData;
};

module.exports = { flattenizer };
