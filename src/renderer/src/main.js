import App from "./App.svelte";
import { getRSAkey } from "./lib/getRSAkey";

const appEl = document.getElementById("app");
getRSAkey().then(() => {
  appEl.innerHTML = "";
  const app = new App({
    target: appEl,
  });
});


if (window.tuwanNapi) {
  console.log('naapi====',window.tuwanNapi);

  const agoraSDK = window.tuwanNapi.AgoraSDK;

  const createAgoraRtcEngine =  agoraSDK.createAgoraRtcEngine;

  let engine = createAgoraRtcEngine();
  console.log('engine====',engine);
}