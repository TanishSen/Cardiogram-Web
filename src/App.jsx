import "./App.css";
import Header from "./components/Header";
import HeartRate from "./components/HeartRate";
import QRSComplex from "./components/QRSComplex";
import RRInterval from "./components/RRInterval";
import PRInterval from "./components/PRInterval";
import STSegment from "./components/STSegment";
import TWave from "./components/TWave";

function App() {
  return (
    <div className="container">
      <Header />
      <div className="grid-layout">
        <div className="grid-item-heart">
          <HeartRate />
        </div>
        <div className="grid-item-qrs">
          <QRSComplex />
        </div>
        <div className="grid-item">
          <RRInterval />
        </div>
        <div className="grid-item">
          <PRInterval />
        </div>
        <div className="grid-item-red">
          <STSegment />
        </div>
        <div className="grid-item">
          <TWave />
        </div>
      </div>
    </div>
  );
}

export default App;
