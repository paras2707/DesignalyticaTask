import { useState } from "react";

const Form = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState("");
  const [excelFileName, setExcelFileName] = useState("");
  const [pdfPath, setPdfPath] = useState("");

  const handleCalculate = async () => {
    const response = await fetch("http://localhost:3000/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `num1=${num1}&num2=${num2}`,
    });

    const data = await response.json();
    // console.log(data);
    setResult(`Result: ${data.result}`);
    setExcelFileName(data.excelFileName);
  };

  const handlePrint = async () => {
    if (!excelFileName) {
      alert("Please calculate first.");
      return;
    }

    const response = await fetch("http://localhost:3000/print", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `excelFileName=${excelFileName}`,
    });

    const data = await response.json();
    console.log(data);
    setPdfPath(data.path);
  };

  return (
    <div>
      <form>
        <div>
          <label htmlFor="num1">Number 1:</label>
          <input
            type="number"
            id="num1"
            name="num1"
            onChange={(e) => setNum1(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="num2">Number 2:</label>
          <input
            type="number"
            id="num2"
            name="num2"
            onChange={(e) => setNum2(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={handleCalculate}>
          Calculate
        </button>
        <button type="button" onClick={handlePrint}>
          Print
        </button>
      </form>
      <p>{result}</p>
      {pdfPath && (
        <div>
          <i>
            To view in the browser install &quot;Enable Local file links&quot;
            chrome extension or you can go to your local folder and open the pdf
            file.
          </i>
          <br />
          <a href={`file://${pdfPath}`} target="_parent">
            Download Pdf
          </a>
        </div>
      )}
    </div>
  );
};

export default Form;
