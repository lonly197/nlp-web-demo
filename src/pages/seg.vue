<template>
  <div>
    <mu-card class="card">
       <mu-card-title title="Word segmentation function comparison" subTitle="" />
      <mu-text-field hintText="Please enter the test text" multiLine :rows="6" :rowsMax="10" fullWidth v-model="inputValue" />
      <mu-card-actions>
        <mu-raised-button label="OK" @click="send()" primary/>
      </mu-card-actions>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Hanlp" subTitle="Standord Segment" />
      <mu-card-text>
        <div class="chip-container">
          <mu-chip class="chip" v-for="(item,index) in resultHanlp" :key="index" disabled>
            {{item}}
          </mu-chip>
        </div>
        <p class="chip-span" v-if="timeHanlp" >Take {{timeHanlp}} milliseconds</p>
      </mu-card-text>
      <mu-card-title title="" subTitle="NShort Segment" />
      <mu-card-text>
        <div class="chip-container">
          <mu-chip class="chip" v-for="(item,index) in resultHanlpNS" :key="index" disabled>
            {{item}}
          </mu-chip>
        </div>
        <p class="chip-span" v-if="timeHanlpNS" >Take {{timeHanlpNS}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Thulc" subTitle="" />
      <mu-card-text>
        <div class="chip-container">
          <mu-chip class="chip" v-for="(item,index) in resultThulc" :key="index" disabled>
            {{item}}
          </mu-chip>
        </div>
        <p class="chip-span" v-if="timeThulc" >Take {{timeThulc}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="FNLP" subTitle="" />
      <mu-card-text>
        <div class="chip-container">
          <mu-chip class="chip" v-for="(item,index) in resultFnlp" :key="index" disabled>
            {{item}}
          </mu-chip>
        </div>
        <p class="chip-span" v-if="timeFnlp" >Take {{timeFnlp}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Stanford" subTitle="" />
      <mu-card-text>
        <div class="chip-container">
          <mu-chip class="chip" v-for="(item,index) in resultStanford" :key="index" disabled>
            {{item}}
          </mu-chip>
        </div>
        <p class="chip-span" v-if="timeStanford" >Take {{timeStanford}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="FudanDNN" subTitle="" />
      <mu-card-text>
        <div class="chip-container">
          <mu-chip class="chip" v-for="(item,index) in resultFudan" :key="index" disabled>
            {{item}}
          </mu-chip>
        </div>
        <p class="chip-span" v-if="timeFudan" >Take {{timeFudan}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Boson" subTitle="" />
      <mu-card-text>
        <div class="chip-container">
          <mu-chip class="chip" v-for="(item,index) in resultBoson" :key="index" disabled>
            {{item}}
          </mu-chip>
        </div>
        <p class="chip-span" v-if="timeBoson" >Take {{timeBoson}} milliseconds</p>
      </mu-card-text>
    </mu-card>
  </div>
</template>

<script>
  import { HTTP } from '../utils/http-common';
  var qs = require('qs');

  export default {
    name: 'seg',
    data() {
      return {
        inputValue: '',
        resultHanlp: [],
        resultHanlpNS: [],
        resultThulc: [],
        resultFnlp: [],
        resultStanford: [],
        resultFudan: [],
        resultBoson: [],
        timeHanlp: null,
        timeHanlpNS: null,
        timeThulc: null,
        timeFnlp: null,
        timeStanford: null,
        timeFudan: null,
        timeBoson: null
      }
    },
    methods: {
      send() {
        this.hanlpSeg();
        this.hanlpSegNShort();
        this.thulcSeg();
        this.fnlpSeg();
        this.stanfordSeg();
        this.fudanSeg();
        this.bosonSeg();
      },
      hanlpSeg() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/seg/hanlp', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.resultHanlp = response.data;
          self.timeHanlp = Date.now() - start;
        })
          .catch(function (error) {
            self.resultHanlp = [];
            self.timeHanlp = null;
          });
      },
      hanlpSegNShort() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/seg/hanlpnshort', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.resultHanlpNS = response.data;
          self.timeHanlpNS = Date.now() - start;
        })
          .catch(function (error) {
            self.resultHanlpNS = [];
            self.timeHanlpNS = null;
          });
      },
      thulcSeg() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/seg/thulc', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.resultThulc = response.data;
          self.timeThulc = Date.now() - start;
        })
          .catch(function (error) {
            self.resultThulc = [];
            self.timeThulc = null;
          });
      },
      fnlpSeg() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/seg/fnlp', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.resultFnlp = response.data;
          self.timeFnlp = Date.now() - start;
        })
          .catch(function (error) {
            self.resultFnlp = [];
            self.timeFnlp = null;
          });
      },
      stanfordSeg() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/seg/stanford', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.resultStanford = response.data;
          self.timeStanford = Date.now() - start;
        })
          .catch(function (error) {
            self.resultStanford = [];
            self.timeStanford = null;
          });
      },
      fudanSeg() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/seg/fudan', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.resultFudan = response.data;
          self.timeFudan = Date.now() - start;
        })
          .catch(function (error) {
            self.resultFudan = [];
            self.timeFudan = null;
          });
      },
      bosonSeg() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/seg/boson', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.resultBoson = response.data;
          self.timeBoson = Date.now() - start;
        })
          .catch(function (error) {
            self.resultFudan = [];
            self.timeBoson = null;
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
    color:rgba(255, 255, 255, 0.54);
    font-size:12px;
    text-align: right;
  }
</style>
