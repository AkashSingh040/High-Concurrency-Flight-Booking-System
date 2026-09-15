const createFlightSearchKey = ({
    from,
    to,
    page,
    limit
}) => {

    return [
        "flight:search",
        `from=${from || ""}`,
        `to=${to || ""}`,
        `page=${page}`,
        `limit=${limit}`
    ].join(":");
};


module.exports = {
    createFlightSearchKey
};