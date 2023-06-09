<template>
  <div>
bb
  </div>
</template>

<script>

export default {
  layout: 'blog',
  async mounted(){
  
    debugger
  let result = await $pocketbase.collection('sanpham').getOne('rctyz63v0bb8r53', {
    expand: 'hamluongvang.ten'
});
 console.log(result)

}
}
</script>

<style>

</style>