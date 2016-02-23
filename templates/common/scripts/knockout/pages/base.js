import ViewModel from "../core/view-model";
import Example from "../components/example";

class Base extends ViewModel {

  constructor() {
    super();
    this.observable("example", new Example());
  }

  destroy() {
    this.example().destroy();
    super.destroy();
  }
}

export default Base;
