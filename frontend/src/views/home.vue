<template>
  <div class="wrapper">
    <router-link class="title" to="/bingo">DionInsanity's Barrows Bingo</router-link>
    <div class="settings">
      <select class="player__select" name="player_id" @change="loadPlayerData($event)" v-model="selected_player">
        <option v-for="player in player_names" :key="player.id" :value="player.name">
          {{ player.name }}
        </option>
      </select>
    </div>
    <div class="bingo" v-if="!loading">
      <div class="bingo__cell" v-for="element in layout" :key="element" :class="{ 'bingo__cell--checked': this.user_loot_amount(element) > 0 }" @click="increaseLoot(element)" @contextmenu.prevent="decreaseLoot(element)">
        <div class="bingo__cell__content" :title="element">
          <img class="bingo__cell__content__img" :src="require(`@/assets/${element}.png`)" :alt="element"/>
          <span class="bingo__cell__content__text-amount" v-if="this.user_loot_amount(element) > 1">{{this.user_loot_amount(element)}}</span>
          <span class="bingo__cell__content__text-bonus" v-if="bonus_layout.includes(element)">+1</span>
        </div>
      </div>
    </div>
    <div class="scores__container" v-if="!loading">
      <span>Unique Score: {{score.unique_score}}</span>
      <span>Duplicate Score: {{score.duplicate_score}}</span>
      <span>Bonus Score: {{score.bonus_score}}</span>
      <span>Row Score: {{score.row_score}}</span>
      <span>Total Score: {{score.total_score}}</span>
    </div>
    <button @click.prevent="() => { this.$router.go() }">Calculate Score</button>
    <div class="bingo loading" v-if="loading">
      <div class="bingo__cell loading fade-in" v-for="index in 25" :key="index">
        <div class="bingo__cell__loading"/>
      </div>
    </div>
    <div class="rules">
      <h3>Rules:</h3>
      <span>Every unique item is worth 2 points, duplicates count as 1 point.</span>
      <span>Every row is worth 5 points (Horizontal and Vertical ONLY)</span>
      <span>Specific items give a point extra (shown by +1, can only be obtained ONCE)</span>
      <span>Start: Friday September 16th 2022 at 9PM CET</span>
      <span>End: Friday September 23rd 2022 at 9PM CET</span>
      <span>2.5m Buy-in! There will be 1st, 2nd, 3rd place and constellation prices.</span>
      <span>MAX 150 caskets within the week. Verify your chests by posting a screenshot in the discord!</span>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import axios from "axios";

