import './App.css';

import { useState, useEffect } from 'react';

import { db } from './firebase';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
    const auth = getAuth();

    const [name, setName] = useState('');

    const [age, setAge] = useState('');

    const [course, setCourse] = useState('');

    const [students, setStudents] = useState([]);

    const [search, setSearch] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

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

        toast.success('Student Added');

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

    // UPDATE STUDENT

    const updateStudent = async (id) => {
        const studentDoc = doc(db, 'students', id);

        await updateDoc(studentDoc, {
            name: name,
            age: age,
            course: course,
        });

        toast.success('Student Updated');

        setName('');
        setAge('');
        setCourse('');

        setEditingId(null);

        getStudents();
    };

    // REGISTER

    const registerUser = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            setUser(userCredential.user);

            toast.success('Registration Successful');
        } catch (error) {
            toast.error(error.message);
        }
    };
    // LOGIN

    const loginUser = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            setUser(userCredential.user);

            toast.success('Login Successful');
        } catch (error) {
            toast.error(error.message);
        }
    };
    // LOGOUT

    const logoutUser = async () => {
        await signOut(auth);

        setUser(null);

        toast.info('Logged Out');
    };
    useEffect(() => {
        getStudents();
    }, []);
    if (!user) {
        return (
            <div className="auth-container">
                <ToastContainer />
                <div className="auth-box">
                    <h1>Student Management Login</h1>

                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={registerUser}>Register</button>

                    <button className="login-btn" onClick={loginUser}>
                        Login
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="container">
            <ToastContainer />
            <h1>Student Management System</h1>
            <button className="logout-btn" onClick={logoutUser}>
                Logout
            </button>
            <div className="stats-container">
                <div className="stat-card">
                    <h2>{students.length}</h2>

                    <p>Total Students</p>
                </div>
            </div>

            {/* FORM */}

            <div className="form-container">
                <input type="text" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
                <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />
                {editingId ? (
                    <button onClick={() => updateStudent(editingId)}>Update Student</button>
                ) : (
                    <button onClick={addStudent}>Add Student</button>
                )}
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search Students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* STUDENT LIST */}

            <div className="students-container">
                {students
                    .filter((student) => student.name.toLowerCase().includes(search.toLowerCase()))
                    .map((student) => (
                        <div className="student-card" key={student.id}>
                            <h2>{student.name}</h2>

                            <p>Age: {student.age}</p>

                            <p>Course: {student.course}</p>

                            <button
                                className="edit-btn"
                                onClick={() => {
                                    setName(student.name);

                                    setAge(student.age);

                                    setCourse(student.course);

                                    setEditingId(student.id);
                                }}>
                                Edit
                            </button>

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
