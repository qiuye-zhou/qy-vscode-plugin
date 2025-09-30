import * as vscode from 'vscode'

export function css(template: TemplateStringsArray, ...args: any[]) {
  return template.reduce((prev, curr, i) => {
    let arg = args[i]

    if (typeof arg === 'function') {
      arg = arg()
    }
    if (Array.isArray(arg)) {
      arg = arg.join('')
    }

    return prev + curr + (arg ?? '')
  }, '')
}

export abstract class AbsPatchGenerator<T extends { images: string[] }> {
  protected config: T

  constructor(config: T) {
    this.config = {
      ...config,
      images: this.normalizeImageUrls(config?.images || []),
    }
  }

  protected normalizeImageUrls(images: string[]) {
    return images.map((imageUrl) => {
      if (!imageUrl.startsWith('file://')) {
        return imageUrl
      }

      const url = imageUrl.replace('file://', 'vscode-file://vscode-app')
      return vscode.Uri.parse(url).toString()
    })
  }

  protected compileCSS(source: string) {
    // 简单的CSS处理 - 移除注释和多余空格
    return source
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/;\s*/g, ';')
      .replace(/{\s*/g, '{')
      .replace(/}\s*/g, '}')
      .trim()
  }

  protected getPreload() {
    const images = (this.config?.images || []).filter((n) => n.length)
    if (!images.length || images.length > 10) {
      return ''
    }
    return `
const images = ${JSON.stringify(images)};

const container = (() => {
    const cid = 'backgroundPreloadContainer';
    let c = document.getElementById(cid);
    if (!c) {
        c = document.createElement('div');
        c.id = cid;
        c.style.width = 0;
        c.style.height = 0;
        c.style.opacity = 0;
        c.style.overflow = 'hidden';
        document.body.appendChild(c);
    }
    return c;
})();

const div = document.createElement('div');
div.style.backgroundImage = images.map(url => 'url(' + url + ')').join(',');
container.appendChild(div);
`
  }

  protected getStyle() {
    return ''
  }

  protected getScript() {
    return ''
  }

  public create() {
    if (!this.config?.images.length) {
      return ''
    }

    const style = this.compileCSS(this.getStyle())
    const script = this.getScript().trim()

    return [
      this.getPreload(),
      `
                var style = document.createElement("style");
                style.textContent = ${JSON.stringify(style)};
                document.head.appendChild(style);
            `,
      script,
    ]
      .filter((n) => !!n.length)
      .map((n) => `(function(){${n}})();`)
      .join(';')
  }
}
