<template>
  <div class="hello-world">
    <h1>{{ msg }}</h1>
    <h1>{{ msg }}1111</h1>
    <button @click="setCount">{{ count }}</button>
    <input type="text" v-model="todo" />
    <button class="addTodo" @click="addTodo">add</button>

    <button class="loadUser" @click="loadUser">loadUser</button>
    <p v-if="user.loading" class="loading">loading</p>
    <div v-else class="user-name">{{ user.data && user.data.username }}</div>
    <p v-if="user.error" class="error">error</p>

    <ul>
      <li v-for="(todo,index) in todos" :key="index">{{ todo }}</li>
    </ul>

    <Hello :msg="helloMsg"></Hello>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import Hello from './Hello.vue';

const props = defineProps({
  msg: {
    type: String
  }
});
const emit = defineEmits(['send']);

const helloMsg = ref('helloMsg');
const todo = ref('');
const todos = ref<string[]>([]);
const user = reactive({
  data: {
    username: ''
  },
  loading: false,
  error: false
});
const count = ref(1);
const setCount = () => {
  count.value++;
};
const addTodo = () => {
  if (todo.value) {
    todos.value.push(todo.value);
    emit('send', todo.value);
  }
};

const loadUser = async () => {
  try {
    user.loading = true;
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users/1');
    console.log(data);
    user.data = data;
  } catch (error) {
    user.error = true;
  } finally {
    user.loading = false;
  }
};

</script>
<script lang="ts">
export default {
  name: 'HelloWorld' // inheritAttrs也是
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