export default {
  name: "home",
  data () {
    return {
      selected_player: "DionInsanity"
    }
  },
  methods: {
    increaseLoot(element) {
      this.loading = true;
      axios.post(`http://localhost:3000/player/${this.selected_player}/add/${element}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
          .then(response => {
            this.user_loot = response.data.player.loot;
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    decreaseLoot(element) {
      this.loading = true;
      axios.post(`http://localhost:3000/player/${this.selected_player}/remove/${element}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
          .then(response => {
            this.user_loot = response.data.player.loot;
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    user_loot_amount(element) {
      return this.user_loot[element] ? this.user_loot[element].amount : 0;
    },
    loadPlayerData(event) {
      this.loading = true;
      axios.get(`http://localhost:3000/player/${event.target.value}`)
          .then(response => {
            this.user_loot = response.data.player.loot;
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            this.loading = false;
          });
    }
  },
  setup () {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const player_names = ref(null);

    const user_loot = ref(null);

    const layout = ref(null);
    const bonus_layout = ref(null);

    const score = ref(null);

    async function fetchUserLoot(user_name) {
      loading.value = true
      data.value = await axios.get(`http://localhost:3000/player/${user_name}`)
          .then(response => {
            loading.value = false
            return response.data
          })
          .catch(err => {
            loading.value = false
            error.value = err
          });
      user_loot.value = data.value.player.loot;
    }

    async function fetchGeneralBingoCard() {
      loading.value = true
      data.value = await axios.get('http://localhost:3000/generalbingocard')
          .then(response => {
            loading.value = false
            return response.data
          })
          .catch(err => {
            loading.value = false
            error.value = err
          });
      layout.value = data.value.generalBingoCard[0].layout.split(',');
      bonus_layout.value = data.value.generalBingoCard[0].bonus_layout.split(',');
    }

    async function fetchAllPlayerNames() {
      loading.value = true
      data.value = await axios.get('http://localhost:3000/player/names')
          .then(response => {
            loading.value = false
            return response.data
          })
          .catch(err => {
            loading.value = false
            error.value = err
          });
      player_names.value = data.value.player;
    }

    async function calculateGeneralScore() {
      let unique_score = 0;
      let duplicate_score = 0;
      let bonus_score = 0;

      // Calculate the loot score
      for (const loot_item in user_loot.value) {
        if (user_loot.value[loot_item].amount > 0) {
          unique_score += 2;
          duplicate_score += user_loot.value[loot_item].amount - 1;
          if (bonus_layout.value.includes(loot_item)) {
            bonus_score += 1;
          }
        }
      }

      // Calculate the row score
      let row_score = 0;

      // Horizontal
      for (let i = 0; i < 5; i++) {
        let row = layout.value.slice(i * 5, i * 5 + 5);
        let row_score_temp = 0;
        for (const loot_item in user_loot.value) {
          if (user_loot.value[loot_item].amount > 0) {
            if (row.includes(loot_item)) {
              row_score_temp += 1;
            }
          }
        }
        if (row_score_temp === 5) {
          row_score += 5;
        }
      }

      // Vertical
      for (let i = 0; i < 5; i++) {
        let row = [];
        for (let j = 0; j < 5; j++) {
          row.push(layout.value[i + j * 5]);
        }
        let row_score_temp = 0;
        for (const loot_item in user_loot.value) {
          if (user_loot.value[loot_item].amount > 0) {
            if (row.includes(loot_item)) {
              row_score_temp += 1;
            }
          }
        }
        if (row_score_temp === 5) {
          row_score += 5;
        }
      }

      // Calculate the total score
      const total_score = unique_score + duplicate_score + bonus_score + row_score;

      score.value = {
        'unique_score': unique_score,
        'duplicate_score': duplicate_score,
        'bonus_score': bonus_score,
        'row_score': row_score,
        'total_score': total_score
      };
    }

    onMounted(async () => {
      await fetchUserLoot('DionInsanity')
      await fetchGeneralBingoCard()
      await fetchAllPlayerNames()
      await calculateGeneralScore()
    })

    return { loading, error, user_loot, layout, bonus_layout, player_names, score }
  },
  computed: {

  }
}
</script>

<style scoped>
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    text-align: center;
  }
  .settings {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 100%;
    text-align: center;
    margin: 1em 0;
  }
  .bingo {
    display: grid;
    position: relative;
    width: fit-content;
    min-height: fit-content;
    min-width: fit-content;
    max-height: fit-content;
    max-width: fit-content;
    grid-gap: 0;
    grid-template-columns: repeat(5, 1fr);
    border: .2em black solid;
    /*noinspection CssUnknownTarget*/
    background-image: url("~@/assets/dion_logo.png");
    background-size: 100% auto;
  }
  .bingo__cell {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    max-width: 15vh;
    max-height: 15vh;
    border: .2em black solid;
    cursor: pointer;
  }
  .bingo__cell__content {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: .5em;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 35%);
  }
  .bingo__cell__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: .5em;
    width: 15vh;
    height: 15vh;
    background: rgba(0, 0, 0, 35%);
    -webkit-animation: pulsate-bck 1s ease-in-out infinite both;
    animation: pulsate-bck 1s ease-in-out infinite both;
  }
  .bingo__cell__content__img {
    margin: auto;
    position: relative;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    -webkit-filter: drop-shadow(3px 3px 0 black)
    drop-shadow(-1px -1px 0 black);
    filter: drop-shadow(3px 3px 0 black)
    drop-shadow(-1px -1px 0 black);
  }
  .bingo__cell__content__text-amount {
    z-index: 1;
    position: absolute;
    font-size: 5em;
    color: rgba(50, 255, 0, 50%);
    text-shadow: .05em .05em 0 rgba(0, 0, 0, 50%);
  }
  .bingo__cell__content__text-bonus {
    z-index: 2;
    position: absolute;
    font-size: 2em;
    color: white;
    bottom: 0;
    text-shadow: .05em .05em 0 black;
  }
  .bingo__cell--checked {
    background: rgb(53, 255, 0, 35%);
  }
  .title {
    font-size: 3em;
    text-shadow: .05em .05em 0 black;
    font-weight: 700;
    color: white;
    font-family: "Built Titling Rg";
  }
  .loading {
    border: none;
  }
  .scores__container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 100%;
    text-align: center;
    margin-top: 1em;
  }
  .scores__container span {
    margin: 0 .5em;
  }
  .rules {
    display: flex;
    flex-direction: column;
    padding: 1em 0;
  }
  @-webkit-keyframes pulsate-bck {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    50% {
      -webkit-transform: scale(0.9);
      transform: scale(0.9);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @keyframes pulsate-bck {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    50% {
      -webkit-transform: scale(0.9);
      transform: scale(0.9);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>