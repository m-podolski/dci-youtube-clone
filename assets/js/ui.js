
const conf = {

  bpNavTopM: '(min-width: 43em)',
  navTopRight: '.right',
  navTopCenter: '.center',
  voiceControl: '.voice',

  bpNavSideS: '(min-width: 55em)',
  bpNavSideM: '(min-width: 75em)',
  menuControl: '.hamburger',
  menuRoot: 'aside',
  contentRoot: 'main',
  overlay: '.overlay',
  rootClassS: 'menu-s',
  rootClassM: 'menu-m',
  rootClassOverlay: 'menu-overlay',
  menuStateIndicator: 'aria-expanded',
  controls: '.nav-side a',
  focusableControls: '.hamburger, .nav-side a',
  skipLink: 'skiplink',

  navChannel: '.nav-channel-list',
  navChannelForw: '.channel .next',
  navChannelBack: '.channel .previous',
};

const dom = getNodes();

// Place the voice icon next to the search bar or on the right block
const bpNavTopM = window.matchMedia(conf.bpNavTopM);
placeVoiceControl();
bpNavTopM.addEventListener('change', placeVoiceControl);

// Make the hamburger and sidebar interactive
const bpNavSideS = window.matchMedia(conf.bpNavSideS);
const bpNavSideM = window.matchMedia(conf.bpNavSideM);
initSidebar();
bpNavSideS.addEventListener('change', initSidebar);
bpNavSideM.addEventListener('change', initSidebar);
dom.menuControl.addEventListener('click', toggleSidebar);

// Make the channel navigation sticky and slidable
// dom.navChannelBack.style.display = 'none';

dom.navChannelForw.addEventListener('pointerdown', () => {
  dom.intervalIDForw = window.setInterval(slideChannelNav, 30, 'forwards');
});
dom.navChannelForw.addEventListener('pointerup', () => {
  window.clearInterval(dom.intervalIDForw);
});
dom.navChannelBack.addEventListener('pointerdown', () => {
  dom.intervalIDBack = window.setInterval(slideChannelNav, 30, 'backwards');
});
dom.navChannelBack.addEventListener('pointerup', () => {
  window.clearInterval(dom.intervalIDBack);
});

// Make the playlists slidable

function getNodes() {

  const voiceControl = document.querySelector(conf.voiceControl);
  const navTopRight = document.querySelector(conf.navTopRight);
  const navTopCenter = document.querySelector(conf.navTopCenter);

  const menuControl = document.querySelector(conf.menuControl);
  const menuRoot = document.querySelector(conf.menuRoot);
  const contentRoot = document.querySelector(conf.contentRoot);
  const overlay = document.querySelector(conf.overlay);
  const controls = document.querySelectorAll(conf.controls);
  const focusableContent = document.querySelectorAll(conf.focusableControls);
  const firstFocusable = document.querySelector(conf.focusableControls)[0];
  const lastFocusable = focusableContent[focusableContent.length - 1];
  const skipLink = document.querySelector(conf.skipLink);

  const navChannel = document.querySelector(conf.navChannel);
  const navChannelForw = document.querySelector(conf.navChannelForw);
  const navChannelBack = document.querySelector(conf.navChannelBack);

  return {
    voiceControl,
    navTopRight,
    navTopCenter,

    menuRoot,
    contentRoot,
    menuControl,
    overlay,
    controls,
    firstFocusable,
    lastFocusable,
    skipLink,

    navChannel,
    navChannelForw,
    navChannelBack,
  };
}

function slideChannelNav(direction) {

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
  // dom.navChannelBack.style.display = parseInt(dom.navChannel.style.marginLeft) < 0 ?
  //   'block' :
  //   'none';
}

function placeVoiceControl() {

  if (dom.navTopCenter.contains(dom.voiceControl) && bpNavTopM.matches === false) {
    dom.navTopRight.insertBefore(dom.voiceControl, dom.navTopRight.firstChild);
  } else {
    dom.navTopCenter.appendChild(dom.voiceControl);
  }
}

function initSidebar() {

  if (!bpNavSideS.matches && !bpNavSideM.matches) {
    // Controls-display-state
    dom.menuRoot.classList.remove(conf.rootClassS);
    dom.contentRoot.classList.remove(conf.rootClassS);
    dom.menuRoot.classList.remove(conf.rootClassM);
    dom.contentRoot.classList.remove(conf.rootClassM);
    removeMenuInteractivity();
  }
  if (bpNavSideS.matches && !bpNavSideM.matches) {
    // Controls-display-state
    dom.menuRoot.classList.remove(conf.rootClassM);
    dom.contentRoot.classList.remove(conf.rootClassM);
    dom.menuRoot.classList.add(conf.rootClassS);
    dom.contentRoot.classList.add(conf.rootClassS);
    addMenuInteractivity();
  }
  if (bpNavSideM.matches) {
    // Controls-display-state
    dom.menuRoot.classList.remove(conf.rootClassS);
    dom.contentRoot.classList.remove(conf.rootClassS);
    dom.menuRoot.classList.add(conf.rootClassM);
    dom.contentRoot.classList.add(conf.rootClassM);
    addMenuInteractivity();
  }
}

function toggleSidebar() {

  // Menu is open
  if (dom.menuRoot.classList.contains(conf.rootClassM)) {
    dom.menuRoot.classList.remove(conf.rootClassM);
    dom.contentRoot.classList.remove(conf.rootClassM);
    if (bpNavSideM.matches) {
      dom.menuRoot.classList.add(conf.rootClassS);
      dom.contentRoot.classList.add(conf.rootClassS);
    } else {
      removeMenuInteractivity();
    }
    dom.overlay.style.display = 'none';
  // Menu is closed
  } else {
    dom.menuRoot.classList.remove(conf.rootClassS);
    dom.contentRoot.classList.remove(conf.rootClassS);
    dom.menuRoot.classList.add(conf.rootClassM);
    addMenuInteractivity();
    if (bpNavSideM.matches) {
      dom.contentRoot.classList.add(conf.rootClassM);
    } else {
      dom.contentRoot.classList.add(conf.rootClassOverlay);
      dom.overlay.style.display = 'block';
      dom.overlay.addEventListener('click', function closeOverlay() {
        dom.overlay.removeEventListener('click', closeOverlay);
        toggleSidebar();
      });
    }
  }
}

function addMenuInteractivity() {
  // Menu-Control-ARIA-state
  dom.menuControl.setAttribute(conf.menuStateIndicator, true);
  // Controls-Interaction-state
  document.addEventListener('keydown', trapTab);
  for (const control of dom.controls) {
    control.setAttribute('tabindex', '0');
  }
}

function removeMenuInteractivity() {
  // Menu-Control-ARIA-state
  dom.menuControl.removeAttribute(conf.menuStateIndicator, false);
  // Controls-Interaction-state
  document.removeEventListener('keydown', trapTab);
  for (const control of dom.controls) {
    control.setAttribute('tabindex', '-1');
  }
}

function trapTab(e) {

  const isTabPressed = e.key === 'Tab';
  const isEscPressed = e.key === 'Escape';
  const isExpanded = dom.menuControl.getAttribute(conf.menuStateIndicator) === 'true';

  if (!isTabPressed) {
    if (isEscPressed && isExpanded) {
      toggleSidebar();
      dom.skipLink.focus();
    }
    return;
  }

  if (e.shiftKey) {
    if (document.activeElement === dom.firstFocusable) {
      dom.lastFocusable.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === dom.lastFocusable) {
      dom.firstFocusable.focus();
      e.preventDefault();
    }
  }
}
