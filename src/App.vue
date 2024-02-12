0<template>
  
<div id="app" class="container mx-auto m-8">
 
  <div class="flex py-4">
    
    <textarea ref="newmessage" placeholder="Add a new message ..." class="flex-1 resize-none"></textarea>

    <button @click="addNewMessage" class="h-fit bg-green-400 text-white p-1 rounded hover:bg-green-700 ml-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg></button>
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


  <!-- DELETE BUTTON -->
  <button 
    v-show="!isMessageFocused(message)" 
    @click="deleteMessage(message.id)" 
    class="h-fit bg-red-100 text-white p-1 rounded hover:bg-red-700 ml-2"
  >

  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">

    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    
  </svg></button>
</div>


</div>

</template>

<script>

import App from './App';

export default {
  mixins: [App],
};



</script>

