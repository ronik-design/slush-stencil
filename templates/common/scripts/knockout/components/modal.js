import ViewModel from "../core/view-model";

const DEFAULT_TEMPLATE = "modal-default";

class Modal extends ViewModel {

  constructor(options) {

    super();

    this.defaultTemplate = options.modalDefaultTemplate || DEFAULT_TEMPLATE;

    this.observable("isOpen", false);
    this.observable("modalName", this.defaultTemplate);

    document.onkeydown = (evt) => {
      if (this.isOpen() && evt.keyCode === 27) {
        this.close();
      }
    };
  }

  open(data, event) {

    const modalName = event.currentTarget.getAttribute("data-modal");

    this.modalName(modalName);
    this.isOpen(true);
  }

  close() {

    this.modalName(this.defaultTemplate);
    this.isOpen(false);
  }

  toggle(data, event) {

    const modalName = event.currentTarget.getAttribute("data-modal");

    if (this.modalName() === modalName) {

      this.isOpen(!this.isOpen());

    } else {

      this.open(data, event);
    }
  }

  destroy() {
    super.destroy();
  }
}

export default Modal;
