export const YearList = (n = 5) => {
    let years = []
    let toyear = new Date().getFullYear()
    let minyear = toyear - n
    for (; toyear >= minyear; toyear--) {
        years.push(toyear)
    }
    return years
}
