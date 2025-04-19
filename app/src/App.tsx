import './App.css';
import { useEffect, useId, useState } from 'react';

function App() {
  const [students, setStudents] = useState<
    { id: number; name: string; grade: string }[]
  >([]);

  const fetchStudents = async () => {
    const response = await fetch('http://localhost:8080/students');
    const students = await response.json();
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    };
    const response = await fetch(
      'http://localhost:8080/students',
      requestOptions,
    );
    if (response.status === 201) {
      const json = await response.json();
      setStudents([...students, json]);
      setNewName('');
      setNewGrade(5);
    }
  };

  const deleteId = useId();
  const [idToDelete, setIdToDelete] = useState(0);

  const deleteStudent = async () => {
    if (idToDelete < 1) {
      return;
    }
    const response = await fetch(
      `http://localhost:8080/students/${idToDelete}`,
      { method: 'DELETE' },
    );
    if (response.status === 200) {
      setStudents(students.filter((s) => s.id !== idToDelete));
    }
  };

  const idToUpdateId = useId();
  const updateNameId = useId();
  const updateGradeId = useId();
  const [idToUpdate, setIdToUpdate] = useState(0);
  const [updateName, setUpdateName] = useState('');
  const [updateGrade, setUpdateGrade] = useState(5);

  const updateStudent = async () => {
    if (idToUpdate < 1) {
      return;
    }
    const updateStudentRequest = {
      id: idToUpdate,
      name: updateName,
      grade: updateGrade,
    };
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateStudentRequest),
    };
    const response = await fetch(
      `http://localhost:8080/students/${idToUpdate}`,
      requestOptions,
    );

    if (response.status === 200) {
      const updatedStudent = await response.json();
      setStudents([
        ...students.filter((s) => s.id !== idToUpdate),
        updatedStudent,
      ]);
    }
  };

  return (
    <div className="App">
      <h1>List of students</h1>
      <table style={{ margin: '0 auto', border: '1px solid black' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Add student</h1>
      <label htmlFor={newNameId}>Name</label>
      <input
        id={newNameId}
        value={newName}
        onInput={({ target }) => {
          if (target instanceof HTMLInputElement) {
            setNewName(target?.value);
          }
        }}
        required={true}
      />
      <label htmlFor={newGradeId}>Name</label>
      <input
        id={newGradeId}
        value={newGrade}
        onInput={({ target }) => {
          if (target instanceof HTMLInputElement) {
            setNewGrade(Number(target?.value));
          }
        }}
        type="number"
        min={1}
        max={12}
      />
      <button onClick={createStudent}>Add student</button>
      <h1>Update existing student</h1>
      <label htmlFor={idToUpdateId}>ID</label>
      <input
        id={idToUpdateId}
        value={idToUpdate}
        onInput={({ target }) => {
          if (target instanceof HTMLInputElement) {
            setIdToUpdate(Number(target.value));
          }
        }}
        required={true}
        type="number"
      />
      <label htmlFor={updateNameId}>Name</label>
      <input
        id={updateNameId}
        value={updateName}
        onInput={({ target }) => {
          if (target instanceof HTMLInputElement) {
            setUpdateName(target.value);
          }
        }}
        required={true}
      />
      <label htmlFor={updateGradeId}>Name</label>
      <input
        id={updateGradeId}
        value={updateGrade}
        onInput={({ target }) => {
          if (target instanceof HTMLInputElement) {
            setUpdateGrade(Number(target.value));
          }
        }}
        type="number"
        min={1}
        max={12}
      />
      <button onClick={updateStudent}>Update student</button>
      <h1>Delete student</h1>
      <label htmlFor={deleteId}>Name</label>
      <input
        id={deleteId}
        value={idToDelete}
        onInput={({ target }) => {
          if (target instanceof HTMLInputElement) {
            setIdToDelete(Number(target.value));
          }
        }}
        type="number"
        min={1}
      />
      <button onClick={deleteStudent}>Delete student</button>
    </div>
  );
}

export default App;
