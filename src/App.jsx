import './App.css';

import { useState, useEffect } from 'react';

import { db } from './firebase';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
    const [loading, setLoading] = useState(false);

    const [darkMode, setDarkMode] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const studentsCollection = collection(db, 'students');
    const chartData = [
        {
            name: 'Students',
            total: students.length,
        },
    ];

    // ADD STUDENT

    const addStudent = async () => {
        setLoading(true);
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
        setLoading(false);
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
        setLoading(true);
        const studentDoc = doc(db, 'students', id);

        await deleteDoc(studentDoc);

        getStudents();
        setLoading(false);
    };

    // UPDATE STUDENT

    const updateStudent = async (id) => {
        setLoading(true);
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
        setLoading(false);
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
                    <div className="top-bar">
                        <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>

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
        <div className={darkMode ? 'container dark' : 'container light'}>
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
            {loading && <div className="loading">Loading...</div>}

            <div className="chart-section">
                <h2>Student Analytics</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Bar dataKey="total" fill="#38bdf8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* FORM */}

            <div className="open-modal-section">
                <button className="open-modal-btn" onClick={() => setShowModal(true)}>
                    Add New Student
                </button>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search Students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingId ? 'Edit Student' : 'Add Student'}</h2>

                        <input
                            type="text"
                            placeholder="Student Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />

                        <input
                            type="text"
                            placeholder="Course"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                        />

                        {editingId ? (
                            <button
                                onClick={() => {
                                    updateStudent(editingId);
                                    setShowModal(false);
                                }}>
                                Update Student
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    addStudent();
                                    setShowModal(false);
                                }}>
                                Add Student
                            </button>
                        )}

                        <button
                            className="close-btn"
                            onClick={() => {
                                setShowModal(false);

                                setEditingId(null);

                                setName('');

                                setAge('');

                                setCourse('');
                            }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
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
                                    setShowModal(true);
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
