export function stripBom(str) {
  if (str.charCodeAt(0) === 0xFEFF) {
		return str.slice(1);
	}
  return str;
}

export function reverseDate(str) {
  return str.split("/").reverse().join("-");
}

export function slugifyCode(str) {
  str = str.replace(/\(.*?\)/g, "").trim().toLowerCase();
  return str.replace(/[\s-]+/g, "-");
}

export function titleFromSlug(str) {
  str = str.replaceAll("-", " ");
  return str[0].toUpperCase() + str.slice(1);
}