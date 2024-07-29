// >>> HELPERS <<<

const castComparer = (comparer) => (a, b, order) => comparer(a, b, order) * order;

const unpackObjectSorter = function (sortByObj) {
    const { asc, desc } = sortByObj || {};
    const order = asc ? 1 : -1;
    const sortBy = asc || desc;

    const comparer = sortByObj.comparer && castComparer(sortByObj.comparer);

    return { order, sortBy, comparer };
};

// >>> SORTERS <<<

const multiPropertySorterProvider = function (defaultComparer) {
    return function multiPropertySorter(sortBy, sortByArr, depth, order, comparer, a, b) {
        let valA;
        let valB;

        if (typeof sortBy === 'string') {
            valA = a[sortBy];
            valB = b[sortBy];
        } else if (typeof sortBy === 'function') {
            valA = sortBy(a);
            valB = sortBy(b);
        } else {
            const objectSorterConfig = unpackObjectSorter(sortBy);
            return multiPropertySorter(objectSorterConfig.sortBy, sortByArr, depth, objectSorterConfig.order, objectSorterConfig.comparer || defaultComparer, a, b);
        }

        const equality = comparer(valA, valB, order);

        if ((equality === 0 || (valA == null && valB == null)) && sortByArr.length > depth) {
            return multiPropertySorter(sortByArr[depth], sortByArr, depth + 1, order, comparer, a, b);
        }

        return equality;
    };
};

function getSortStrategy(sortBy, comparer, order) {
    // Flat array sorter
    if (sortBy === undefined || sortBy === true) {
        return (a, b) => comparer(a, b, order);
    }

    // Sort list of objects by single object key
    if (typeof sortBy === 'string') {
        return (a, b) => comparer(a[sortBy], b[sortBy], order);
    }

    // Sort list of objects by single function sorter
    if (typeof sortBy === 'function') {
        return (a, b) => comparer(sortBy(a), sortBy(b), order);
    }

    // Sort by multiple properties
    if (Array.isArray(sortBy)) {
        const multiPropSorter = multiPropertySorterProvider(comparer);
        return (a, b) => multiPropSorter(sortBy[0], sortBy, 1, order, comparer, a, b);
    }

    // Unpack object config to get actual sorter strategy
    const objectSorterConfig = unpackObjectSorter(sortBy);
    return getSortStrategy(objectSorterConfig.sortBy, objectSorterConfig.comparer || comparer, objectSorterConfig.order);
}

const sortArray = function (order, ctx, sortBy, comparer) {
    if (!Array.isArray(ctx)) {
        return ctx;
    }

    // Unwrap sortBy if array with only 1 value to get faster sort strategy
    if (Array.isArray(sortBy) && sortBy.length < 2) {
        [sortBy] = sortBy;
    }

    return ctx.sort(getSortStrategy(sortBy, comparer, order));
};

// >>> Public <<<

function createNewSortInstance(opts) {
    const comparer = castComparer(opts.comparer);

    return function (arrayToSort) {
        return {
            asc(sortBy) {
                return sortArray(1, arrayToSort.slice(), sortBy, comparer);
            },
            desc(sortBy) {
                return sortArray(-1, arrayToSort.slice(), sortBy, comparer);
            },
            by(sortBy) {
                return sortArray(1, arrayToSort.slice(), sortBy, comparer);
            }
        };
    };
}

const defaultComparer = (a, b, order) => {
    if (a == null) return order;
    if (b == null) return -order;

    if (typeof a !== typeof b) {
        if (typeof a < typeof b) {
            return -1;
        } else {
            return 1;
        }
    }

    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
};

export const yd_data_sortBy = createNewSortInstance({
    comparer: defaultComparer
});
