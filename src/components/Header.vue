<template>
<div class="flex items-center justify-between mt-0 mb-0 pt-0.5 pb-1 px-1 sm:px-4 text-white bg-[#9198e5]">

  <div class="flex justify-between">  
      <p @click="toggleText" class="mr-2 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </p>
    
      <p :class="{ 'hidden': !isTextVisible }" class="fast-fade-in select-none">info</p>
  </div>

  <p :class="{ 'hidden': !isTextVisible }" class="fast-fade-in select-none"><span class="italic font-bold">SpeedNote</span> &gt;&gt; Frictionless note taking</p>

  <div class="flex flex-1 justify-between text-center select-none fast-fade-in" :class="{ 'hidden': isTextVisible }">
    <p class="font-bold uppercase text-sm">Double-click a text box to Edit</p>
    <p class="font-bold uppercase text-sm">Click outside box to AutoSave</p>
  </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      isTextVisible: true,
    };
  },
  methods: {
    toggleText() {
      this.isTextVisible = !this.isTextVisible;
    },
  },
};
</script>
