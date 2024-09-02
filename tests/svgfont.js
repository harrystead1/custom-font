const fs = require("fs");
const svg2ttf = require("svg2ttf");

function convertGlyphDataToSvg(glyphDataArray) {
  const svgHeader = `<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg xmlns="http://www.w3.org/2000/svg"> \n<defs>\n  <font id="font-custom">\n <font-face font-family="font-custom" ascent="200" units-per-em="300" />\n`;
  const svgFooter = `  </font>\n</defs>\n</svg>`;

  let glyphs = "";

  glyphDataArray.forEach((glyphData) => {
    console.log(
      `${String.fromCharCode(glyphData.unicode)}: ${glyphData.width}`
    );

    glyphs += `    <glyph glyph-name="${String.fromCharCode(
      glyphData.unicode
    )}" unicode="${String.fromCharCode(
      glyphData.unicode
    )}" horiz-adv-x="${100}">\n`;
    glyphs += `      <path d="${glyphData.vector}" />\n`;
    glyphs += `    </glyph>\n`;
  });

  const svgContent = svgHeader + glyphs + svgFooter;
  return svgContent;
}

const glyphDataString = fs.readFileSync("tests/data.json", "utf8");
const glyphDataArray = JSON.parse(glyphDataString);

const svgOutput = convertGlyphDataToSvg(glyphDataArray);
fs.writeFileSync("results/svgfont.svg", svgOutput, "utf8");

const ttf = svg2ttf(svgOutput, {});

fs.writeFileSync("results/svgfont.ttf", Buffer.from(ttf.buffer), "binary");

console.log("TTF file has been created.");
