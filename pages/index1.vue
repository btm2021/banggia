<template>
  <h1>hello</h1>
</template>

<script>
const { Deta } = require('deta'); // import Deta

// Initialize with a Project Key
// locally, set the project key in an env var called DETA_PROJECT_KEY
const deta = Deta("c0zw9qrjkal_ehAKM7hG7k8UzAJFkav7hJZ2aF4qbszD");

// This how to connect to or create a database.
const db = deta.Base('sanpham');

// You can create as many as you want without additional charges.

export default {
async mounted(){
  let item = await db.get('hibtaia0p94v'); 
  console.log(item)
}
}
</script>

<style>

</style>