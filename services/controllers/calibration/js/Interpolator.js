class Interpolator {
    constructor() {
        this.data = [];
    }

    addIndexValue(index, value) {
        this.data.push({index: index, value: value});

        // make sure items are in ascdending order by index
        this.data.sort((a, b) => a.index - b.index);
    }

    removeIndex(index) {
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].index === index) {
                this.data.splice(i, 1);
                break;
            }
        }
    }

    valueAtIndex(target_index) {
        if (target_index < this.data[0].index || this.data[this.data.length - 1].index < target_index) {
            return null;
        }
        else {
            var start = null
            var end = null;

            for (var i = 0; i < this.data.length; i++) {
                let current = this.data[i];

                if (current.index === target_index) {
                    return current.value;
                }
                else {
                    if (current.index <= target_index) {
                        start = current;
                    }
                    else if (target_index < current.index) {
                        end = current;
                        break;
                    }
                }
            }

            let index_delta = end.index - start.index;
            let percent = (target_index - start.index) / index_delta;
            let value_delta = end.value - start.value;

            return start.value + value_delta * percent;
        }
    }

    to_array() {
        return this.data.reduce((accum, item) => {
            accum.push(item.index);
            accum.push(item.value);

            return accum;
        }, []);
    }
}
