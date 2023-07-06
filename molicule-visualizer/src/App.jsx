import './App.css';
import ProteinVisualizerComponent from './Components/ProteinVisualizerComponent';



function App() {
  return (
    <div className="App">
        <ProteinVisualizerComponent proteinPaths={['http://localhost:3003/TestProteans/SuperImposed.pdb.pdb','rcsb://1R5M.pdb']} shoudlDisplaySuperImposed={true}/>
        <ProteinVisualizerComponent proteinPaths={['rcsb://1CSE.pdb']} shoudlDisplaySuperImposed={true}/>
        <ProteinVisualizerComponent proteinPaths={['rcsb://1crn.pdb']} shoudlDisplaySuperImposed={true}/>
    </div>
  );
}

export default App;
