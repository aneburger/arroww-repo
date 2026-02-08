import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import DotGridBackground from "./components/DotGridBackground";

const App = () => {
    return (
            <BrowserRouter>
                <div style={{ position: "relative", minHeight: "100vh" }}>
                    <DotGridBackground
                        dotSize={4}
                        gap={14}
                        baseColor="#f9dcdc"
                        activeColor="#eb0400"
                        proximity={110}
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
