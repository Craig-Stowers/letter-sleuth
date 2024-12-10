function daysBetween(startingDate) {
    // Create a Date object for the starting date
    let startDate = new Date(startingDate);
    startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to ensure day ticks over at midnight

    // Create a Date object for today's date
    let today = new Date();

    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to ensure comparison is date-only

    // Calculate the difference in milliseconds
    let differenceInMilliseconds = today - startDate;

    // Convert milliseconds to days
    let differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return differenceInDays;
}

function addDaysToDate(startingDate, daysToAdd) {
    // Create a Date object from the starting date
    let date = new Date(startingDate);

    // Add the days to the date
    date.setDate(date.getDate() + daysToAdd);

    // Format the day and month with leading zeros
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0"); // +1 because getMonth() returns 0-11
    let year = date.getFullYear();

    // Combine the parts into a formatted date string
    let newDate = `${day}/${month}/${year}`;

    // Return the new date
    return newDate;
}

function formatDate(dateString) {
    // Split the date string into its components
    let parts = dateString.split("-"); // parts[0] = year, parts[1] = month, parts[2] = day

    // Pad the day and month with leading zeros if necessary
    let day = parts[2].padStart(2, "0");
    let month = parts[1].padStart(2, "0");
    let year = parts[0];

    // Combine the parts into the new format
    return `${day}/${month}/${year}`;
}

export { daysBetween, addDaysToDate, formatDate };
