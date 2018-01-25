<template>
  <div>
    <mu-card class="card">
      <mu-card-title title="问答对话Demo" subTitle="" />
      <mu-text-field hintText="Please enter the test text" multiLine :rows="6" :rowsMax="10" fullWidth v-model="inputValue" />
      <mu-card-actions>
        <mu-raised-button label="OK" @click="send()" primary/>
      </mu-card-actions>
    </mu-card>
    <mu-card class="card">
      <!-- <mu-card-title title="FudanDNN 4.0" subTitle="" /> -->
      <mu-card-text>
        {{fudan.text}}
        <p class="chip-span" v-if="fudan.time">Take {{fudan.time}} milliseconds</p>
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
        fudan: {
          text: null,
          time: null
        }
      }
    },
    methods: {
      send() {
        this.fudanDialog();
      },
      fudanDialog() {
        const self = this;
        const start = Date.now();
        HTTP.post('api/dialog/fudan', qs.stringify({ text: self.inputValue })).then(function (response) {
          self.fudan = { text: response.data, time: (Date.now() - start) };
        })
          .catch(function (error) {
            console.log(error);
            self.fudan = [null, null];
          });
      },
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
