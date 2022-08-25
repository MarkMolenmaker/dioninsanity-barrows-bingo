<template>
  <div>
    <section>
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-12">
            <ul class="list-group">
              <li class="list-group-item">Name : {{ user.name }}</li>
              <li class="list-group-item">Email : {{ user.email }}</li>
              <button @click="logUserOut">Log Out</button>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";

export default {
  name: 'Home',
  data() {
    return {
      user: {}
    }
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("jwt");
      this.user = VueJwtDecode.decode(token);
    },
    logUserOut() {
      localStorage.removeItem("jwt");
      this.$router.push("/");
    }
  },
  created() {
    this.getUserDetails();
  }
}
</script>
