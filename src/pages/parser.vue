<template>
  <div>
    <mu-card class="card">
      <mu-card-title title="Dependent syntactic analysis function comparison comparison" subTitle="" />
      <mu-text-field hintText="Please enter the test text" multiLine :rows="6" :rowsMax="10" fullWidth v-model="inputValue" />
      <mu-card-actions>
        <mu-raised-button label="OK" @click="send()" primary/>
      </mu-card-actions>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Hanlp" subTitle="Neural Network Dependency Parser" />
      <mu-card-text>
        <div ref="hanlp" class="parser-container"></div>
        <p class="chip-span" v-if="time.hanlp">Take {{time.hanlp}} milliseconds</p>
      </mu-card-text>
      <mu-card-title title="" subTitle="CRF Dependency Parser" />
      <mu-card-text>
        <div ref="hanlpcrf" class="parser-container"></div>
        <p class="chip-span" v-if="time.hanlpcrf">Take {{time.hanlpcrf}} milliseconds</p>
      </mu-card-text>
      <mu-card-title title="" subTitle="MaxEnt Dependency Parser" />
      <mu-card-text>
        <div ref="hanlpme" class="parser-container"></div>
        <p class="chip-span" v-if="time.hanlpme">Take {{time.hanlpme}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Stanford" subTitle="" />
      <mu-card-text>
        <div ref="stanford" class="parser-container"></div>
        <p class="chip-span" v-if="time.stanford">Take {{time.stanford}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Baidu" subTitle="" />
      <mu-card-text>
        <div ref="baidu" class="parser-container"></div>
        <p class="chip-span" v-if="time.baidu">Take {{time.baidu}} milliseconds</p>
      </mu-card-text>
    </mu-card>
    <mu-card class="card">
      <mu-card-title title="Boson" subTitle="" />
      <mu-card-text>
        <div ref="boson" class="parser-container"></div>
        <p class="chip-span" v-if="time.boson">Take {{time.boson}} milliseconds</p>
      </mu-card-text>
    </mu-card>
  </div>
</template>

<script>
  import { HTTP } from '../utils/http-common';
  import GDepParser from '../utils/depparser';
  const qs = require('qs');

  export default {
    name: 'parser',
    data() {
      return {
        inputValue: '',
        time: {
          hanlp: null,
          hanlp_crf: null,
          hanlp_me: null,
          stanford: null,
          boson: null,
          baidu: null
        },
        colors: ['red500', 'indigo500', 'teal500', 'yellow800', 'brown500', 'pink500', 'blue500', 'green500', 'deepPurple500', 'cyan500', 'blueGrey500', 'purple500', 'lightBlue500', 'llime700', 'orange500', 'amber500']
      }
    },
    methods: {
      send() {
        this.stanfordParser();
        this.hanlpParser();
        this.hanlpcrfParser();
        this.hanlpmeParser();
        this.bosonParser();
        this.baiduParser();
      },
      hanlpParser() {
        const self = this;
        self.$refs['hanlp'].innerHTML = null;
        const start = Date.now();
        HTTP.post('api/parser/hanlp', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.time['hanlp'] = (Date.now() - start);
          self.$refs['hanlp'].appendChild(GDepParser(self.toNodeList(response.data)));
        })
          .catch(function (error) {
            console.log(error);
            self.time['hanlp'] = null
            self.$refs['hanlp'].innerHTML = null;
          });
      },
      hanlpcrfParser() {
        const self = this;
        self.$refs['hanlpcrf'].innerHTML = null;
        const start = Date.now();
        HTTP.post('api/parser/hanlpcrf', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.time['hanlpcrf'] = (Date.now() - start);
          self.$refs['hanlpcrf'].appendChild(GDepParser(self.toNodeList(response.data)));
        })
          .catch(function (error) {
            console.log(error);
            self.time['hanlpcrf'] = null
            self.$refs['hanlpcrf'].innerHTML = null;
          });
      },
      hanlpmeParser() {
        const self = this;
        self.$refs['hanlpme'].innerHTML = null;
        const start = Date.now();
        HTTP.post('api/parser/hanlpme', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.time['hanlpme'] = (Date.now() - start);
          self.$refs['hanlpme'].appendChild(GDepParser(self.toNodeList(response.data)));
        })
          .catch(function (error) {
            console.log(error);
            self.time['hanlpme'] = null
            self.$refs['hanlpme'].innerHTML = null;
          });
      },
      stanfordParser() {
        const self = this;
        self.$refs['stanford'].innerHTML = null;
        const start = Date.now();
        HTTP.post('api/parser/stanford', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.time['stanford'] = (Date.now() - start);
          self.$refs['stanford'].appendChild(GDepParser(self.toNodeList(response.data).slice(0,42)));
        })
          .catch(function (error) {
            console.log(error);
            self.time['stanford'] = null;
            self.$refs['stanford'].innerHTML = null;
          });
      },
      bosonParser() {
        const self = this;
        self.$refs['boson'].innerHTML = null;
        const start = Date.now();
        HTTP.post('api/parser/boson', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.time['boson'] = (Date.now() - start);
          self.$refs['boson'].appendChild(GDepParser(self.toNodeList(response.data)));
        })
          .catch(function (error) {
            console.log(error);
            self.time['boson'] = null;
            self.$refs['boson'].innerHTML = null;
          });
      },
      baiduParser() {
        const self = this;
        self.$refs['baidu'].innerHTML = null;
        const start = Date.now();
        HTTP.post('api/parser/baidu', qs.stringify({ text: this.inputValue })).then(function (response) {
          self.time['baidu'] = (Date.now() - start);
          // console.log(response.data);
          // console.log(self.toNodeList(response.data));
          self.$refs['baidu'].appendChild(GDepParser(self.toNodeList(response.data)));
        })
          .catch(function (error) {
            console.log(error);
            self.time['baidu'] = null;
            self.$refs['baidu'].innerHTML = null;
          });
      },
      toNodeList(data) {
        let node_list = [];
        for (let index in data.word) {
          node_list.push({
            id: parseInt(index),
            fid: parseInt(data.head[index]),
            word: data.word[index],
            post: data.tag[index],
            dep_type: data.role[index]
          })
        }
        return node_list;
      }
    }

  }

</script>

<style scoped>
  .card {
    padding: 20px 20px 20px 20px;
  }
  .parser-container {
    overflow:scroll;
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
