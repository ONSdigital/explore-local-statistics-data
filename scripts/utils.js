export function stripBom(str) {
  if (str.charCodeAt(0) === 0xFEFF) {
		return str.slice(1);
	}
  return str;
}

export function reverseDate(str) {
  return str.split("/").reverse().join("-");
}

// export function slugifyCode(str) {
//   return str.toLowerCase()
//     .replace(/\(.*?\)/g, "") // Remove anything in parentheses
//     .replace(/[\u0300-\u036f]/g, "") // Strip accents etc from letters
//     .replace(/[^a-z0-9\s\-_]/g, "") // Remove non-alphanumeric characters
//     .trim()
//     .replace(/[\s-_]+/g, "-"); // Replace strings of spaces/hypens/underscores with a single hyphen
// }

export function titleFromSlug(str) {
  str = str.replaceAll("-", " ");
  return str[0].toUpperCase() + str.slice(1);
}