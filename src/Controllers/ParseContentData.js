export default function(data){
    return Object.keys(data).map(key=> {
        return{
            id: key,
            ...data[key],
        }
    })
    .sort(function(a, b) {
        return (a.sendAt < b.sendAt) ? -1 : ((a.sendAt > b.sendAt) ? 1 : 0);
    });
}