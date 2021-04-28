
const conf = {

  bpNavTopM: '(min-width: 43em)',
  navTopRight: '.right',
  navTopCenter: '.center',
  voiceControl: '.voice',
};

function getNodes() {

  const voiceControl = document.querySelector(conf.voiceControl);
  const navTopRight = document.querySelector(conf.navTopRight);
  const navTopCenter = document.querySelector(conf.navTopCenter);

  return {
    voiceControl,
    navTopRight,
    navTopCenter,
  };
}

function placeVoiceControl(dom, bpNavTopM) {
  // console.log(conf.bpNavTopM.matches);
  if (dom.navTopCenter.contains(dom.voiceControl) && bpNavTopM.matches === false) {
    dom.navTopRight.insertBefore(dom.voiceControl, dom.navTopRight.firstChild);
  } else {
    dom.navTopCenter.appendChild(dom.voiceControl);
  }
}

function init() {

  const dom = getNodes();
  // Place the voice icon next to the search bar or on the right block
  const bpNavTopM = window.matchMedia(conf.bpNavTopM);
  placeVoiceControl(dom, bpNavTopM);
  bpNavTopM.addEventListener('change', () => {
    placeVoiceControl(dom, bpNavTopM);
  });
}

export { init };
