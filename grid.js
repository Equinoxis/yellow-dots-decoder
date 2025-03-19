const rows = 8;
const cols = 15;
const grid = document.getElementById("grid");
let checkboxes = Array.from({ length: rows }, () => []);

function tableGridInit() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("change", decodePattern);
      grid.appendChild(checkbox);
      checkboxes[i][j] = checkbox;
    }
  }
}

function getColumnValues() {
  return Array.from({ length: cols }, (_, colIndex) =>
    checkboxes.map((row) => (row[colIndex].checked ? 1 : 0))
  );
}

function decodePattern() {
  const columns = getColumnValues();
  const mappings = {
    10: "sn",
    11: "sn",
    12: "sn",
    13: "sn",
    7: "yyyy",
    6: "MM",
    5: "dd",
    4: "hh",
    1: "mm",
  };

  let decoded = { sn: "", mm: "", hh: "", dd: "", MM: "", yyyy: "" };

  Object.keys(mappings).forEach((colNum) => {
    let columnBits = columns[colNum].slice(1);
    let value = columnBits.reduce(
      (acc, bit, idx) => acc + bit * 2 ** (6 - idx),
      0
    );

    decoded[mappings[colNum]] =
      value.toString().padStart(2, "0") + decoded[mappings[colNum]];
  });

  document.getElementById(
    "result"
  ).textContent = `${decoded.hh}:${decoded.mm} ${decoded.dd}/${decoded.MM}/${decoded.yyyy} ${decoded.sn}`;
}

tableGridInit();
decodePattern();
