<template>
  <div>
    <mu-card class="card">
      <mu-card-title title="Automatic summary function comparison" subTitle="" />
      <mu-text-field hintText="Please enter the test text" multiLine :rows="6" :rowsMax="10" fullWidth v-model="inputValue" />
      <mu-card-actions>
        <mu-raised-button label="OK" @click="send()" primary/>
        <p class="chip-span">
          <mu-sub-header>Summary Percent: {{percent * 100}}%</mu-sub-header>
          <mu-slider class="slider" v-model="percent" :step="0.1" :min="0.1" :max="1" @input="send()" />
        </p>
      </mu-card-actions>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Hanlp+TextRank" subTitle="" />
      <mu-card-text>
        {{hanlp.text}}
        <p class="chip-span" v-if="hanlp.time">Take {{hanlp.time}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Hanlp+SentenceTextRank" subTitle="" />
      <mu-card-text>
        {{hanlpsent.text}}
        <p class="chip-span" v-if="hanlpsent.time">Take {{hanlpsent.time}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="MMR+ClusterWord" subTitle="" />
      <mu-card-text>
        {{mmrcluster.text}}
        <p class="chip-span" v-if="mmrcluster.time">Take {{mmrcluster.time}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="MMR+Texttears" subTitle="" />
      <mu-card-text>
        {{mmrtexttears.text}}
        <p class="chip-span" v-if="mmrtexttears.time">Take {{mmrtexttears.time}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Boson" subTitle="" />
      <mu-card-text>
        {{boson.text}}
        <p class="chip-span" v-if="boson.time">Take {{boson.time}} milliseconds</p>
      </mu-card-text>
    </mu-card>
  </div>
</template>

<script>
  import { HTTP } from '../utils/http-common';
  var qs = require('qs');

  export default {
    name: 'Summary',
    data() {
      return {
        inputValue: '',
        percent: 0.3,
        hanlp: {
          text: null,
          time: null
        },
        hanlpsent: {
          text: null,
          time: null
        },
        mmrcluster: {
          text: null,
          time: null
        },
        mmrtexttears: {
          text: null,
          time: null
        },
        boson: {
          text: null,
          time: null
        }
      }
    },
    methods: {
      send() {
        this.hanlpSummary();
        this.hanlpsentSummary();
        this.bosonSummary();
        this.mmrclusterSummary();
        this.mmrtexttearsSummary();
      },
      hanlpSummary() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/summary/hanlp', qs.stringify({ text: self.inputValue, percent: self.percent })).then(function (response) {
          self.hanlp = { text: response.data, time: (Date.now() - start) };
        })
          .catch(function (error) {
            console.log(error);
            self.hanlp = [null, null];
          });
      },
      hanlpsentSummary() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/summary/hanlpsent', qs.stringify({ text: self.inputValue, percent: self.percent })).then(function (response) {
          self.hanlpsent = { text: response.data, time: (Date.now() - start) };
        })
          .catch(function (error) {
            console.log(error);
            self.hanlpsent = [null, null];
          });
      },
      mmrclusterSummary() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/summary/mmrcluster', qs.stringify({ text: self.inputValue, percent: self.percent })).then(function (response) {
          self.mmrcluster = { text: response.data, time: (Date.now() - start) };
        })
          .catch(function (error) {
            console.log(error);
            self.mmrcluster = [null, null];
          });
      },
      mmrtexttearsSummary() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/summary/mmrtexttears', qs.stringify({ text: self.inputValue, percent: self.percent })).then(function (response) {
          self.mmrtexttears = { text: response.data, time: (Date.now() - start) };
        })
          .catch(function (error) {
            console.log(error);
            self.mmrtexttears = [null, null];
          });
      },
      bosonSummary() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/summary/boson', qs.stringify({ text: self.inputValue, percent: self.percent })).then(function (response) {
          self.boson = { text: response.data, time: (Date.now() - start) };
        })
          .catch(function (error) {
            console.log(error);
            self.hanlp = [null, null];
          });
      }
    }

  }

</script>

<style scoped>
  .card {
    padding: 20px 20px 20px 20px;
  }
  .chip-container {
    display: flex;
    flex-wrap: wrap;
  }
  .chip {
    margin: 4px;
  }
  .chip-span {
    color: rgba(255, 255, 255, 0.54);
    font-size: 12px;
    text-align: right;
  }
  .slider {
    width: 280px;
    float: right;
  }
</style>
