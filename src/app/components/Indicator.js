export default class Indicator {
    constructor(indicator) {
        this.indicator = indicator;
        this.state = false;

        this.render();
    }

    update(props) {
        const newState = props.notifications.length > 0;

        if (newState != this.state) {
            this.state = newState;
            this.render();
        }
    }

    render() {
        global.log('render indicator', this.state);
        const text = this.state ? '⚫' : '';
        this.indicator.set_text(text);
    }
}
