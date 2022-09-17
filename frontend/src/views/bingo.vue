<template>
  <div class="wrapper">
    <router-link class="title" to="/">DionInsanity's Barrows Bingo</router-link>
    <div class="bingo__wrapper">
      <div class="player__wrapper"
           v-for="player in players"
           v-bind:key="player.id" >
        <span class="player__name">{{player.name}}</span>
        <BingoCardGroup :player="player.name" :loot="loot"/>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import axios from "axios";
import BingoCardGroup from "../components/BingoCardGroup";

export default {
  name: "bingo",
  components: { BingoCardGroup },

  setup () {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const players = ref(null);
    const loot = ref(null);

    async function fetchUserLoot(user_name) {
      loading.value = true
      data.value = await axios.get(`https://dioninsanity-barrows-backend.herokuapp.com/player/${user_name}`)
          .then(response => {
            loading.value = false
            return response.data
          })
          .catch(err => {
            loading.value = false
            error.value = err
          });
      loot.value = data.value.player.loot;
    }

    async function fetchAllPlayerNames() {
      loading.value = true
      data.value = await axios.get('https://dioninsanity-barrows-backend.herokuapp.com/player/names')
          .then(response => {
            loading.value = false
            return response.data
          })
          .catch(err => {
            loading.value = false
            error.value = err
          });
      players.value = data.value.player;
    }

    onMounted(async () => {
      await fetchUserLoot('DionInsanity')
      await fetchAllPlayerNames()
    })

    return { loading, error, loot, players }
  }
}
</script>

<style scoped>
  .wrapper {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1em 0;
  }
  .title {
    font-size: 3em;
    text-shadow: .05em .05em 0 black;
    font-weight: 700;
    color: white;
    font-family: "Built Titling Rg";
  }
  .bingo__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    overflow: auto;
  }
  .player__name {

  }
  .player__wrapper {
    position: relative;
    display: block;
  }
  .player__bingo__cards {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .bingo__card {
    width: 30vh;
    height: 30vh;
    background: white;
    border: black .1em solid;
  }
</style>