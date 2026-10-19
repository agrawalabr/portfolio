import Navbar from './components/Navbar/navbar';
import Profile from './components/Profile/profile';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Profile />
      </main>
    </div>
  );
}

export default App;
