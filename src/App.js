import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { Outlet } from 'react-router-dom';
import Footer from '../src/components/footer/footer'
import './App.css';

function App() {
  return (
    <div className="App">
      <Outlet/>
      <Footer/>
    </div>
  );
}

export default App;
