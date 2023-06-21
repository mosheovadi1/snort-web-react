// import logo from './logo.svg';
import './App.css';
import SnortForm from './components/SnortForm/SnortForm';
import { FormProvider} from "./components/SnortForm/FormProvider";
import TextArea from "./components/SnortForm/SnortTextArea"

function App() {
  return (
      <FormProvider>
        <TextArea />
        <SnortForm className="App-header"></SnortForm>
      </FormProvider>
  );
}

export default App;
