export const englishAlphabet = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];

export const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const sortEmployeesAlphabetically = (randomEmployees) => {
    return randomEmployees.sort((a, b) => {
        if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) return -1;
        if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) return 1;
        return 0;
    });
};

export const createArrayWithEmployeesAlphabeticallySeparated = (sortedEmployees) => {
    return englishAlphabet.map((letter) => {
        const array = [];
        const length = sortedEmployees.length - 1;

        for (let i = 0; i <= length; i++) {
            const lastNameFirstLatter = sortedEmployees[i].lastName[0].toLowerCase();
            if (lastNameFirstLatter === letter) {
                array.push(sortedEmployees[i]);
            }
        }

        return array;
    });
};

export const saveDataToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
export const getDataFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key));
export const getNodsBySelector = (selector) => document.querySelectorAll(selector);

export const getDateFormat = (employee) => {
    const d = new Date(employee.dob);
    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const date = d.getDate();
    const monthName = months[monthIndex];
    const fullBirthDate = `${date} ${monthName}, ${year} year`;

    return { monthIndex, fullBirthDate };
};

export const checkDuplicates = (employees) => {
    if (employees.length === 1) {
        return employees;
    } else {
        return employees.filter((employee, index, arr) => arr.indexOf(employee) === index);
    }
};

export const removeDuplicates = (originalArray, prop) => {
    const newArray = [];
    const lookupObject = {};
    const length = originalArray.length - 1;

    for (let i = 0; i <= length; i++) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (let i in lookupObject) {
        newArray.push(lookupObject[i]);
    }

    return newArray;
};

export const createFlatCopyCollectionWithoutDuplicates = (data) => {
    return data
        .filter((el) => el.length !== 0)
        .flat()
        .slice();
};

export const setInputsCheckedAfterReload = (inputs, checkedInputsObj) => {
    if (inputs.length !== 0) {
        for (let id in checkedInputsObj) {
            for (let inputNode of inputs) {
                if (id === inputNode.name) {
                    inputNode.checked = true;
                }
            }
        }
    }
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};
