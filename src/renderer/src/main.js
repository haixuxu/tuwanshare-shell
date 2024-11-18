import App from "./App.svelte";
import './styles/index.scss';
import { getRSAkey } from "./common/getRSAkey";

const appEl = document.getElementById("app");


setTimeout(()=>{
  getRSAkey().then((res) => {
    appEl.innerHTML = "";
    new App({target: appEl});
  });
})
if (window.tuwanNapi) {
  console.log('naapi====',window.tuwanNapi);
  // const agoraSDK = window.tuwanNapi.AgoraSDK;

  // const createAgoraRtcEngine =  agoraSDK.createAgoraRtcEngine;

  // let engine = createAgoraRtcEngine();
  // console.log('engine====',engine);
}