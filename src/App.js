import { useEffect, useState, createContext, useContext, useMemo, useRef } from 'react';

import { connect } from 'react-redux';
import './App.css';
import axios from 'axios';
import * as birthdaysAction from './store/actions/actions';
import {
    englishAlphabet,
    months,
    checkDuplicates,
    createArrayWithEmployeesAlphabeticallySeparated,
    createFlatCopyCollectionWithoutDuplicates,
    sortEmployeesAlphabetically,
    setInputsCheckedAfterReload,
    getNodsBySelector,
    getDataFromLocalStorage,
    saveDataToLocalStorage,
} from './utility';

const url = 'https://yalantis-react-school-api.yalantis.com/api/task0/users';

const fetchEmployees = (url) => {
    return axios
        .get(url)
        .then(({ data }) => data)
        .catch((error) => console.error(error));
};

const Input = ({ id, handleChange }) => <input type="checkbox" name={id} onChange={(e) => handleChange(e, id)} />;

const Employee = ({ lastName, firstName, fullBirthDate }) => {
    const birthDate = fullBirthDate ? `- ${fullBirthDate}` : null;

    return (
        <li className="employeeWrapper">
            <p>
                {lastName} {firstName} {birthDate}
            </p>
        </li>
    );
};

const BoxAlphabetical = ({ letter, employeesByLetter }) => {
    const { handleChange } = useContext(PersonContext);
    let listOfEmployees;

    if (employeesByLetter.length >= 1) {
        listOfEmployees = employeesByLetter.map((employee) => {
            const { id } = employee;
            return (
                <ul key={id} className="name_wrapper">
                    <Employee {...employee} />
                    <Input id={id} handleChange={handleChange} />
                </ul>
            );
        });
    } else {
        listOfEmployees = <span>----</span>;
    }

    return (
        <div className="letter_wrapper">
            <p>{letter}</p>
            {listOfEmployees}
        </div>
    );
};

const BoxBirthdays = ({ employees }) => {
    const month = months[employees[0].monthIndex];
    const listOfEmployees = employees.map((employee) => <Employee key={employee.id} {...employee} />);

    return (
        <>
            <p className="month">{month}</p>
            <ul className="birthday_wrapper">{listOfEmployees}</ul>
        </>
    );
};

const PersonContext = createContext();

function App({
    onAddedSelectedEmployee,
    bdayEmployees,
    onGetEmployeeFromLocalStorage,
    onSaveCheckedInput,
    checkedInputs,
}) {
    const [sortedEmployeesInAlphabetical, setSortedEmployeesInAlphabetical] = useState([]);
    const [randomEmployees, setRandomEmployees] = useState([]);
    const arraySelectedEmployee = useRef([]);
    const inputsNods = useRef([]);

    useEffect(() => {
        fetchEmployees(url).then((randomEmployees) => setRandomEmployees(randomEmployees));
        const employeesDatLocalStorage = getDataFromLocalStorage('bdayEmployees') || [];
        const inputsFromLocalStorage = getDataFromLocalStorage('checkedInputs');
        arraySelectedEmployee.current = createFlatCopyCollectionWithoutDuplicates(employeesDatLocalStorage);
        onSaveCheckedInput(inputsFromLocalStorage);
        onGetEmployeeFromLocalStorage(employeesDatLocalStorage);
    }, [onGetEmployeeFromLocalStorage, onSaveCheckedInput]);

    useEffect(() => {
        if (inputsNods.current.length <= 0) {
            inputsNods.current = getNodsBySelector('input');
        }
        setInputsCheckedAfterReload(inputsNods.current, checkedInputs);
    });

    useEffect(() => {
        const sortedEmployeesAlphabetically = sortEmployeesAlphabetically(randomEmployees);
        const separatedEmployees = createArrayWithEmployeesAlphabeticallySeparated(sortedEmployeesAlphabetically);
        setSortedEmployeesInAlphabetical(separatedEmployees);
    }, [randomEmployees]);

    useEffect(() => {
        saveDataToLocalStorage('bdayEmployees', bdayEmployees);
        saveDataToLocalStorage('checkedInputs', checkedInputs);
    }, [bdayEmployees, checkedInputs]);

    const handleChange = (event, id) => {
        const input = event.target;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        const inputObj = {
            [input.name]: value,
        };
        onSaveCheckedInput(inputObj);
        const selectedEmployee = randomEmployees.find((employee) => employee.id === id);
        arraySelectedEmployee.current.push(selectedEmployee);
        const checkedArray = checkDuplicates(arraySelectedEmployee.current);
        onAddedSelectedEmployee(checkedArray);
    };

    const letterWrapper = sortedEmployeesInAlphabetical.map((employeesByLetter, index) => {
        const letter = englishAlphabet[index].toUpperCase();
        return <BoxAlphabetical key={index.toString()} letter={letter} employeesByLetter={employeesByLetter} />;
    });

    const birthdayList = useMemo(
        () =>
            bdayEmployees.map((employees, index) => {
                return employees.length >= 1 ? (
                    <BoxBirthdays key={index.toString()} month={index} employees={employees} />
                ) : null;
            }),
        [bdayEmployees],
    );

    const bdaysList = birthdayList.length === 0 ? <p className="no_selected">No selected employees</p> : birthdayList;

    return (
        <div className="main_wrapper">
            <PersonContext.Provider value={{ handleChange }}>
                <section className="section_wrapper">
                    <h3>Employees</h3>
                    <div className="alphabetical_wrapper">{letterWrapper}</div>
                </section>
            </PersonContext.Provider>
            <section className="section_wrapper">
                <h3>Employees birthday</h3>
                <hr />
                {bdaysList}
            </section>
        </div>
    );
}

const mapStateToProps = ({ bdayEmployees, checkedInputs }) => {
    return {
        bdayEmployees,
        checkedInputs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddedSelectedEmployee: (employee) => dispatch(birthdaysAction.addSelectedEmployee(employee)),
        onGetEmployeeFromLocalStorage: (employee) => dispatch(birthdaysAction.getEmployeeFromLocalStorage(employee)),
        onSaveCheckedInput: (input) => dispatch(birthdaysAction.saveCheckedInput(input)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
