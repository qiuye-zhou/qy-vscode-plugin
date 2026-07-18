import { AbsPatchGenerator, css } from './PatchGenerator'

export class FullscreenPatchGeneratorConfig {
  images = [] as string[]
  opacity = 0.1
  size = 'cover' as 'cover' | 'contain'
  position = 'center'
  interval = 0
  random = false
}

export class FullscreenPatchGenerator<
  T extends FullscreenPatchGeneratorConfig,
> extends AbsPatchGenerator<T> {
  protected cssvariable = '--background-fullscreen-img'

  protected get curConfig(): T {
    const cur = {
      ...new FullscreenPatchGeneratorConfig(),
      ...this.config,
    }

    if (cur.opacity < 0 || cur.opacity > 0.6) {
      cur.opacity = new FullscreenPatchGeneratorConfig().opacity
    }

    return cur
  }

  protected getStyle(): string {
    const { size, position, opacity } = this.curConfig

    return css`
      .background-layer {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-image: var(${this.cssvariable}) !important;
        background-size: ${size} !important;
        background-repeat: no-repeat !important;
        background-position: ${position} !important;
        opacity: ${opacity} !important;
        z-index: 999999 !important;
        pointer-events: none !important;
        transition: opacity 1s !important;
      }
    `
  }

  protected getScript(): string {
    const { images, random, interval } = this.curConfig

    if (!images || images.length === 0) {
      return ''
    }

    return `
const cssvariable = '${this.cssvariable}';
const images = ${JSON.stringify(images)};
const random = ${random};
const interval = ${interval};

let curIndex = -1;

function getNextImg() {
    if (random) {
        return images[Math.floor(Math.random() * images.length)];
    }

    curIndex++;
    curIndex = curIndex % images.length;
    return images[curIndex];
}

function setNextImg() {
    document.body.style.setProperty(cssvariable, 'url(' + getNextImg() + ')');
}

function createBackgroundLayer() {
    let layer = document.getElementById('qy-background-layer');
    if (!layer) {
        layer = document.createElement('div');
        layer.id = 'qy-background-layer';
        layer.className = 'background-layer';
        document.body.appendChild(layer);
    }
}

createBackgroundLayer();

if (interval > 0) {
    setInterval(setNextImg, interval * 1000);
}

setNextImg();
        `
  }
}
