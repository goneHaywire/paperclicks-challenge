<script setup lang="ts">
import { ref, reactive } from "vue";
import MapService from "../services/maps";
import { pipe, pluck, map, join, includes, prop, find, anyPass } from "ramda";
import VueMultiselect from "vue-multiselect";

const { user } = defineProps(["user"]);

const autocompleteService = new window.google.maps.places.AutocompleteService();
const placesService = new window.google.maps.places.PlacesService(
  document.createElement("div"),
);

const useGoogleLocation = ref(false);
const errors = ref([]);
const options = ref([]);
const activeAddress = ref(user?.address?.street || "");
const address = ref(
  user?.address || {
    street: "",
    city: "",
    zipcode: "",
    geo: {
      lat: "",
      lng: "",
    },
  },
);

const onAddressChange = (input) => {
  autocompleteService.getPlacePredictions({ input }, (places) => {
    options.value = places || [];
  });
};

const onAddressSelect = (selectedAddress) => {
  const hasCity = anyPass([
    includes("locality"),
    includes("administrative_area_level_2"),
  ]);
  const hasPostalCode = includes("postal_code");

  placesService.getDetails(
    {
      placeId: selectedAddress.place_id,
      fields: ["address_components", "geometry"],
    },
    ({ address_components, geometry }) => {
      address.value = {
        street: selectedAddress.description,
        city: pipe(
          find(pipe(prop("types"), hasCity)),
          prop("long_name"),
        )(address_components),
        zipcode: pipe(
          find(pipe(prop("types"), hasPostalCode)),
          prop("long_name"),
        )(address_components),
        geo: {
          lat: geometry?.location?.lat()?.toString(),
          lng: geometry?.location?.lng()?.toString(),
        },
      };
    },
  );
};

const setErrors = (errs) =>
  (errors.value = pipe(pluck("path"), map(join(".")))(errs));

const hasError = (field) => includes(field, errors.value);
</script>

<template>
  <div class="grid grid-cols-2 gap-y-8 gap-x-12">
    <div class="flex flex-col">
      <label for="name" class="mb-3">Full Name</label>
      <input
        v-model="user.name"
        type="text"
        id="name"
        :class="[
          'border text-gray-800 rounded-md p-4 focus:outline-none',
          hasError('name') ? 'border-red-600' : 'border-gray-300',
        ]"
        placeholder="John Gonzales"
      />
    </div>
    <div class="grid grid-cols-2">
      <label for="street" class="mb-3">Address</label>
      <div>
        <input
          type="checkbox"
          id="google_location"
          value="google_location"
          class="mr-2"
          v-model="useGoogleLocation"
        />
        <label for="google_location">Use Google Location</label>
      </div>
      <VueMultiselect
        v-if="useGoogleLocation"
        v-model="activeAddress"
        :options="options"
        @search-change="onAddressChange"
        @select="onAddressSelect"
        :class="[
          'border text-gray-800 rounded-md focus:outline-none col-span-2',
          hasError('address.street') ? 'border-red-600' : 'border-gray-300',
        ]"
        placeholder="Reter 43"
        :searchable="true"
        track-by="description"
        label="description"
      />
      <input
        v-else
        v-model="address.street"
        type="text"
        id="street"
        :class="[
          'border text-gray-800 rounded-md p-4 focus:outline-none col-span-2',
          hasError('address.street') ? 'border-red-600' : 'border-gray-300',
        ]"
        placeholder="Reter 43"
      />
    </div>
    <div class="flex flex-col">
      <label for="username" class="mb-3">Username</label>
      <input
        v-model="user.username"
        type="text"
        id="username"
        :class="[
          'border text-gray-800 rounded-md p-4 focus:outline-none',
          hasError('username') ? 'border-red-600' : 'border-gray-300',
        ]"
        placeholder="johngonzales13"
      />
    </div>
    <div class="flex flex-col">
      <label for="city" class="mb-3">City</label>
      <input
        v-model="address.city"
        type="text"
        id="city"
        :class="[
          'border text-gray-800 rounded-md p-4 focus:outline-none',
          hasError('address.city') ? 'border-red-600' : 'border-gray-300',
        ]"
        placeholder="Tirana"
      />
    </div>
    <div class="flex flex-col">
      <label for="email" class="mb-3">Email</label>
      <input
        v-model="user.email"
        type="email"
        id="email"
        :class="[
          'border text-gray-800 rounded-md p-4 focus:outline-none',
          hasError('email') ? 'border-red-600' : 'border-gray-300',
        ]"
        placeholder="johngonzales1332@gmail.com"
      />
    </div>
    <div class="flex flex-col">
      <label for="zipcode" class="mb-3">Zip Code</label>
      <input
        v-model="address.zipcode"
        type="text"
        id="zipcode"
        :class="[
          'border text-gray-800 rounded-md p-4 focus:outline-none',
          hasError('address.zipcode') ? 'border-red-600' : 'border-gray-300',
        ]"
        placeholder="1060"
      />
    </div>
    <div class="flex flex-col">
      <label for="phone" class="mb-3">Phone nr</label>
      <input
        v-model="user.phone"
        type="tel"
        id="phone"
        :class="[
          'border text-gray-800 rounded-md p-4 focus:outline-none',
          hasError('phone') ? 'border-red-600' : 'border-gray-300',
        ]"
        placeholder="+355 69 76 76 654"
      />
    </div>
    <div>
      <div v-if="useGoogleLocation" class="grid grid-cols-2 gap-x-6">
        <div class="flex flex-col">
          <label for="lat" class="mb-3">Latitude</label>
          <input
            v-model="address.geo.lat"
            type="text"
            id="lat"
            class="border border-gray-300 text-gray-800 rounded-md p-4 focus:outline-none"
            placeholder="41.327953"
          />
        </div>
        <div class="flex flex-col">
          <label for="lng" class="mb-3">Longitude</label>
          <input
            v-model="address.geo.lng"
            type="text"
            id="lng"
            class="border border-gray-300 text-gray-800 rounded-md p-4 focus:outline-none"
            placeholder="19.819025"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="grid justify-end mt-4">
    <button
      @click="
        $emit('submit', {
          user: { ...user, address },
          setErrors,
        })
      "
      class="text-center py-3 w-36 bg-blue-600 rounded-md text-white text-md"
    >
      Save
    </button>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style lang="scss">
.multiselect {
  height: 58px;

  .multiselect__select,
  .multiselect__tags {
    height: 58px;
  }

  .multiselect__tags {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
