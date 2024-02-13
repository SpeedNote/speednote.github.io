<template>
    <div class="socials flex justify-between mx-2 sm:mx-0 pt-2 pb-1">
      
      <a href="https://github.com/speednote/speednote.github.io" target="_blank">
        <img src="https://raw.githubusercontent.com/mattheweq/icons-repo/main/github.svg">
      </a>

      <a href="https://open.spotify.com/artist/66OsKKYin7yLMQUsZxjE91" target="_blank">
        <img  id="spotify" src="https://raw.githubusercontent.com/mattheweq/icons-repo/main/soundwave.svg">
      </a>

      <a href="mailto:mattheweq8@gmail.com">
        <img src="https://raw.githubusercontent.com/mattheweq/icons-repo/main/email.svg">
      </a>
    </div>
</template>

<style scoped>
/* SVG ICONS */
.socials img{
  width: 30px;
  height: auto;
  filter: invert(.7) grayscale(50%) brightness(50%);
}
.socials img:hover{
  width: 30px;
  height: auto;
  filter: invert(0) grayscale(100%) brightness(200%);
}

#spotify{
  width: 45px;
  margin: -10px 5px 0;
}
</style>