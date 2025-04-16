import moment from 'moment'

/**
 * List all months from the given month to the latest after adding a specified number of months.
 * 
 * @param {string} givenMonth - The starting month in the format "YYYYMM".
 * @param {number} monthsToAdd - The number of months to add.
 * @returns {string[]} - An array of months in the format "YYYYMM".
 */
export function listMonths(givenMonth, monthsToAdd) {
    // Convert given month to moment and add the specified number of months
    let start = moment(givenMonth, "YYYYMM");
    let end = moment(givenMonth, "YYYYMM").add(monthsToAdd, 'months');

    // Array to store all months
    let monthsList = [];

    // Loop from the starting month to the latest month
    while (start <= end) {
        monthsList.push(start.format("YYYYMM"));
        start.add(1, 'months'); // Move to the next month
    }

    return monthsList;
}
