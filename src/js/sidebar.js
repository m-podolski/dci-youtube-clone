
const conf = {

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
};

function getNodes() {

  const menuControl = document.querySelector(conf.menuControl);
  const menuRoot = document.querySelector(conf.menuRoot);
  const contentRoot = document.querySelector(conf.contentRoot);
  const overlay = document.querySelector(conf.overlay);
  const controls = document.querySelectorAll(conf.controls);
  const focusableContent = document.querySelectorAll(conf.focusableControls);
  const firstFocusable = document.querySelector(conf.focusableControls)[0];
  const lastFocusable = focusableContent[focusableContent.length - 1];
  const skipLink = document.querySelector(conf.skipLink);

  return {
    menuRoot,
    contentRoot,
    menuControl,
    overlay,
    controls,
    firstFocusable,
    lastFocusable,
    skipLink,
  };
}

function initSidebar(dom, bpNavSideS, bpNavSideM) {

  if (!bpNavSideS.matches && !bpNavSideM.matches) {
    dom.menuRoot.classList.remove(conf.rootClassS);
    dom.contentRoot.classList.remove(conf.rootClassS);
    dom.menuRoot.classList.remove(conf.rootClassM);
    dom.contentRoot.classList.remove(conf.rootClassM);
    removeMenuInteractivity(dom);
  }
  if (bpNavSideS.matches && !bpNavSideM.matches) {
    dom.menuRoot.classList.remove(conf.rootClassM);
    dom.contentRoot.classList.remove(conf.rootClassM);
    dom.menuRoot.classList.add(conf.rootClassS);
    dom.contentRoot.classList.add(conf.rootClassS);
    addMenuInteractivity(dom);
  }
  if (bpNavSideM.matches) {
    dom.menuRoot.classList.remove(conf.rootClassS);
    dom.contentRoot.classList.remove(conf.rootClassS);
    dom.menuRoot.classList.add(conf.rootClassM);
    dom.contentRoot.classList.add(conf.rootClassM);
    addMenuInteractivity(dom);
  }
}

function toggleSidebar(dom, bpNavSideM) {

  // Menu is open
  if (dom.menuRoot.classList.contains(conf.rootClassM)) {
    dom.menuRoot.classList.remove(conf.rootClassM);
    dom.contentRoot.classList.remove(conf.rootClassM);
    if (bpNavSideM.matches) {
      dom.menuRoot.classList.add(conf.rootClassS);
      dom.contentRoot.classList.add(conf.rootClassS);
    } else {
      removeMenuInteractivity(dom);
    }
    dom.overlay.style.display = 'none';
  // Menu is closed
  } else {
    dom.menuRoot.classList.remove(conf.rootClassS);
    dom.contentRoot.classList.remove(conf.rootClassS);
    dom.menuRoot.classList.add(conf.rootClassM);
    addMenuInteractivity(dom);
    if (bpNavSideM.matches) {
      dom.contentRoot.classList.add(conf.rootClassM);
    } else {
      dom.contentRoot.classList.add(conf.rootClassOverlay);
      dom.overlay.style.display = 'block';
      dom.overlay.addEventListener('click', function closeOverlay() {
        dom.overlay.removeEventListener('click', closeOverlay);
        toggleSidebar(dom, bpNavSideM);
      });
    }
  }
}

function addMenuInteractivity(dom) {
  // Menu-Control-ARIA-state
  dom.menuControl.setAttribute(conf.menuStateIndicator, true);
  // Controls-Interaction-state
  document.addEventListener('keydown', (e) => {
    trapTab(e, dom);
  });
  for (const control of dom.controls) {
    control.setAttribute('tabindex', '0');
  }
}

function removeMenuInteractivity(dom) {
  // Menu-Control-ARIA-state
  dom.menuControl.removeAttribute(conf.menuStateIndicator, false);
  // Controls-Interaction-state
  document.removeEventListener('keydown', (e) => {
    trapTab(e, dom);
  });
  for (const control of dom.controls) {
    control.setAttribute('tabindex', '-1');
  }
}

function trapTab(e, dom) {

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

function init() {

  const dom = getNodes();
  // Make the hamburger and sidebar interactive
  const bpNavSideS = window.matchMedia(conf.bpNavSideS);
  const bpNavSideM = window.matchMedia(conf.bpNavSideM);
  initSidebar(dom, bpNavSideS, bpNavSideM);
  bpNavSideS.addEventListener('change', () => {
    initSidebar(dom, bpNavSideS, bpNavSideM);
  });
  bpNavSideM.addEventListener('change', () => {
    initSidebar(dom, bpNavSideS, bpNavSideM);
  });
  dom.menuControl.addEventListener('click', () => {
    toggleSidebar(dom, bpNavSideS, bpNavSideM);
  });
}

export { init };
