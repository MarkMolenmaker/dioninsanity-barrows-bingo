<template>
  <div class="bingo__card">
      <div class="bingo__cell"
           v-for="item in layout" :key="item"
           :class="{ 'bingo__cell--checked': this.item_count(item) > 0 }" >
        <div class="bingo__cell__content"
             :title="item" >
          <img class="bingo__cell__content__img"
               :src="require(`@/assets/${item}.png`)"
               :alt="item" />
          <span class="bingo__cell__content__text-amount"
                v-if="this.item_count(item) > 1" >{{this.item_count(item)}}</span>
          <span class="bingo__cell__content__text-bonus"
                v-if="bonus_layout.includes(item)" >+1</span>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "BingoCard",
  props: { bingo_card: Object, loot: Object },
  computed: {
    layout() {
      return this.bingo_card.layout.split(",");
    },
    bonus_layout() {
      return this.bingo_card.bonus_layout.split(",");
    }
  },
  methods: {
    item_count(item) {
      return this.loot[item] ? this.loot[item].amount : 0;
    }
  }
}
</script>

<style scoped>
  .bingo__card {
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
    max-width: 5vh;
    max-height: 5vh;
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
    font-size: 2em;
    color: rgba(50, 255, 0, 50%);
    text-shadow: .05em .05em 0 rgba(0, 0, 0, 50%);
  }
  .bingo__cell__content__text-bonus {
    z-index: 2;
    position: absolute;
    font-size: 1em;
    color: white;
    bottom: 0;
    text-shadow: .05em .05em 0 black;
  }
  .bingo__cell--checked {
    background: rgb(53, 255, 0, 35%);
  }
</style>