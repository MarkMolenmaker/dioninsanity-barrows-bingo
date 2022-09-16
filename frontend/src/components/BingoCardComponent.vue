<template>
  <div class="wrapper">
    <div class="parent">
      <div class="grid-item" v-for="item in bingo_card.layout" v-bind:key="item.name">
        <img :src="item.img" :alt="item.name" class="card-image">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BingoCardComponent",
  props: {
    layout: {
      type: String,
      required: true
    },
    loot: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      bingo_card: { layout: [] }
    }
  },
  created() {
    const card_layout = this.layout.split(',');
    card_layout.forEach(item => {
      this.bingo_card.layout.push({
        name: item,
        img: '',
        loot: this.loot[item]
      });
    });
  }
}
</script>

<style scoped>
.wrapper {
  width: 50%;
  height: 50%;
}
.parent {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 0;
  grid-row-gap: 0;
}
.grid-item {
  width: auto;
  height: auto;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-image {
  display: block;
  width: auto;
}
</style>