import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);
app.mount("#app");
loadGmapsScript()

function loadGmapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAPS_API_KEY}&libraries=places`; // Replace with your script URL
  script.async = true;

  document.body.appendChild(script);
}

