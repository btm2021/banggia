<template>
  <div>
bb
  </div>
</template>

<script>
import PocketBase from 'pocketbase'
const pb = new PocketBase('https://tiemvang.fly.dev/');
export default {
async mounted(){
  let result = await pb.collection('sanpham').getOne('rctyz63v0bb8r53', {
    expand: 'hamluongvang.ten'
});
 console.log(result)

}
}
</script>

<style>

</style>