// eslint-disable-next-line import/no-anonymous-default-export

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

    class LocalStorageSimulator {
        constructor(initialValues = {},self) {
            this.storage = initialValues;
            this.self = self;
        }

        setItem(key, value) {
            this.storage[key] = value;
            this.self.postMessage({"type" : "setLocalStorage", data: {
                    key, value
                }});
        }

        getItem(key) {
            return this.storage[key] || null;
        }

        removeItem(key) {
            delete this.storage[key];
            this.self.postMessage({"type" : "removeLocalStorage", data: {
                    key
                }});
        }

        clear() {
            this.self.postMessage({"type" : "clearLocalStorage"});
        }
    }

    let storage;

    // eslint-disable-next-line no-restricted-globals
    self.addEventListener('message', async (event) => {
        // eslint-disable-next-line no-restricted-globals
        storage = new LocalStorageSimulator(event.data, self);
        // eslint-disable-next-line no-restricted-globals
        const storageValue = storage.getItem("test")
        console.log("Storage Value From Client Side", storageValue)
        await performIntensiveTask();
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let result = 1;

    async function performIntensiveTask() {
        console.log("web worker doing first big task");

        await sleep(5000);
        result+=1;
        storage.setItem("web-worker-result-1",  result )

        console.log("web worker doing second big task");

        await sleep(5000);

        storage.setItem("web-worker-result-2", result )

        console.log("web worker finished tasks");
    }
};