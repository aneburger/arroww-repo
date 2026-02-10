import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import LogoCursor from "./components/LogoCursor";
import NavBar from "./components/NavBar";
import DotGridBackground from "./components/DotGridBackground";

const App = () => {
    return (
            <BrowserRouter>
                <div style={{ position: "relative", minHeight: "100vh" }}>
                    {/* <LogoCursor size={48} ease={0.16} /> */}
                    <NavBar />
                    <DotGridBackground
                        dotSize={5}
                        gap={14}
                        baseColor="#271e37"
                        activeColor="#fd9292"
                        proximity={120}
                        speedTrigger={100}
                        shockRadius={250}
                        shockStrength={5}
                        maxSpeed={5000}
                        resistance={750}
                        returnDuration={1.5}
                        style={{ zIndex: 0 }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
    );
}

export default App;
