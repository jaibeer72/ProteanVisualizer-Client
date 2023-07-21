import { compareTwoProteansPath } from './Utils/APIRoutsURlsHelper'
import './App.css';
import ProteinVisualizerComponent from './Components/ProteinVisualizerComponent';



function App() {
  const protean1 = 'https://files.rcsb.org/download/1R5M.pdb';
  const protean2 = 'https://files.rcsb.org/download/1crn.pdb';
  return (
    <div className="App">
        <ProteinVisualizerComponent proteinPaths={[compareTwoProteansPath + `protean1=`+protean1 + `&protean2=`+ protean2]} shoudlDisplaySuperImposed={true}/>
        <ProteinVisualizerComponent proteinPaths={['rcsb://1CSE.pdb','rcsb://1R5M.pdb']} shoudlDisplaySuperImposed={false}/>
        <ProteinVisualizerComponent proteinPaths={[protean2]} shoudlDisplaySuperImposed={false}/>
    </div>
  );
}

export default App;
