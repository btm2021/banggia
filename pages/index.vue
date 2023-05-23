<template>
  <div>

    <div class="mt-0">
      <div class="logoText">

        <b-alert :show="showAlert" variant="warning">

          <b>Giá {{ typeChange }} vừa cập nhật cách đây {{ maxValJustMin }}</b></b-alert>
        <h4>TIỆM VÀNG BẢO PHƯƠNG</h4>
        <h6>Bảng giá <span style="color:red">{{ thisDate }}</span> | ĐVT : 1.000đ</h6>
      </div>
      <div class="main">
     
          <b-table class="align-middle" head-variant="light" fixed :items="banggia" border id="myTable"
            style="height:60vh;text-align: center;" sort-by="index" :fields="fields">
            <template class="align-middle" #table-caption>Cập nhật cách đây {{ maxVal }}</template>
            <template #cell(muavao)="item">
              <span class="valueInTable align-middle">
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
              <span class="valueInTableName">
                {{ item.item.name }}
              </span>
            </template>
          </b-table>

      </div>
    </div>

  </div>
</template>

<script>
//todo auto reload when fail
//check what kind of change
//margin top
export default {
  data() {
    return {
      typeChange: "",
      maxValJustMin: "",
      showAlert: false,
      thisDate: null,
      banggia: [],
      maxVal: 0,
      fields: [
        {
          key: "name",
          label: "Loại vàng",
          tdClass: 'align-middle'
        },
        {
          key: "muavao",
          label: "Giá Mua",
          tdClass: 'align-middle'
        },
        {
          key: "banra",
          label: "Giá Bán",
          tdClass: 'align-middle'
        }
      ],
      rootURL: 'https://database.deta.sh/v1/c0sqkszrljw/banggiatv',
      key: 'c0sqkszrljw_EAdPYDikKStoFZvMRSS3XRL142sq8AxV',
      isReady: true,
      reloadTime: 10,
      runTime: 0
    }

  },
  methods: {
    calcDiffDate(firstDate, secondDate) {
      var today = new Date(firstDate);
      var Christmas = new Date(secondDate);
      var diffMs = (Christmas - today); // milliseconds between now & Christmas

      var diffDays = Math.floor(diffMs / 86400000); // days
      var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
      console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes");
      return { diffDays, diffHrs, diffMins }
    },
    changeInput(item, action) {
      let val = prompt(`Giá Mới ${(action === 'giamua' ? "Mua Vào" : "Bán ra")} ${item.name} là :`)
      if (val) {
        this.updateValue(val, item.gia, item.key, action)
        this.typeChange = item.name
      }
    },
    getValue() {
      this.runTime++;
      console.log("run " + this.runTime)
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
        let diffTime = this.calcDiffDate(maxVal, (new Date()).getTime())
        this.maxVal = diffTime.diffDays + " ngày, " + diffTime.diffHrs + " giờ, " + diffTime.diffMins + " phút"
        this.maxValJustMin = diffTime.diffMins + " phút"
        setTimeout(() => {
          this.getValue()
        }, 1000 * this.reloadTime)
        if (diffTime.diffMins < 10) {
          this.showAlert = true;

        } else {
          this.showAlert = false
        }

      }).catch((error) => {
        console.log(error)
        console.log("Có lỗi xảy ra...")
        //chờ 15s tự load lại
        setTimeout(() => {
          this.getValue()
        }, 1000 * this.reloadTime)
      });

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
}

.main table th,
.main table td {
  vertical-align: middle !important;
}

.valueInTable {
  color: rgb(173, 216, 19);
  padding: 0px !important;
  font-size: 200%;
  font-weight: 900;
}

.valueInTableName {
  padding: 0px !important;
  font-size: 150%;
  font-weight: 500;
}
</style>
