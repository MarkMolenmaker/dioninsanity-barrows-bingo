<template>
  <div class="bingo__card__group">
    <BingoCard v-for="bingo_card in bingo_cards"
               :bingo_card="bingo_card"
               :loot="loot"
               v-bind:key="bingo_card.id" />
  </div>
</template>

<script>
import BingoCard from "./BingoCard";
import {onMounted, ref} from "vue";
import axios from "axios";

export default {
  name: "BingoCardGroup",
  components: { BingoCard },
  props: { player: String, loot: Object },
  setup (props) {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const bingo_cards = ref(null);

    async function fetchAllBingoCardsFromPlayer(player_name) {
      loading.value = true
      data.value = await axios.get(`https://dioninsanity-barrows-bingo-backend.netlify.app/bingocard/${player_name}`)
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
      await fetchAllBingoCardsFromPlayer(props.player)
    });

    return { loading, error, bingo_cards }
  }
}
</script>

<style scoped>
.bingo__card__group {
  display: flex;
  flex-direction: row;
  column-gap: 1em;
  justify-content: center;
  align-items: center;
  align-content: center;
}
</style>