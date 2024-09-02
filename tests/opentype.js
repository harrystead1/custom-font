// const { parseSVG, makeAbsolute } = require("svg-path-parser");
// const { Font, Glyph, Path } = require("opentype.js");
// const fs = require("fs");

// function convertToOpenTypePath(parsedPathData) {
//   const path = new Path();
//   parsedPathData.forEach((command) => {
//     switch (command.code) {
//       case "M":
//         path.moveTo(command.x, -command.y); // Flip Y
//         break;
//       case "L":
//         path.lineTo(command.x, -command.y); // Flip Y
//         break;
//       case "C":
//         path.curveTo(
//           command.x1,
//           -command.y1,
//           command.x2,
//           -command.y2,
//           command.x,
//           -command.y
//         );
//         break;
//       case "Q":
//         path.quadTo(command.x1, -command.y1, command.x, -command.y);
//         break;
//       case "Z":
//         path.closePath();
//         break;
//       // Handle additional commands (H, V, S, T, A, etc.)
//       default:
//         console.warn(`Unsupported SVG command: ${command.code}`);
//     }
//   });
//   return path;
// }

// function transformSVGCoordinates(commands, unitsPerEm) {
//   const transformedCommands = commands.map((command) => {
//     const transformedCommand = { ...command };
//     if (command.x !== undefined) transformedCommand.x *= unitsPerEm;
//     if (command.y !== undefined) transformedCommand.y *= unitsPerEm;
//     if (command.x1 !== undefined) transformedCommand.x1 *= unitsPerEm;
//     if (command.y1 !== undefined) transformedCommand.y1 *= unitsPerEm;
//     if (command.x2 !== undefined) transformedCommand.x2 *= unitsPerEm;
//     if (command.y2 !== undefined) transformedCommand.y2 *= unitsPerEm;
//     return transformedCommand;
//   });
//   return transformedCommands;
// }

// const svgPaths = fs.readFileSync("data.json", "utf8");

// // Include the notdef and space glyphs
// var notdefGlyph = new Glyph({
//   name: ".notdef",
//   advanceWidth: 650,
//   path: new Path(),
// });
// var spaceGlyph = new Glyph({
//   name: "space",
//   unicode: 32,
//   advanceWidth: 250,
//   path: new Path(),
// });

// var glyphs = [notdefGlyph, spaceGlyph];

// JSON.parse(data).forEach((glyphData, index) => {
//   const parsedPath = parseSVG(glyphData.vector);
//   const transformedPath = transformSVGCoordinates(parsedPath, 1); // Normalize to unitsPerEm
//   const glyphPath = convertToOpenTypePath(transformedPath);
//   const glyph = new Glyph({
//     name: `glyph-${index}`,
//     unicode: glyphData.unicode,
//     advanceWidth: 600,
//     path: glyphPath,
//   });
//   glyphs.push(glyph);
// });

// const font = new Font({
//   familyName: "CustomSVGFont",
//   styleName: "Regular",
//   unitsPerEm: 1000,
//   ascender: 800,
//   descender: -200,
//   glyphs: glyphs,
// });

const fs = require("fs");
const { Font, Glyph, Path } = require("../dist/opentype");

const svgPaths = fs.readFileSync("tests/data.json", "utf8");

function svgPathToGlyph(pathData, unicode, advanceWidth = 1000) {
  const path = Path.fromSVG(pathData);

  return new Glyph({
    name: `glyph${unicode}`,
    unicode: unicode,
    advanceWidth: advanceWidth,
    path: path,
  });
}

const glyphs = JSON.parse(svgPaths).map((svg, index) =>
  svgPathToGlyph(svg.vector, svg.unicode || index)
);

function createFontFromGlyphs(glyphs) {
  return new Font({
    familyName: "CustomFont",
    styleName: "Regular",
    unitsPerEm: 1000,
    ascender: 800,
    descender: -200,
    glyphs: glyphs,
  });
}

const font = createFontFromGlyphs(glyphs);
console.log(font);

fs.writeFileSync("results/opentype.ttf", Buffer.from(font.toArrayBuffer()));
