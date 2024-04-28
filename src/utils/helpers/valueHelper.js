const isNullOrUndefinedOrEmpty = (param) => {
    if (param == undefined || param == null || param == "") return true
    else return false
}

module.exports = {
    isNullOrUndefinedOrEmpty
}