interface CarouselConfig {
  loop?: boolean;
  slides: number;
  speed: number;
}

class Carousel {
  protected className: string;
  protected config: CarouselConfig;
  protected slidesArray: Array<HTMLElement>;
  protected container: HTMLElement;
  protected wrapper: HTMLElement;
  protected currentIndex: number = 0;
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
    this.applySlideWidths();
    this.createControls();
    this.goTo(0);
    this.listen();
  }

  protected calculateSlideWidth() {
    this.slideWidth = this.container.offsetWidth;
  }

  protected applySlideWidths() {
    this.slidesArray.forEach((slide) => {
      slide.style.minWidth = `${this.slideWidth}px`;
    });
  }

  protected createControls() {
    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-prev";
    prevBtn.textContent = "Prev";
    prevBtn.addEventListener("click", () => this.prev());

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-next";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => this.next());

    this.container.appendChild(prevBtn);
    this.container.appendChild(nextBtn);
  }

  protected listen() {
    window.addEventListener("resize", () => {
      this.calculateSlideWidth();
      this.applySlideWidths();
      this.goTo(this.currentIndex);
    });
  }

  goTo(index: number) {
    const max = this.slidesArray.length - 1;
    if (index < 0) {
      if (this.config.loop) {
        index = max;
      } else {
        index = 0;
      }
    }
    if (index > max) {
      if (this.config.loop) {
        index = 0;
      } else {
        index = max;
      }
    }

    this.currentIndex = index;
    const offset = this.currentIndex * this.slideWidth;
    this.wrapper.style.transform = `translateX(-${offset}px)`;
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }
}

export default Carousel;