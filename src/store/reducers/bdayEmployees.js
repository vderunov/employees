import * as birthdayUserActions from '../actions/actionTypes';
import { getDateFormat, removeDuplicates, updateObject } from '../../utility';

const initialState = {
    bdayEmployees: [],
    checkedInputs: null,
};

const createArrayWithEmployeeByBDayMonth = (bdayEmployees) => {
    let newArray = new Array(12).fill([]);
    bdayEmployees.forEach((employee) => {
        const { monthIndex, fullBirthDate } = getDateFormat(employee);
        const employeeObj = {
            ...employee,
            fullBirthDate,
            monthIndex,
        };
        newArray[monthIndex] = [...newArray[monthIndex], employeeObj];
    });

    return newArray;
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case birthdayUserActions.ADD_SELECTED_EMPLOYEE:
            const uniqueArray = removeDuplicates(action.employee, 'id');
            return updateObject(state, { bdayEmployees: [...createArrayWithEmployeeByBDayMonth(uniqueArray)] });
        case birthdayUserActions.GET_EMPLOYEE_FROM_LOCALSTORAGE:
            return updateObject(state, { bdayEmployees: [...action.employee] });
        case birthdayUserActions.SAVE_CHECKED_INPUT:
            return updateObject(state, { checkedInputs: { ...state.checkedInputs, ...action.input } });
        default:
            return state;
    }
};

export default reducer;
