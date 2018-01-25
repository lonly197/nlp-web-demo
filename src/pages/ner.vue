<template>
  <div>
    <mu-card class="card">
      <mu-card-title title="Named Entity Recognition function comparison" subTitle="" />
      <mu-text-field hintText="Please enter the test text" multiLine :rows="6" :rowsMax="10" fullWidth v-model="inputValue" />
      <mu-card-actions>
        <mu-raised-button label="OK" @click="send()" primary/>
      </mu-card-actions>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Hanlp" subTitle="Standord NER" />
      <mu-card-text>
        <mu-row gutter>
          <mu-col width="500" tablet="80" desktop="80">
            <mu-chip class="chip" v-for="(item,index) in hanlp.word" :key="index" :backgroundColor="getBGColor(index,hanlp.entity)" disabled>
              {{item}}
            </mu-chip>
          </mu-col>
          <mu-col width="500" tablet="20" desktop="20">
            <mu-chip class="chip" v-for="(item,index) in uniqEntyty(hanlp.entity)" :key="index" :backgroundColor="colors[index]" disabled>
              {{item}}
            </mu-chip>
          </mu-col>
        </mu-row>
        <p class="chip-span" v-if="hanlp.time">Take {{hanlp.time}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="FudanDNN" subTitle="" />
      <mu-card-text>
        <mu-row gutter>
          <mu-col width="500" tablet="80" desktop="80">
            <mu-chip class="chip" v-for="(item,index) in fudan.word" :key="index" :backgroundColor="getBGColor(index,fudan.entity)" disabled>
              {{item}}
            </mu-chip>
          </mu-col>
          <mu-col width="500" tablet="20" desktop="20">
            <mu-chip class="chip" v-for="(item,index) in uniqEntyty(fudan.entity)" :key="index" :backgroundColor="colors[index]" disabled>
              {{item}}
            </mu-chip>
          </mu-col>
        </mu-row>
        <p class="chip-span" v-if="fudan.time">Take {{fudan.time}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Boson" subTitle="" />
      <mu-card-text>
        <mu-row gutter>
          <mu-col width="500" tablet="80" desktop="80">
            <mu-chip class="chip" v-for="(item,index) in boson.word" :key="index" :backgroundColor="getBGColor(index,boson.entity)" disabled>
              {{item}}
            </mu-chip>
          </mu-col>
          <mu-col width="500" tablet="20" desktop="20">
            <mu-chip class="chip" v-for="(item,index) in uniqEntyty(boson.entity)" :key="index" :backgroundColor="colors[index]" disabled>
              {{item}}
            </mu-chip>
          </mu-col>
        </mu-row>
        <p class="chip-span" v-if="boson.time">Take {{boson.time}} milliseconds</p>
      </mu-card-text>
    </mu-card>
  </div>
</template>

<script>
  import { HTTP } from '../utils/http-common';
  var qs = require('qs');

  export default {
    name: 'ner',
    data() {
      return {
        inputValue: '',
        hanlp: {
          word: [],
          entity: [],
          time: null
        },
        fudan: {
          word: [],
          entity: [],
          time: null
        },
        boson: {
          word: [],
          entity: [],
          time: null
        },
        colors: ['red500', 'indigo500', 'teal500', 'yellow800', 'brown500', 'pink500', 'blue500', 'green500', 'deepPurple500', 'cyan500', 'blueGrey500', 'purple500', 'lightBlue500', 'llime700', 'orange500', 'amber500']
      }
    },
    methods: {
      send() {
        this.hanlpNer();
        this.fudanNer();
        this.bosonNer();
      },
      hanlpNer() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/ner/hanlp', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.hanlp = Object.assign(response.data, { time: (Date.now() - start) });
        })
          .catch(function (error) {
            console.log(error);
            self.hanlp = [[], [], null];
          });
      },
      fudanNer() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/ner/fudan', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.fudan = Object.assign(response.data, { time: (Date.now() - start) });
        })
          .catch(function (error) {
            console.log(error);
            self.fudan = [[], [], null];
          });
      },
      bosonNer() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/ner/boson', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.boson = Object.assign(response.data, { time: (Date.now() - start) });
        })
          .catch(function (error) {
            console.log(error);
            self.boson = [[], [], null];
          });
      },
      uniq(arrArg) {
        return arrArg.filter((elem, pos, arr) => {
          return arr.indexOf(elem) == pos;
        });
      },
      flatten(arr) {
        return Array.prototype.concat(...Array.prototype.concat(...arr[2]));
      },
      uniqEntyty(enties) {
        return this.uniq(enties.map(elem => elem[2]).filter(elem => elem !== ''));
      },
      getBGColor(index, enties) {
        const entitySet = this.uniqEntyty(enties);
        const nature = enties.find(elem=>elem[0]==index)?enties.find(elem=>elem[0]==index)[2]:"";
        return enties.find((elem) => elem[0] == index) ? this.colors[entitySet.findIndex(elem => elem == nature)] : ""
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
</style>
