export const uniqByProp = prop => arr =>
    Object.values(
        arr.reduce(
            (acc, item) =>
                item && item[prop]
                    ? { ...acc, [item[prop]]: item } // just include items with the prop
                    : acc,
            {}
        )
    );
