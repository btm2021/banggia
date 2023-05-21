<template>
  <div>

    <b-container>
      <div class="logoText">
        <h1>TIỆM VÀNG BẢO PHƯƠNG</h1>
        <h3>Bảng giá <span style="color:red">{{ thisDate }}</span></h3>
      </div>
      <hr />
      <div class="main">
        <b-overlay :show="isReady">
          <b-table class="align-middle" fixed :items="banggia" border id="myTable" style="height:70vh;text-align: center;" sort-by="index" :fields="fields">
            <template  #table-caption>Cập nhật cách đây {{ maxVal }}</template>
            <template #cell(muavao)="item">
              <span class="valueInTable">
                <span
                  @click="changeInput({ name: item.item.name, key: item.item.key, gia: item.item.muavao }, 'giamua')">{{
                    item.item.muavao
                  }}</span>

                <span v-if="item.item.muavao > item.item.muavao_cu">
                  <sup style="color:green;font-size:1rem">↑{{ item.item.muavao - item.item.muavao_cu }}k</sup>
                </span>
                <span v-else>
                  <sub style="color:red;font-size:1rem">↓{{ item.item.muavao_cu - item.item.muavao }}k</sub>
                </span>
              </span>

            </template>
            <template #cell(banra)="item">
              <span class="valueInTable">
                <span
                  @click="changeInput({ name: item.item.name, key: item.item.key, gia: item.item.banra }, 'giaban')">{{
                    item.item.banra
                  }}</span>

                <span v-if="item.item.banra > item.item.banra_cu">
                  <sup style="color:green;font-size:1rem">↑{{ item.item.banra - item.item.banra_cu }}k</sup>
                </span>
                <span v-else>
                  <sub style="color:red;font-size:1rem">↓{{ item.item.banra_cu - item.item.banra }}k</sub>
                </span>

              </span>


            </template>
            <template #cell(name)="item">
              <span class="valueInTable">
{{ item.item.name }}
              </span>
            </template>
          </b-table>

        </b-overlay>
      </div>
    </b-container>

  </div>
</template>

<script>
export default {
  data() {
    return {
      thisDate: null,
      banggia: [],
      maxVal: 0,
      fields: [
        {
          key: "name",
          label: "Loại"
        },
        {
          key: "muavao",
          label: "Mua"
        },
        {
          key: "banra",
          label: "Bán"
        }
      ],
      rootURL: 'https://database.deta.sh/v1/c0sqkszrljw/banggiatv',
      key: 'c0sqkszrljw_EAdPYDikKStoFZvMRSS3XRL142sq8AxV',
      isReady: true,
      reloadTime:10,
      runTime:0
    }

  },
  methods: {
    calcDiffDate(firstDate,secondDate) {
      var today = new Date(firstDate);
      var Christmas = new Date(secondDate);
      var diffMs = (Christmas - today); // milliseconds between now & Christmas
     
      var diffDays = Math.floor(diffMs / 86400000); // days
      var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
      console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes");
      return {diffDays,diffHrs,diffMins}
    },
    changeInput(item, action) {
      let val = prompt(`Giá Mới ${(action === 'giamua' ? "Mua Vào" : "Bán ra")} ${item.name} là :`)
      if(val){

        this.updateValue(val, item.gia, item.key, action)
      }
    },
    getValue() {
      this.runTime++;
      console.log("run "+this.runTime)
      this.isReady = true
      fetch(this.rootURL + "/query", {
        method: 'post',
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.key
        },

      }).then(data => data.json()).then(data => {
        this.banggia = data.items
        this.isReady = false;
        let maxVal = 0
        this.banggia.forEach(i => {
          if (i.updateTime > maxVal) {
            maxVal = i.updateTime
          }
        })
       let diffTime = this.calcDiffDate(maxVal,(new Date()).getTime())
       this.maxVal=diffTime.diffDays + " ngày, " + diffTime.diffHrs + " giờ, " + diffTime.diffMins + " phút"
       setTimeout(()=>{
      this.getValue()
      },1000*this.reloadTime)
       if(diffTime.diffMins<10){
        this.$bvToast.toast(`Bảng giá đã thay đổi cách đây ${this.maxVal}`, {
          title: 'Giá thay đổi',
          autoHideDelay: 10000,
       
          variant:'warning'
        })
       }
      
      })
    
    },
    updateValue(newVal, oldVal, id, action) {
      newVal = parseInt(newVal)
      oldVal = parseInt(oldVal)
      this.isReady = true
      let query = {

      }
      if (action === "giamua") {
        query.set = {
          "muavao_cu": oldVal,
          "muavao": newVal,
          "updateTime": (new Date()).getTime()
        }
      } else {
        query.set = {
          "banra_cu": oldVal,
          "banra": newVal,
          "updateTime": (new Date()).getTime()
        }
      }
      console.log(query)
      fetch(this.rootURL + "/items/" + id, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.key
        },
        body: JSON.stringify(query)

      }).then(data => data.json()).then(data => {
        this.getValue()
      })
    },
  
  },
  mounted() {
    let newDate = new Date();
    this.thisDate = `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`
    this.getValue()
   
  },
  name: "IndexPage",
}
</script>
<style scoped>
.logoText {
  text-align: center !important;
  margin-top: 2rem;
}

.main table th,
.main table td {
  vertical-align: middle !important;
}

.valueInTable {
  color: red;
  padding: 0px !important;
  font-size: 3rem;
  font-weight: 900;
}
#myTable > tbody > tr > td {
     vertical-align: middle !important;
}
#myTable.vertical-align > tbody > tr > td {
  display: flex;
  align-items: center; vertical-align: middle !important;

}
</style>
