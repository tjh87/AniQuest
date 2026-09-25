import PhotoSwipe from "photoswipe";
import "photoswipe/style.css";
import "./photo-viewer.css";
import type { WildlifePhotoRecord } from "./profile-photos";

/** Loaded only after a reader opens a profile photograph. */
export function openPhotoViewer(photo: WildlifePhotoRecord, image: HTMLImageElement, trigger: HTMLAnchorElement) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let captionHeight = 130;
  let captionObserver: ResizeObserver | undefined;
  let zoomButton: HTMLElement | undefined;
  const previousOverflow = document.body.style.overflow;
  const viewer = new PhotoSwipe({
    dataSource: [{ src: photo.src, width: image.naturalWidth, height: image.naturalHeight, alt: photo.alt }],
    mainClass: "aq-photo-viewer",
    bgOpacity: 1,
    initialZoomLevel: "fit",
    showHideAnimationType: "fade",
    showAnimationDuration: reduceMotion ? 0 : 160,
    hideAnimationDuration: reduceMotion ? 0 : 160,
    zoomAnimationDuration: reduceMotion ? 0 : 160,
    paddingFn: () => ({ top: 76, bottom: captionHeight + 24, left: 20, right: 20 }),
    close: false,
    zoom: false,
    counter: false,
    arrowPrev: false,
    arrowNext: false,
    trapFocus: true,
    returnFocus: true,
    escKey: true,
    pinchToClose: false,
    closeOnVerticalDrag: false,
    imageClickAction: "zoom",
    tapAction: "zoom",
    errorMsg: "This photo could not load. Open its source below.",
  });

  function updateZoomLabel() {
    const slide = viewer.currSlide;
    if (!slide || !zoomButton) return;
    const label = slide.currZoomLevel > slide.zoomLevels.initial + 0.01 ? "Fit image" : "Zoom in";
    zoomButton.textContent = label;
    zoomButton.setAttribute("aria-label", label);
  }

  viewer.on("uiRegister", () => {
    viewer.ui?.registerElement({
      name: "photo-zoom", isButton: true, order: 10, html: "Zoom in", ariaLabel: "Zoom in",
      onInit: element => { zoomButton = element; },
      onClick: () => viewer.toggleZoom(),
    });
    viewer.ui?.registerElement({
      name: "photo-close", isButton: true, order: 20, html: "Close", ariaLabel: "Close photograph",
      onClick: () => viewer.close(),
    });
    viewer.ui?.registerElement({
      name: "photo-caption", appendTo: "root", order: 30,
      onInit: element => {
        const title = document.createElement("h2");
        title.textContent = photo.name;
        const detail = document.createElement("p");
        detail.textContent = `${photo.location}${photo.date ? ` · ${photo.date}` : ""}`;
        const links = document.createElement("div");
        const addLink = (text: string, href: string) => {
          const link = document.createElement("a");
          link.textContent = text;
          link.href = href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          links.append(link);
        };
        addLink(`Photo: ${photo.photographer}`, photo.sourceUrl);
        if (photo.license && photo.licenseUrl) addLink(photo.license, photo.licenseUrl);
        addLink("Open original image", photo.src);
        element.append(title, detail, links);
        // Credits can wrap and scroll without zooming or dragging the photograph.
        element.addEventListener("pointerdown", event => event.stopPropagation());
        element.addEventListener("wheel", event => event.stopPropagation());
        captionObserver = new ResizeObserver(() => {
          const height = Math.ceil(element.getBoundingClientRect().height);
          if (height === captionHeight) return;
          captionHeight = height;
          viewer.updateSize(true);
        });
        captionObserver.observe(element);
      },
    });
  });
  viewer.on("afterInit", () => {
    viewer.element?.setAttribute("aria-label", `${photo.name} photograph`);
    viewer.element?.setAttribute("aria-modal", "true");
    document.body.style.overflow = "hidden";
    updateZoomLabel();
  });
  viewer.on("zoomPanUpdate", updateZoomLabel);
  viewer.on("keydown", event => {
    const key = event.originalEvent;
    if (key.key !== "Tab" || !viewer.element) return;
    const controls = [...viewer.element.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")]
      .filter(element => element.offsetParent !== null && element.tabIndex >= 0);
    const first = controls[0];
    const last = controls.at(-1);
    const active = document.activeElement;
    const destination = key.shiftKey && (active === first || active === viewer.element)
      ? last : !key.shiftKey && active === last ? first : undefined;
    if (!destination) return;
    key.preventDefault();
    event.preventDefault();
    destination.focus();
  });
  viewer.on("destroy", () => {
    captionObserver?.disconnect();
    document.body.style.overflow = previousOverflow;
  });
  trigger.focus({ preventScroll: true });
  try {
    viewer.init();
  } catch (error) {
    viewer.destroy();
    throw error;
  }
  return viewer;
}
