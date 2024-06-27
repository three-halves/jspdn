export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function interpColor(ca, cb) {
  var newColor = {r: 0, g: 0, b: 0, a: 0};

  var a = ca.a / 255.0;
  newColor.r = (ca.r * a + cb.r * (1 - a));
  newColor.g = (ca.g * a + cb.g * (1 - a));
  newColor.b = (ca.b * a + cb.b * (1 - a));
  newColor.a = (ca.a * a + cb.a * (1 - a));

  return newColor;
}

export var fourWayDeltas = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x:0, y: -1}];