export const getCurrentDate = () => {
    const curDate = new Date()
    const year = curDate.getFullYear();
    const month = ('0' + (curDate.getMonth() + 1)).slice(-2);
    const day = ('0' + curDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`
}

export const getPrevDate = (strDate) => {
    var date = new Date(Date.parse(strDate));
    date.setDate(date.getDate() - 1);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const newDate = `${year}-${month}-${day}`;
    return newDate;
}

export const getNextDate = (strDate) => {
    var date = new Date(Date.parse(strDate));
    date.setDate(date.getDate() + 1);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const newDate = `${year}-${month}-${day}`;
    return newDate;
}