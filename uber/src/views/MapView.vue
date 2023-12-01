<template>
  <div id="MapView">
    <div id="map"></div>
  </div>
</template>

<script setup>

import {onMounted} from "vue";

onMounted(() => {
  setTimeout(() => {
    initMap()
  }, 500)
})

const initMap = () => {
  const map = new window.google.maps.Map(document.getElementById("map"), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8,
  });
  console.log(map)

}


</script>

<style lang="scss" scoped>

#MapView {
  #map {
    width: 100%;
    height: 45vh;
    top: 0;
    left: 0;

  }

  .bg-custom-color {
    background-color: rgb(237, 237, 237);
  }


}
</style>

