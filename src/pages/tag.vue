<template>
  <div>
    <mu-card class="card">
      <mu-card-title title="POS tagging function comparison" subTitle="" />
      <mu-text-field hintText="Please enter the test text" multiLine :rows="6" :rowsMax="10" fullWidth v-model="inputValue" />
      <mu-card-actions>
        <mu-raised-button label="OK" @click="send()" primary/>
      </mu-card-actions>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Hanlp" subTitle="Standord PosTagger" />
      <mu-card-text>
        <mu-row gutter>
          <mu-col width="500" tablet="80" desktop="80">
            <mu-chip class="chip" v-for="(item,index) in hanlp.word" :key="index" :backgroundColor="colors[uniq(hanlp.tag).indexOf(hanlp.tag[index])]" disabled>
              {{item}}
            </mu-chip>
          </mu-col>
          <mu-col width="500" tablet="20" desktop="20">
            <mu-chip class="chip" v-for="(item,index) in uniq(hanlp.tag)" :key="index" :backgroundColor="colors[index]" disabled>
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
            <mu-chip class="chip" v-for="(item,index) in fudan.word" :key="index" :backgroundColor="colors[uniq(fudan.tag).indexOf(fudan.tag[index])]" disabled>
              {{item}}
            </mu-chip>
          </mu-col>
          <mu-col width="500" tablet="20" desktop="20">
            <mu-chip class="chip" v-for="(item,index) in uniq(fudan.tag)" :key="index" :backgroundColor="colors[index]" disabled>
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
            <mu-chip class="chip" v-for="(item,index) in boson.word" :key="index" :backgroundColor="colors[uniq(boson.tag).indexOf(boson.tag[index])]" disabled>
              {{item}}
            </mu-chip>
          </mu-col>
          <mu-col width="500" tablet="20" desktop="20">
            <mu-chip class="chip" v-for="(item,index) in uniq(boson.tag)" :key="index" :backgroundColor="colors[index]" disabled>
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
    name: 'tag',
    data() {
      return {
        inputValue: '',
        hanlp: {
          word: [],
          tag: [],
          time: null
        },
        fudan: {
          word: [],
          tag: [],
          time: null
        },
        boson: {
          word: [],
          tag: [],
          time: null
        },
        colors: ['red500', 'indigo500', 'teal500', 'yellow800', 'brown500', 'pink500', 'blue500', 'green500', 'deepPurple500', 'cyan500', 'blueGrey500', 'purple500', 'lightBlue500', 'llime700', 'orange500', 'grey500', 'amber500']
      }
    },
    methods: {
      send() {
        this.hanlpTag();
        this.fudanTag();
        this.bosonTag();
      },
      hanlpTag() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/tag/hanlp', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.hanlp = Object.assign(response.data, { time: (Date.now() - start) });
        })
          .catch(function (error) {
            console.log(error);
            self.hanlp = [[], [], null];
          });
      },
      fudanTag() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/tag/fudan', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.fudan = Object.assign(response.data, { time: (Date.now() - start) });
        })
          .catch(function (error) {
            console.log(error);
            self.fudan = [[], [], null];
          });
      },
      bosonTag() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/tag/boson', qs.stringify({ text: this.inputValue })).then(function (response) {
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
