// Continuous filmstrip: native touch/trackpad scrolling, mouse dragging and keys.
const stage = document.querySelector('.gallery-stage');
const strip = document.createElement('div');
strip.className = 'gallery-strip';
strip.tabIndex = 0;
strip.setAttribute('aria-label', 'Photographs — swipe, scroll or drag to explore');
stage.replaceChildren(strip);
const hint = document.createElement('span');
hint.className = 'gallery-hint';
hint.textContent = 'Swipe, scroll or drag to explore';
document.querySelector('.gallery-footer').append(hint);
const motionReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let slides = [], currentSlide = 0, scrollFrame = 0, drag = null, wheelTarget = null, wheelTimer;
const endSpace = document.createElement('div');
endSpace.setAttribute('aria-hidden','true');
endSpace.style.flexShrink = '0';
const fitSlides = () => {
  slides.forEach(figure => {
    const img = figure.querySelector('img');
    if (img.naturalWidth) figure.style.flexBasis = `${Math.min(strip.clientWidth * .94, strip.clientHeight * img.naturalWidth / img.naturalHeight)}px`;
  });
  if (slides.length) endSpace.style.flexBasis = `${Math.max(0,strip.clientWidth-slides.at(-1).clientWidth-30)}px`;
};
const updateCount = () => {
  document.querySelector('#gallery-count').textContent = `${String(currentSlide + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
};
const slideLeft = i => slides[i].offsetLeft - strip.offsetLeft;
step = delta => {
  currentSlide = Math.max(0, Math.min(slides.length - 1, currentSlide + delta));
  strip.scrollTo({left:slideLeft(currentSlide), behavior:motionReduced() ? 'instant' : 'smooth'});
  updateCount();
};
openGallery = (index, startPhoto = 0) => {
  active = index;
  opener = document.activeElement;
  const p = projects[index];
  document.querySelector('#gallery-title').textContent = p.title;
  document.querySelector('#gallery-category').textContent = p.category;
  document.querySelector('#gallery-description').textContent = p.description;
  const order = [...p.images.slice(startPhoto), ...p.images.slice(0,startPhoto)];
  slides = order.map((name,i) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-slide';
    const img = document.createElement('img');
    img.src = `./${name}.webp`;
    img.alt = `${p.title} — photograph ${i+1} of ${order.length}`;
    img.draggable = false;
    img.loading = 'eager';
    img.decoding = 'async';
    img.addEventListener('load',fitSlides);
    figure.append(img);
    return figure;
  });
  strip.replaceChildren(...slides,endSpace);
  clearTimeout(wheelTimer);
  wheelTarget = null;
  currentSlide = 0;
  updateCount();
  dialog.showModal();
  fitSlides();
  strip.scrollLeft = 0;
  strip.focus({preventScroll:true});
  if (!motionReduced()) dialog.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'});
};
strip.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    if (!slides.length) return;
    currentSlide = slides.reduce((best,slide,i) => Math.abs(slideLeft(i)-strip.scrollLeft) < Math.abs(slideLeft(best)-strip.scrollLeft) ? i : best,0);
    updateCount();
  });
}, {passive:true});
strip.addEventListener('wheel', event => {
  if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
  event.preventDefault();
  const delta = event.deltaY * (event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? strip.clientWidth : 1);
  wheelTarget = Math.max(0,Math.min(strip.scrollWidth-strip.clientWidth,(wheelTarget ?? strip.scrollLeft)+delta));
  strip.scrollTo({left:wheelTarget,behavior:motionReduced() ? 'instant' : 'smooth'});
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(()=>{wheelTarget=null;},350);
}, {passive:false});
strip.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  drag = {x:event.clientX,left:strip.scrollLeft};
  strip.setPointerCapture(event.pointerId);
  strip.classList.add('is-dragging');
});
strip.addEventListener('pointermove', event => {
  if (drag) strip.scrollLeft = drag.left - (event.clientX-drag.x);
});
const endDrag = () => {
  if (!drag) return;
  drag = null;
  strip.classList.remove('is-dragging');
  currentSlide = slides.reduce((best,slide,i) => Math.abs(slideLeft(i)-strip.scrollLeft) < Math.abs(slideLeft(best)-strip.scrollLeft) ? i : best,0);
  strip.scrollTo({left:slideLeft(currentSlide),behavior:motionReduced() ? 'instant' : 'smooth'});
};
strip.addEventListener('pointerup',endDrag);
strip.addEventListener('pointercancel',endDrag);
strip.addEventListener('lostpointercapture',endDrag);
dialog.addEventListener('close',()=>{drag=null;strip.classList.remove('is-dragging');});
new ResizeObserver(fitSlides).observe(strip);
