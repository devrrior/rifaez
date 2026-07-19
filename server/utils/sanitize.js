export default function ({username, payment_methods, name, raffles, phone, facebookUrl, workers, logo, companyName, _id, facebookId}){
    const safeUser = {
        _id,
        username,
        payment_methods,
        name,
        raffles,
        phone,
        facebookUrl,
        workers,
        logo,
        companyName,
        facebookId,
    }
    return safeUser
}