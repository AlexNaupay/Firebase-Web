<script setup lang="ts">
import {initializeApp} from "firebase/app";
import {getFirestore, collection, getDocs, query, where} from "firebase/firestore/lite";
import {onMounted, ref} from "vue";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};


async function getPostsWithAuthors(db: any) {
  // 1. Obtener posts
  const postsSnapshot = await getDocs(collection(db, "posts"));
  const posts = postsSnapshot.docs.map(docPost => ({
    id: docPost.id,
    ...docPost.data(),
    author: docPost.data().author // Referencia al autor
  }));

  // 2. Extraer referencias de autores únicas
  const authorRefs = [...new Set(posts.map(post => post.author))];

  // 3. Dividir referencias en lotes de máximo 30
  const chunks = [];
  for (let i = 0; i < authorRefs.length; i += 30) {
    chunks.push(authorRefs.slice(i, i + 30));
  }

  // 4. Obtener autores por lotes
  const authorsPromises = chunks.map(async (chunk) => {
    const q = query(collection(db, "users"), where("__name__", "in", chunk.map(ref => ref.id)));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  });
  const authorsChunks = await Promise.all(authorsPromises);
  const authors = authorsChunks.flat();

  // 5. Combinar posts con autores
  const postsWithAuthors = posts.map(post => ({
    ...post,
    author: authors.find(author => author.id === post.author.id)
  }));

  return postsWithAuthors;
}

let posts = ref();

onMounted(async () => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  /*const querySnapshot = await getDocs(collection(db, 'posts'));
  querySnapshot.forEach((doc) => {
      posts.value.push(doc.data());
  });*/

  posts.value = await getPostsWithAuthors(db);

});

</script>

<template>
  <div class="container mx-auto xl:px-0 px-6 text-gray-800 transition-all duration-300 ease-in-out">

    <h1 class="text-2xl mb-2">Posts of day</h1>

    <div class="grid gap-8 lg:grid-cols-2">
      <article v-for="post in posts"
               class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div class="flex justify-between items-center mb-5 text-gray-500">
                  <span
                      class="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                      <svg class="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg"><path
                          d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                      Tutorial
                  </span>
          <span class="text-sm">14 days ago</span>
        </div>
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">{{
            post.title
          }}</a></h2>
        <p class="mb-5 font-light text-gray-500 dark:text-gray-400">
          {{ post.extract }}
        </p>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <img class="w-7 h-7 rounded-full"
                 src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                 alt="Jese Leos avatar"/>
            <span class="font-medium dark:text-white">
                          {{ post.author.first }} {{ post.author.last }}
                      </span>
          </div>
          <a href="#"
             class="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
            Read more
            <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
            </svg>
          </a>
        </div>
      </article>
    </div>

  </div>
</template>

<style scoped>

</style>