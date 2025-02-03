import {initializeApp} from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore/lite";

const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let ref1, ref2, ref3;

try {
    const docRef = await addDoc(collection(db, "users"), {
        first: "Ruth",
        last: "Smith",
        born: 1990
    });
    ref1 = docRef
    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}

try {
    const docRef = await addDoc(collection(db, "users"), {
        first: "Elva",
        last: "León",
        born: 1993
    });
    ref2 = docRef
    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}

try {
    const docRef = await addDoc(collection(db, "users"), {
        first: "Andrea",
        last: "Smith",
        born: 1990
    });
    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}

try {
    const docRef = await addDoc(collection(db, "users"), {
        first: "Sara",
        last: "Turing",
        born: 1993
    });
    ref3 = docRef
    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}

try {
    const docRef = await addDoc(collection(db, "posts"), {
        title: "First Post",
        extract: "Extract of first",
        body: "Body of post",
        created_at: new Date().getTime(),
        author:ref1
    });
    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}

try {
    const docRef = await addDoc(collection(db, "posts"), {
        title: "Second Post",
        extract: "Extract of second",
        body: "Body of post",
        created_at: new Date().getTime(),
        author:ref2
    });
    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}

try {
    const docRef = await addDoc(collection(db, "posts"), {
        title: "Third Post",
        extract: "Extract of third",
        body: "Body of post",
        created_at: new Date().getTime(),
        author:ref3
    });
    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}