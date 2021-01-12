module.exports = (dateString) => {
    if(dateString){
        const dateArray = dateString.split('/');
        if(dateArray[0].length === 1){
            dateArray[0] = '0'+dateArray[0]
        }
        if(dateArray[1].length === 1){
            dateArray[1] = '0'+dateArray[1]
        }
        return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`
    }
    return ''
}