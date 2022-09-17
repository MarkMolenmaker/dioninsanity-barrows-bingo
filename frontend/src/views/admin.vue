<template>
  <div class="wrapper">
    <div class="title__wrapper">
      <router-link class="title" to="/">Bingo Main Page</router-link>
      <router-link class="title" to="/bingo">Bingo Overview</router-link>
    </div>
    <div class="players__container">
      <div class="player__line" v-for="player in players" v-bind:key="player.id">
        <span class="player__data">{{player.name}}</span>
        <span class="player__data">Bingocards: {{calculateBingoCardCount(player.name)}}</span>
        <a class="player__action" @click="addBingoCard(player.name)">Add a bingo card</a>
        <a class="player__action" @click="removeBingoCard(player.name)">Remove a bingo card</a>
        <a class="player__action" @click="deletePlayer(player.name)">Delete player</a>
      </div>
    </div>
    <div class="create__user__container">
      <form @submit.prevent="createUser">
        <input type="text" v-model="new_user_name" placeholder="Enter a new user name">
        <button type="submit">Create User</button>
      </form>
    </div>
    <div class="user__details__container">
      <span class="user__details">Logged in as: {{user.name}}</span>
      <button @click="logUserOut">Log Out</button>
    </div>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import {onMounted, ref} from "vue";
import axios from "axios";

export default {
  name: 'admin',
  data() {
    return {
      user: null,
      new_user_name: ""
    }
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("jwt");
      this.user = VueJwtDecode.decode(token);
    },
    logUserOut() {
      localStorage.removeItem("jwt");
      this.$router.push("/login");
    },
    calculateBingoCardCount(player_name) {
      let bingo_card_count = 0;
      for (let i = 0; i < this.bingo_cards.length; i++) {
        if (this.bingo_cards[i].player === player_name) {
          bingo_card_count += 1;
        }
      }
      return bingo_card_count;
    },
    createUser() {
      axios.post('https://dioninsanity-barrows-bingo-backend.netlify.app/player/create',
          { name: this.new_user_name },
          { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
          .then(() => {
            this.$router.go()
          })
          .catch(err => {
            throw err;
          });
    },
    addBingoCard(player_name) {
      axios.post('https://dioninsanity-barrows-bingo-backend.netlify.app/bingocard/new',
          { player: player_name },
          { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
          .then(() => {
            this.$router.go()
          })
          .catch(err => {
            throw err;
          });
    },
    removeBingoCard(player_name) {
      axios.post('https://dioninsanity-barrows-bingo-backend.netlify.app/bingocard/remove',
          { player: player_name },
          { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
          .then(() => {
            this.$router.go()
          })
          .catch(err => {
            throw err;
          });
    },
    deletePlayer(player_name) {
      axios.delete('https://dioninsanity-barrows-bingo-backend.netlify.app/player/' + player_name,
          { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
          .then(() => {
            this.$router.go()
          })
          .catch(err => {
            throw err;
          });
    }
  },
  setup() {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const players = ref(null);
    const bingo_cards = ref(null);

    async function fetchAllPlayerNames() {
      loading.value = true
      data.value = await axios.get('https://dioninsanity-barrows-bingo-backend.netlify.app/player/names')
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

    async function fetchAllBingoCards() {
      loading.value = true
      data.value = await axios.get('https://dioninsanity-barrows-bingo-backend.netlify.app/bingocard')
          .then(response => {
            loading.value = false
            return response.data
          })
          .catch(err => {
            loading.value = false
            error.value = err
          });
      bingo_cards.value = data.value.cards;
    }

    onMounted(async () => {
      await fetchAllPlayerNames()
      await fetchAllBingoCards()
    })

    return { loading, error, players, bingo_cards }
  },
  created() {
    this.getUserDetails();
  }
}
</script>

<style scoped>
  .players__container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .player__line {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    border-bottom: 1px solid black;
  }
  .player__action {
    cursor: pointer;
  }
  .title__wrapper {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .title {
    font-size: 3em;
    text-shadow: .05em .05em 0 black;
    font-weight: 700;
    color: white;
    font-family: "Built Titling Rg";
  }
</style>