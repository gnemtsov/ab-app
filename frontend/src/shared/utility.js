export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) {
        return true;
    }

    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}

export const multiSort = (arr, cols, dirs) => {
    const sortRecursive = (a, b, cols, dirs, index) => {
        const col = cols[index];
        const dir = dirs[index];
        let x = a[col];
        let y = b[col];

        if(typeof x === 'string' || typeof y === 'string'){
            x = x === null ? '' : x.toLowerCase();
            y = y === null ? '' : y.toLowerCase();
        }

        if (x < y) {
            return dir === 'DESC' ? 1 : -1;
        }

        if (x > y) {
            return dir === 'DESC' ? -1 : 1;
        }

        return cols.length - 1 > index ? sortRecursive(a, b, cols, dirs, index + 1) : 0;
    }

    return arr.sort((a, b) => sortRecursive(a, b, cols, dirs, 0));
}
