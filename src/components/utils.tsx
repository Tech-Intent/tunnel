import type { TextGeometry } from "three/examples/jsm/Addons.js";

function getGeometryWidth(geometry: TextGeometry) {
  geometry.computeBoundingBox();
  if (!geometry.boundingBox) return 0;
  return geometry.boundingBox.max.x - geometry.boundingBox.min.x;
}

function wrapText(text: string, maxCharsPerLine: number): string {
  const words = text.split(" ");
  let line = "";
  let result = "";

  for (let word of words) {
    if ((line + word).length > maxCharsPerLine) {
      result += line.trim() + "\n";
      line = "";
    }
    line += word + " ";
  }
  result += line.trim(); // last line
  return result;
}

function easeInOutQuad(t: number): number {
   return 1 - Math.pow(1 - t, 4.5); 
}
export { getGeometryWidth, wrapText, easeInOutQuad };
