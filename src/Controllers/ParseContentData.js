export default function(data,dateField = "sendAt",ascending = true) {
    return Object.keys(data).map(key=> {
        return{
            id: key,
            ...data[key],
        }
    })
    .sort(function(a, b) {
        const dateA = new Date(a[dateField]);
        const dateB = new Date(b[dateField]);

        if(ascending){
            return (dateA > dateB) ? -1 : ((dateA < dateB) ? 1 : 0);
        }
        else{
            return (dateA < dateB) ? -1 : ((dateA > dateB) ? 1 : 0);
        }
    });
}