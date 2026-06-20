import type { CarouselConfig } from "./config.type";

class Carousel {
  protected className: string;
  protected config: CarouselConfig;
  protected slidesArray: Array<HTMLElement>;
  protected realCount: number = 0;
  protected container: HTMLElement;
  protected wrapper: HTMLElement;
  protected currentIndex: number = 0;
  protected wrapperWidth: number = 0;
  protected slideWidth: number = 0;

  constructor(className: string, config: CarouselConfig) {
    this.className = className;
    this.config = config;

    const container = document.querySelector<HTMLElement>(`.${className}`);
    if (!container) throw new Error(`Container .${className} not found`);
    this.container = container;

    const wrapper = this.container.querySelector<HTMLElement>(`.wrapper`);
    if (!wrapper) throw new Error(`Wrapper not found in .${className}`);
    this.wrapper = wrapper;

    const slides = this.container.querySelectorAll<HTMLElement>(`.slide`);
    this.slidesArray = Array.from(slides);

    this.init();
  }

  protected init() {
    this.container.style.setProperty('--carousel-speed', `${this.config.speed}ms`);
    this.calculateSlideWidth();
    if (this.config.loop) {
      this.cloneSlides();
    }
    this.applySlideWidths();
    this.createControls();
    this.goTo(0);
    this.listen();
  }

  protected calculateSlideWidth() {
    this.wrapperWidth = this.container.offsetWidth;
    this.slideWidth = this.wrapperWidth / (this.config.slides ?? 1);
  }

  protected cloneSlides() {
    this.realCount = this.slidesArray.length;
    const clones = this.slidesArray.slice(0, this.config.slides).map((slide) => {
      const clone = slide.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });
    clones.forEach((clone) => this.wrapper.appendChild(clone));
    this.slidesArray = Array.from(
      this.wrapper.querySelectorAll<HTMLElement>('.slide')
    );
  }

  protected applySlideWidths() {
    this.slidesArray.forEach((slide) => {
      slide.style.width = `${this.slideWidth}px`;
    });
  }

  protected createControls() {
    if (!this.config.btn) {
      let prevBtn = document.querySelector<HTMLButtonElement>(`.${this.config.prevBtn}`);
      if (!(prevBtn instanceof HTMLButtonElement)) {
        prevBtn = document.createElement("button");
        prevBtn.className = "carousel-prev";
        prevBtn.textContent = "Prev";
        this.container.appendChild(prevBtn);
      }
      prevBtn.addEventListener("click", () => this.prev());

      let nextBtn = document.querySelector<HTMLButtonElement>(`.${this.config.nextBtn}`);
      if (!(nextBtn instanceof HTMLButtonElement)) {
        nextBtn = document.createElement("button");
        nextBtn.className = "carousel-next";
        nextBtn.textContent = "Next";
        this.container.appendChild(nextBtn);
      }
      nextBtn.addEventListener("click", () => this.next());
    }
  }

  protected listen() {
    window.addEventListener("resize", () => {
      this.calculateSlideWidth();
      this.applySlideWidths();
      this.goTo(this.currentIndex);
    });
  }

  goTo(index: number) {
    if (this.config.loop) {
      this.goToLoop(index);
    } else {
      this.goToClamp(index);
    }
  }

  protected goToClamp(index: number) {
    const max = this.slidesArray.length - (this.config.slides ?? 1);
    const clamped = Math.max(0, Math.min(max, index));
    this.animateTo(clamped);
  }

  protected goToLoop(index: number) {
    if (index < 0) {
      // Backward past start: silently jump to clone zone, then animate to last real slide
      this.jumpTo(this.realCount);
      requestAnimationFrame(() => {
        this.animateTo(this.realCount - 1);
      });
      return;
    }

    if (index >= this.realCount) {
      // Forward into clones: animate, then silently reset to corresponding real slide
      this.animateTo(index);
      const handler = (e: TransitionEvent) => {
        if (e.target !== this.wrapper || e.propertyName !== 'transform') return;
        this.wrapper.removeEventListener('transitionend', handler);
        this.jumpTo(index - this.realCount);
      };
      this.wrapper.addEventListener('transitionend', handler);
      return;
    }

    this.animateTo(index);
  }

  protected animateTo(index: number) {
    this.currentIndex = index;
    this.wrapper.style.transform = `translateX(-${this.currentIndex * this.slideWidth}px)`;
  }

  protected jumpTo(index: number) {
    this.wrapper.style.transition = 'none';
    this.currentIndex = index;
    this.wrapper.style.transform = `translateX(-${this.currentIndex * this.slideWidth}px)`;
    // Force reflow so the jump applies before re-enabling transition
    void this.wrapper.offsetWidth;
    this.wrapper.style.transition = '';
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }
}

export default Carousel;