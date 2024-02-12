<template>
  <div id="app" class="fade-in max-w-[800px] mx-auto m-8 mt-0">
    <Header />
    
    <div class="flex items-center py-4 bg-[#9198e511]">
    
      <textarea ref="newmessage" placeholder="Write something cool..." class="ml-4 p-2 flex-1 resize-none focus:h-[500px]"></textarea>
    
      <AddBtn @click="addNewMessage" />
    </div>
    
    <hr class="my-0">

    <div :key="message.id" v-for="message in messages" class="flex mx-2 sm:mx-0 my-4 bg-[#9198e511]">
      
      <p
        v-if="!message.isEditing"
        @click="startEditing(message)"

        class="px-2 py-1 select-none flex-1 whitespace-pre-wrap resize-none h-auto"
      >
        {{ message.text }}
      </p>


      <textarea
        v-if="message.isEditing"
        v-model="message.text"
        @blur="updateMessage(message)"
        class="px-2 py-1 flex-1 resize-none overflow-y-hidden"
        rows="20"
      ></textarea>
      
      <DeleteBtn @delete="deleteMessage(message.id)" />
    </div>
  </div>
</template>

<script>
import App from './App';
import Header from './components/Header.vue'
import AddBtn from './components/AddBtn.vue'
import DeleteBtn from './components/DeleteBtn.vue'

export default {
  components: {
    Header,
    AddBtn,
    DeleteBtn,
  },
  mixins: [App],
};
</script>

