<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
        <form
            class="text-center border border-primary p-5 pt-5 mt-5"
            @submit.prevent="registerUser">
          <h1 class="mb-5">Register</h1>
          <input
              type="text"
              id="name"
              class="form-control mb-5"
              placeholder="Name"
              v-model="register.name"
              required/>
          <input
              type="email"
              id="email"
              class="form-control mb-5"
              placeholder="Email"
              v-model="register.email"
              required/>
          <!-- Password -->
          <input
              type="password"
              id="password"
              class="form-control mb-5"
              placeholder="Password"
              v-model="register.password"/>
          <p>Already have an account? <router-link to="/">click here</router-link></p>
            <!-- Sign in button -->
          <div class="align-content-center">
            <button class="btn btn-primary btn-block w-75 my-4" type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import swal from "sweetalert";

export default {
  name: 'RegisterComponent',
  data() {
    return {
      register: {
        name: "",
        email: "",
        password: ""
      }
    }
  },
  methods: {
    async registerUser() {
      try {
        let response = await axios.post("http://localhost:3000/user/register", this.register);
        console.log(response);
        let token = response.data.token;
        if (token) {
          localStorage.setItem("jwt", token);
          this.$router.push("/login");
          await swal("Success", "Registration Was successful", "success");
        } else {
          await swal("Error", "Something Went Wrong", "error");
        }
      } catch (err) {
        let error = err.response;
        if (error.status === 409) {
          await swal("Error", error.data.message, "error");
        } else {
          await swal("Error", error.data.err.message, "error");
        }
      }
    }
  }
}
</script>