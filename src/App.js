import './App.css';

import WorkerFactory from './workers/worker-factory';
import myWorker from './workers/main-worker';
import {useCallback} from "react";

const workerInstance = new WorkerFactory(myWorker);

function App() {

  const handleDoSomethingPutLS  = useCallback(() => {
    const value = "" + Math.random() * 100;
    console.log("Client Side Generated Value", value)
    window.localStorage.setItem("test",value );
  }, [])

  const handleDoSomething = useCallback(() => {
    const localStorage = { ...window.localStorage };
    workerInstance.postMessage(localStorage);
    workerInstance.onmessage = (res) => {
      if(res.data.type === "setLocalStorage"){
        window.localStorage.setItem(res.data.data.key, res.data.data.value)
      }
      if(res.data.type === "removeLocalStorage"){
        window.localStorage.removeItem(res.data.data.key)
      }
      if(res.data.type === "clearLocalStorage"){
        window.localStorage.clear()
      }
      console.log(res.data);
    };
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <button style={{ height: 100}} onClick={handleDoSomething}>
          do something
        </button>
        <button style={{marginTop : 50, height: 100}} onClick={handleDoSomethingPutLS}>
          put something to localStorage
        </button>
      </header>
    </div>
  );
}

export default App;
