import * as bdayUserActions from './actionTypes';

export const addSelectedEmployee = (employee) => {
    return {
        type: bdayUserActions.ADD_SELECTED_EMPLOYEE,
        employee,
    };
};

export const getEmployeeFromLocalStorage = (employee) => {
    return {
        type: bdayUserActions.GET_EMPLOYEE_FROM_LOCALSTORAGE,
        employee,
    };
};

export const saveCheckedInput = (input) => {
    return {
        type: bdayUserActions.SAVE_CHECKED_INPUT,
        input,
    };
};
