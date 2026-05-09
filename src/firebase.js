import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAcSOrzwT01nhKwRQLuhkZI8HW2-wNq1z8',
    authDomain: 'student-management-syste-f6e5d.firebaseapp.com',
    projectId: 'student-management-syste-f6e5d',
    storageBucket: 'student-management-syste-f6e5d.firebasestorage.app',
    messagingSenderId: '628424880846',
    appId: '1:628424880846:web:5623fb40fb403d4f70969f',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
