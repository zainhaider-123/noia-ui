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

  constructor(className: string, config: CarouselConfig) {
    this.className = className;
    this.config = config;

    const container = document.querySelector<HTMLElement>(`.${className}`);
    if (!container) throw new Error(`Container .${className} not found`);
    this.container = container;

    const wrapper = this.container.querySelector<HTMLElement>(`.${className} .wrapper`);
    if (!wrapper) throw new Error(`Wrapper not found in .${className}`);
    this.wrapper = wrapper;

    const slides = this.container.querySelectorAll<HTMLElement>(`.slide`);
    this.slidesArray = Array.from(slides);
  }

  next() {
    let nextBtn = document.querySelector<HTMLButtonElement>(`.${this.className} #next`);

    if (!nextBtn) {
      nextBtn = document.createElement("button");
      nextBtn.textContent = "Next";
      this.container.appendChild(nextBtn);
    }
  }



}

export default Carousel