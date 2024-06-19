const fs = require("fs");
const path = require("path");
const topojson = require("topojson-server");

const inputDir = path.join(__dirname, "../assets");
const outputDir = path.join(__dirname, "../data");

if (!fs.existsSync(inputDir)) {
  console.log("input dir does not exist");
  return;
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const files = [
  { input: "countries.json", output: "countries-topo.json" },
  { input: "states.json", output: "states-topo.json" },
];

files.forEach(({ input, output }) => {
  const geojson = JSON.parse(fs.readFileSync(path.join(inputDir, input)));
  const topojsonData = topojson.topology({
    [input.replace(".json", "")]: geojson,
  });

  fs.writeFileSync(path.join(outputDir, output), JSON.stringify(topojsonData));
  console.log(`Converted ${input} to ${output}`);
});
