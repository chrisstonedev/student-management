import './App.css';
import {useEffect, useId, useState} from "react";

function App() {
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        const response = await fetch("http://localhost:8080/students");
        const students = await response.json();
        console.log('stu', students);
        if (response.status === 200 && students !== null) {
            setStudents(students);
        } else {
            console.error('error from api: ' + JSON.stringify(students));
        }
    };

    useEffect(() => {
        fetchStudents().then();
    }, []);
    const newNameId = useId();
    const newGradeId = useId();
    const [newName, setNewName] = useState('');
    const [newGrade, setNewGrade] = useState(5);

    const createStudent = async () => {
        if (newName.trim().length === 0) {
            return;
        }
        const newStudent = {
            name: newName,
            grade: newGrade,
        };
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newStudent)
        };
        const response = await fetch("http://localhost:8080/students", requestOptions);
        if (response.status === 201) {
            const json = await response.json();
            setStudents([...students, json]);
            setNewName('');
            setNewGrade(5);
        }
    }

    const deleteStudent = async (id) => {
        const response = await fetch(`http://localhost:8080/students/${id}`, {method: 'DELETE'});
        if (response.status === 201) {
            const json = await response.json();
            setStudents([...students, json]);
        }
    }

    return (
        <div className="App">
            <h1>List of students</h1>
            {students.map((student) => (
                <p key={student.id}>{student.name} (grade {student.grade})</p>
            ))}
            <h1>Add student</h1>
            <label htmlFor={newNameId}>Name</label>
            <input id={newNameId} value={newName} onInput={e => setNewName(e.target?.value)} required={true}/>
            <label htmlFor={newGradeId}>Name</label>
            <input id={newGradeId} value={newGrade} onInput={e => setNewGrade(Number(e.target?.value))} type="number"
                   min={1} max={12}/>
            <button onClick={createStudent}>Add student</button>
            <h1>Update existing student</h1>
            <h1>Delete student</h1>
            <button onClick={() => deleteStudent(10)}>Delete student at ID=10</button>
        </div>
    );
}

export default App;
