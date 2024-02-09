import './App.css';

import WorkerFactory from './workers/worker-factory';
import myWorker from './workers/main-worker';
import {useCallback, useEffect, useState} from "react";

const workerInstance = new WorkerFactory(myWorker);

function App() {
  const [, setManualRender] = useState({})

  useEffect(() => {
    localStorage.clear()
  }, [])

  const handleDoSomethingPutLS  = useCallback(() => {
    const value = "" + Math.random() * 100;
    console.log("Client Side Generated Value", value)
    window.localStorage.setItem("test",value );
    setManualRender({})
  }, [])

  const handleDoSomething = useCallback(() => {
    const localStorage = { ...window.localStorage };
    workerInstance.postMessage(localStorage);
    workerInstance.onmessage = (res) => {
      setManualRender({})
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
        <pre style={{padding :"0 100", whiteSpace: 'normal'}}>
          {JSON.stringify(window.localStorage)}
        </pre>
        <br/>
        <button style={{ height: 100}} onClick={handleDoSomething}>
          start something big task on web worker
        </button>
        <button style={{marginTop : 50, height: 100}} onClick={handleDoSomethingPutLS}>
          put something to localStorage
        </button>
      </header>
    </div>
  );
}

export default App;
