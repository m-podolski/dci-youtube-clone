
const conf = {

  navChannel: '.nav-channel-list',
  navChannelForw: '.channel .next',
  navChannelBack: '.channel .previous',
  delay: 30,
};

function getNodes() {

  const navChannel = document.querySelector(conf.navChannel);
  const navChannelForw = document.querySelector(conf.navChannelForw);
  const navChannelBack = document.querySelector(conf.navChannelBack);

  return {
    navChannel,
    navChannelForw,
    navChannelBack,
  };
}

function slideChannelNav(direction, dom) {

  const currentMargin = parseInt(dom.navChannel.style.marginLeft) || 0;
  const change = 2;
  const maxForw = 40;
  const maxBack = 20;

  if (direction === 'forwards') {
    dom.navChannel.style.marginLeft = currentMargin <= -maxForw ?
      `-${ maxForw }rem` :
      `${ currentMargin - change }rem`;
  }
  if (direction === 'backwards') {
    dom.navChannel.style.marginLeft = currentMargin >= maxBack ?
      `${ maxBack }rem` :
      `${ currentMargin + change }rem`;
  }
}

function init() {

  const dom = getNodes();
  // Make the channel navigation sticky and slidable
  dom.navChannelForw.addEventListener('pointerdown', () => {
    dom.intervalIDForw = window.setInterval(slideChannelNav, conf.delay, 'forwards', dom);
  });
  dom.navChannelForw.addEventListener('pointerup', () => {
    window.clearInterval(dom.intervalIDForw);
  });
  dom.navChannelBack.addEventListener('pointerdown', () => {
    dom.intervalIDBack = window.setInterval(slideChannelNav, conf.delay, 'backwards', dom);
  });
  dom.navChannelBack.addEventListener('pointerup', () => {
    window.clearInterval(dom.intervalIDBack);
  });
}

export { init };
