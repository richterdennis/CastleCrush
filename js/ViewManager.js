export default class ViewManager {
  constructor() {
    this.cache = {};
  }

  async load(view) {
    const html = await fetch(`templates/${view}.html`).then(res => res.text());
    document.querySelector('main#view').innerHTML = html;
  }
}
