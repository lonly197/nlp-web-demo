<template>
  <div class="layout">
    <div class="header">
      <div class="logo">
        NLP DEMO
      </div>
      <div class="nav">
        <mu-tabs :value="activeTab" @change="handleTabChange" class="tab">
          <mu-tab value="home" title="Home"  class="tab-button"/>
          <mu-tab value="seg" title="Segment" class="tab-button"/>
          <mu-tab value="tag" title="PosTagger" class="tab-button"/>
          <mu-tab value="ner" title="NER" class="tab-button"/>
          <mu-tab value="summary" title="Summary" class="tab-button"/>
          <mu-tab value="parser" title="Depparser" class="tab-button"/>
          <mu-tab value="dialog" title="Dialog" class="tab-button"/>
        </mu-tabs>
      </div>
    </div>
    <div class="content">
      <div class="body">
        <div v-if="activeTab === 'home'" class="breadcrumb">
          <mu-card class="card">
            <mu-card-title title="Home" subTitle="" />
              <mu-card-text>
                  This project integrates multiple NLP tools such as Stanford, Hanlp, FNLP, Thulc, FudanDNN, Boson NLP and Jieba to compare their performance and accuracy.
              </mu-card-text>
            </mu-card>
        </div>
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <div class="footer">
      NLP DEMO ©2018 Created by Lonly
    </div>

  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      activeTab: "home"
    };
  },
  methods: {
    handleTabChange(val) {
      this.activeTab = val;
      this.$router.push(`/${val}`);
    }
  }
};
</script>
<style scoped>
/* .layout {
        background-color: rgb(236, 236, 236);
      } */

.header {
  background-color: #1976d2;
}

.logo {
  font-size: 24px;
  color: white;
  display: inline-block;
  padding: 10px 20px;
}

.nav {
  display: inline-block;
  width: 80%;
  margin: 0 auto;
}

.tab {
  margin: 0 auto;
  width: 80%;
  background-color: rgba(0, 0, 0, 0);
}

.tab-button {
  font-size: 18px;
}

.content {
  width: 90%;
  margin: 0 auto;
}

.breadcrumb {
  margin: 20px 0;
}

.body {
  /* color: black;
        background-color: white; */
  border-radius: 5px;
  min-height: 800px;
}

.footer {
  padding: 20px 0;
  text-align: center;
}
</style>
