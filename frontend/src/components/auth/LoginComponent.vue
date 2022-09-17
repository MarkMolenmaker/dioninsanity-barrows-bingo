<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
        <form
            class="text-center border border-primary p-5 pt-5 mt-5"
            @submit.prevent="loginUser">
          <h1 class="mb-5">Login</h1>
          <input
              type="text"
              id="email"
              class="form-control mb-5"
              placeholder="Email"
              v-model="login.email"/>
          <!-- Password -->
          <input
              type="password"
              id="password"
              class="form-control mb-5"
              placeholder="Password"
              v-model="login.password"/>
          <p>Don't have an account? <router-link to="/register">click here</router-link></p>
          <!-- Sign in button -->
          <div class="align-content-center">
            <button class="btn btn-primary btn-block w-75 my-4" type="submit">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

axios.defaults.baseURL = "https://dioninsanity-barrows-bingo-backend.netlify.app";

export default {
  name: 'LoginComponent',
  data() {
    return {
      login: {
        email: "",
        password: ""
      }
    }
  },
  methods: {
    async loginUser() {
      try {
        let response = await axios.post("/user/login", this.login);
        let token = response.data.token;
        localStorage.setItem("jwt", token);
        if (token) {
          await swal("Success", "Login Successful", "success");
          this.$router.push("/");
        }
      } catch (err) {
        await swal("Error", "Something Went Wrong", "error");
        console.log(err.response);
      }
    }
  }
}
</script>