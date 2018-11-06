import { ObjectId } from "bson";

export function getMediaCode(date: Date, category: string, subCategory?: string) {
    let amOrPm = (date.getHours() >= 12) ? "PM" : "AM";
    let subCategoryArg = subCategory ? "-" + subCategory.substr(0, 3) : "";
    return getFormattedDate(date) + amOrPm + "-" + category.substr(0, 3) + subCategoryArg;
}

export function tryParseObjectId(id: string): ObjectId {
    try {
        return new ObjectId(id)
    } catch (e) {
        return null;
    }
}
function getFormattedDate(date: Date): string {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + day + year;
}