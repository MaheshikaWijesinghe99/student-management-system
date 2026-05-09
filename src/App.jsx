import './App.css';

import { useState, useEffect } from 'react';

import { db } from './firebase';

import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

function App() {
    const [name, setName] = useState('');

    const [age, setAge] = useState('');

    const [course, setCourse] = useState('');

    const [students, setStudents] = useState([]);

    const studentsCollection = collection(db, 'students');

    // ADD STUDENT

    const addStudent = async () => {
        if (name === '' || age === '' || course === '') {
            alert('Please fill all fields');
            return;
        }

        await addDoc(studentsCollection, {
            name: name,
            age: age,
            course: course,
        });

        alert('Student Added');

        setName('');
        setAge('');
        setCourse('');

        getStudents();
    };

    // GET STUDENTS

    const getStudents = async () => {
        const data = await getDocs(studentsCollection);

        setStudents(
            data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            })),
        );
    };

    // DELETE STUDENT

    const deleteStudent = async (id) => {
        const studentDoc = doc(db, 'students', id);

        await deleteDoc(studentDoc);

        getStudents();
    };

    useEffect(() => {
        getStudents();
    }, []);

    return (
        <div className="container">
            <h1>Student Management System</h1>

            {/* FORM */}

            <div className="form-container">
                <input type="text" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} />

                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />

                <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />

                <button onClick={addStudent}>Add Student</button>
            </div>

            {/* STUDENT LIST */}

            <div className="students-container">
                {students.map((student) => (
                    <div className="student-card" key={student.id}>
                        <h2>{student.name}</h2>

                        <p>Age: {student.age}</p>

                        <p>Course: {student.course}</p>

                        <button className="delete-btn" onClick={() => deleteStudent(student.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
