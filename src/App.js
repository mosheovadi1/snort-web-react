// import logo from './logo.svg';
import './App.css';
import RunScan from "./components/ScanButton/RunScan";
import SnortForm from './components/SnortForm/SnortForm';
import { FormProvider} from "./components/FormProvider/FormProvider";
import TextArea from "./components/SnortTextArea/SnortTextArea";

function App() {
  return (
      <FormProvider>
        <TextArea />
        <SnortForm className="App-header"></SnortForm>
        <RunScan/>
      </FormProvider>
  );
}

export default App;
