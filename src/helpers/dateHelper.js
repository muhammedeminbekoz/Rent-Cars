

const formatUTC3 = (userDate) => {
    const date = new Date(userDate);
    const utcDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    return utcDate
}

module.exports = {
    formatUTC3
}