export function stripBom(str) {
  if (str.charCodeAt(0) === 0xFEFF) {
		return str.slice(1);
	}
  return str;
}

// A modified version of
// https://github.com/d3/d3-dsv/blob/main/src/autoType.js
// that always leaves dates as strings.
export function autoTypeWithoutDates(object) {
	for (const key in object) {
		const value = object[key].trim();
		if (!value) object[key] = null;
		else if (value.toLowerCase() === 'true') object[key] = true;
		else if (value.toLowerCase() === 'false') object[key] = false;
		else if (value === 'NaN') object[key] = NaN;
		else if (!isNaN(+value)) object[key] = +value;
	}
	return object;
}

export function reverseDate(str) {
  return str.split("/").reverse().join("-");
}

export function titleFromSlug(str) {
  str = str.replaceAll("-", " ");
  return str[0].toUpperCase() + str.slice(1);
}