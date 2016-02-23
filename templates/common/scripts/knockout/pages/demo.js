import Base from "./base";

class Demo extends Base {

  constructor() {
    super();
    this.observable("stats", []);
  }

  onSubmit() {
    // const $form = $(form);

    // const stat = {
    //   multiplier: $form.find("#stat-multiplier").val(),
    //   heading: $form.find("#stat-heading").val(),
    //   description: $form.find("#stat-description").val()
    // };

    // $form.trigger("reset");

    // this.stats.push(stat);
  }

  destroy() {
    super.destroy();
  }
}

export default Demo;
