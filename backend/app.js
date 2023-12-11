const express = require("express");
const bodyParser = require("body-parser");
const xlsx = require("xlsx");
const cors = require("cors");
const path = require("path");
const excelJs = require("exceljs");
const pdfDocument = require("pdfkit");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/calculate", (req, res) => {
  const { num1, num2 } = req.body;
  const ws = xlsx.utils.json_to_sheet([
    {
      "Number 1": parseInt(num1),
      "Number 2": parseInt(num2),
      Result: parseInt(num1) + parseInt(num2),
    },
  ]);

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet 1");
  const excelFileName = "result.xlsx";
  xlsx.writeFile(wb, path.join(__dirname, "public", excelFileName));
  res.send({ result: parseInt(num1) + parseInt(num2), excelFileName });
});

app.post("/print", async (req, res) => {
  const excelFileName = req.body.excelFileName;
  const workbook = new excelJs.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, "public", excelFileName));
  const worksheet = workbook.getWorksheet("Sheet 1");
  const pdfFileName = "result.pdf";
  const pdfDoc = new pdfDocument();
  pdfDoc.pipe(fs.createWriteStream(pdfFileName));
  const columnSpacing = 80;
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      pdfDoc
        .fontSize(14)
        .text(cell.value, colNumber * columnSpacing, rowNumber * 30 + 30);
    });
  });
  pdfDoc.end();
  res.send({
    pdfFileName: pdfFileName,
    path: path.join(__dirname, pdfFileName),
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
