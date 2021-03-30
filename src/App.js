import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { useCollectionData } from 'react-firebase-hooks/firestore';

import Header from './components/Header';
import Note from './components/Note';
import CreateArea from './components/CreateArea';
// import Footer from './components/Footer';

require('dotenv').config();

if(firebase.apps.length === 0) {
    firebase.initializeApp({
            apiKey: process.env.REACT_APP_API_KEY,
            authDomain: process.env.REACT_APP_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_PROJECT_ID,
            storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_APP_ID,
            measurementId: process.env.REACT_APP_MEASUREMENT_ID
    });
}

const firestore = firebase.firestore();

function App() {

    const notesRef = firestore.collection('notes');
    const query = notesRef.orderBy('createdAt', 'asc');

    const [notes] = useCollectionData(query, { idField: 'id' });

    const addNote = async(e) => {

        await notesRef.add({
            title: e.title,
            content: e.content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(res => {
            console.log('Product add Successfully');
        })
        .catch((error) => {
            console.error('Error inserting document: ', error);
        });
    }

    const deleteNote = async(id) => {

        await notesRef.doc(id).delete()
        .then(res => {
            console.log('Product deleted Successfully');
        })
        .catch((error) => {
            console.error('Error removing document: ', error);
        });
    }

    return (
        <div className="App">
            <Header />
            <CreateArea onAdd={addNote} />
            {notes && notes.map((noteItem, index) => {
                return (
                    <Note
                        key={index}
                        id={noteItem.id}
                        title={noteItem.title}
                        content={noteItem.content}
                        onDelete={deleteNote}
                    />
                );
            })}
            {/*<Footer />*/}
        </div>
    );
}

export default App;
