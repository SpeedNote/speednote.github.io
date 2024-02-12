0<template>
  
<div id="app" class="container mx-auto m-8">
 
  <div class="flex py-4">
    
    <textarea ref="newmessage" placeholder="Add a new message ..." class="flex-1 resize-none"></textarea>

    <AddBtn @click="addNewMessage" />
  </div>

<!-- :class="{ 'm-0': isEditing }" -->

  <hr class="my-4">
  <div :key="message" v-for="message in messages" class="flex my-4">
    
      <p 
        v-if="!isEditing" 
        @click="startEditing" 
        class="select-none flex-1 whitespace-pre-wrap resize-none h-auto"
        >{{ message.text }}</p>

      <textarea 
        v-if="isEditing"
        v-model="message.text" 
        @blur="updateMessage(message)"
        class="flex-1 resize-none overflow-y-hidden">
      </textarea>


  <DeleteBtn @delete="deleteMessage(message.id)" />
</div>


</div>

</template>

<script>

import App from './App';
import AddBtn from './components/AddBtn.vue'
import DeleteBtn from './components/DeleteBtn.vue'

export default {
  components: {
    AddBtn,
    DeleteBtn,
  },
  mixins: [App],
};



</script>

