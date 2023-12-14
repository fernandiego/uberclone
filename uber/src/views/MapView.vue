<template>
  <div id="MapView">
    <div
        id="BackBtn"
        class="absolute z-50 rounded-full bg-white p-1 top-8 left-4"
        @click="goBack()"
    >
      <ArrowLeftIcon :size="40"/>
    </div>
    <div id="map"></div>
    <div id="VehicleSelection" class="w-full">
      <div class="w-full h-2 border-t"></div>
      <div class="w-full text-center border-t-2 p-1.5 text-gray-700 text-lg font-semibold">
        Distance - {{ distance.text }}
      </div>
      <div class="ScrollSection">
        <div class="bg-custom-gray">
          <div class="flex items-center px-4 py-5">
            <img width="75" src="img/uber/ride.png" alt="">
            <div class="w-full ml-3">
              <div class="flex items-center justify-between">
                <div class="text-2xl mb-1">UberX</div>
                <div class="text-xl">$ {{ calculatePrice(1, distance.value) }}</div>
              </div>
              <div class="text-gray-500">{{ duration.text }}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="flex items-center px-4 py-5">
            <img width="75" src="img/uber/comfort.png" alt="">
            <div class="w-full ml-3">
              <div class="flex items-center justify-between">
                <div class="text-2xl mb-1">Uber Comfort</div>
                <div class="text-xl">$ {{ calculatePrice(1.25, distance.value) }}</div>
              </div>
              <div class="text-gray-500">{{ duration.text }}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="flex items-center px-4 py-5">
            <img width="75" src="img/uber/uberxl.png" alt="">
            <div class="w-full ml-3">
              <div class="flex items-center justify-between">
                <div class="text-2xl mb-1">UberXL</div>
                <div class="text-xl">$ {{ calculatePrice(1.5, distance.value) }}</div>
              </div>
              <div class="text-gray-500">{{ duration.text }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="
              flex
              items-center
              justify-center
              bg-white
              py-6
              px-4
              w-full
              absolute
              bottom-0
              shadow-inner
           ">
        <button class="
                  bg-black
                  text-2xl
                  text-white
                  py-4
                  px-4
                  rounded-sm
                  w-full

                ">
          Confirm UberX
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import { useRouter } from "vue-router";
import {useDirectionStore} from "@/store/direction-store";
import axios from "axios";
import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft.vue'
import mapStyles from "@/mapStyles";


const direction = useDirectionStore()
const router = useRouter()

const distance = ref({text: '', value: null})
const duration = ref({text: '', value: null})

const latlng = ref({
  start: {
    lat: null,
    lng: null,
  },
  end: {
    lat: null,
    lng: null,
  },

})

onMounted(() => {
  if (!direction.pickup || !direction.destination) {
    router.push('/')
  }
  setTimeout(() => {
    initMap()
  }, 500)
})

const goBack = () => {
  router.push('/directions')
  direction.pickup = ''
  direction.destination = ''
}

const initMap = () => {

  const directionsService = new window.google.maps.DirectionsService()
  const directionsRenderer = new window.google.maps.DirectionsRenderer()

  directionsRenderer.setOptions({
    polylineOptions: {
      strokeColor: '#212121',
      strokeWeight: 6
    }
  })

  const map = new window.google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    minZoom: 3,
    maxZoom: 17,
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    styles: mapStyles()
  });
  if (direction.pickup && direction.destination) {
    getDirections(map, directionsRenderer, directionsService)
    getDistance()

  }
}


const getDirections = (map, directionsRenderer, directionsService) => {
  directionsRenderer.setMap(map)

  const request = {
    origin: direction.pickup,
    destination: direction.destination,
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  }
  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      latlng.value.start.lat = result.routes[0].legs[0].start_location.lat()
      latlng.value.start.lng = result.routes[0].legs[0].start_location.lng()
      latlng.value.end.lat = result.routes[0].legs[0].start_location.lat()
      latlng.value.end.lat = result.routes[0].legs[0].start_location.lng()

      directionsRenderer.setDirections(result)
    }
  })
}

const getDistance = async () => {
  let res = await axios.get('distance/' + direction.pickup + '/' + direction.destination)
  distance.value.text = res.data.rows[0].elements[0].distance.text
  distance.value.value = res.data.rows[0].elements[0].distance.value
  duration.value.text = res.data.rows[0].elements[0].duration.text
  duration.value.value = res.data.rows[0].elements[0].duration.value
}

const calculatePrice = (multiplier, price) => {
  let res = (price / 900) * multiplier
  return res.toFixed(2)
}

</script>

<style lang="scss">

#MapView {
  #map {
    width: 100%;
    height: 45vh;
    top: 0;
    left: 0;

  }

  .gm-style-cc {
    display: none;
  }

  .bg-custom-gray {
    background-color: rgb(237, 237, 237);
  }

  #VehicleSelection {
    .scrollSection {
      height: calc(50vh - 120px);
      position: absolute;
      overflow-y: auto;
      width: 100%;
    }
  }

}
</style>

