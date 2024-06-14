export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function over(ca, cb) {
  var newColor = {r: 0, g: 0, b: 0, a: 0};

  newColor.r = ca.r + cb.r * (1 - ca.a / 255);
  newColor.g = ca.g + cb.g * (1 - ca.a / 255);
  newColor.b = ca.b + cb.b * (1 - ca.a / 255);
  newColor.a = ca.a + cb.a * (1 - ca.a / 255);

  return newColor;
}