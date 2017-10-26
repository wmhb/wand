<template>
  <div class="page-wrapper">
    <h1>Log In</h1>
    <p>Einloggen um die wmhb Wand zu steuern.</p>
    <div class="alert alert-danger" v-if="error">
      <p>{{ error }}</p>
    </div>
    <div class="form__control">
      <input type="text"
             class="form__input input--light"
             placeholder="Usernamen eingeben"
             v-model="credentials.username">
    </div>
    <div class="form__control">
      <input type="password"
             class="form__input input--light"
             placeholder="Passwort eingeben"
             v-model="credentials.password">
    </div>
    <button class="btn" @click="submit()">Absenden</button>
  </div>
</template>
<script>
  import auth from '../auth'

  export default {
    name: 'Login',
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        error: ''
      }
    },
    methods: {
      submit () {
        let credentials = {
          username: this.credentials.username,
          password: this.credentials.password,
          role: 'admin'
        }
        // We need to pass the component's this context
        // to properly make use of http in the auth service
        auth.login(this, credentials, 'admin')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~scss/_vars.scss";

  h1 {
    font-size: $font-size-h1;
    color: $prim2;
    margin-bottom: 4.5rem;
    margin-top: 0;
  }

  .form__control {
    max-width: 40rem;
  }

  .form__input {
    width: 100%;
    padding: .5rem;
    margin-top: .5rem;
    font-size: $font-size-body;
    border-radius: 0;

    &.input--light {
      border: .2rem solid $lightestgrey;
    }
  }

  .btn {
    font-size: $font-size-body;
    width: auto;
    background: $prim1;
    color: $white;
    border: 0;
    padding: 1rem;
    margin-top: .5rem;
  }

</style>
