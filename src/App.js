import Navbar from './components/Navbar/navbar';
import LeftPanel from './components/Left-panel/left-panel';
import RightPanel from './components/Right-panel/right-panel';
import Profile from './components/Profile/profile';
import './App.css';

function App() {
  return (
    <div className='horizontal-div'>
      <Navbar className='navbar' />
      <div className='vertical-div'>
        <div className='left-panel'><LeftPanel /></div>
        <Profile className='profile' />
        <RightPanel className='right-panel' />
      </div>
    </div>
  );
}

export default App;
