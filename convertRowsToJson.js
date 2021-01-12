module.exports = (rows) => {
    const headerRow = rows.shift();
    jsonArray = [];
    rows.forEach((rowArray) => {
        const rowObject = {};
        // console.log(rowArray, '<--------------------rowArray')
        rowArray.forEach((rowElement, index) => {
            rowObject[headerRow[index]] = rowElement;
        })
        jsonArray.push(rowObject);
    });
    return jsonArray;
}