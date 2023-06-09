<template>
  <div>
    bb
  </div>
</template>

<script>

export default {

  async mounted() {
    //thiết lập realtime cho bảng giá
    this.initRealtimeDB();

  },
  methods: {
    initRealtimeDB(){
      //bảng giá
      this.$pocketbase.collection('banggia').subscribe('*',  (e) =>{
      this.makeToast("Bảng giá thay đổi","success")
    });
    //hóa đơn
    this.$pocketbase.collection('hoadon').subscribe('*',  (e) =>{
      console.log(e)
      let str=''
  
      if(e.action==="create"){
        str=`[ĐƠN MỚI] - có 1 hóa đơn mới được tạo với mã số  #${e.record.collectionId}, nội dung chi tiết vui lòng theo link`
        this.makeToast("Có hóa đơn mới","success")
      }else if(e.action==='update '){
        str=`[ĐỔI TRẢ] - hóa đơn #${e.record.collectionId} vừa đánh dấu là đổi trả, nội dung chi tiết vui lòng theo link ` 
      }
  
      this.makeToast(str,'primary')
    });
    //tem
    console.log('* thiết lập realtime SSE tới Server')
    },
    makeToast(msg, variant) {
      this.$bvToast.toast(msg, {
        title: 'Thông  báo',
        autoHideDelay: 20000,
        appendToast: true,
        variant
      })
    }
  }
}
</script>

<style></style>