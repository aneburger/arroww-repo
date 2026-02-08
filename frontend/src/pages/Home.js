import React from "react";
import SplitText from "../components/SplitText";

const handleAnimationComplete = () => {
    console.log('All letters have animated!');
};


const Home = () => {
    return (
        <div className="min-h-screen flex items-center">
            <div className="w-full px-6 sm:px-10 md:px-16 lg:px-20">
                <SplitText
                    text="Templates are boring."
                    className="font-geologica font-thin text-[#CC5050] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.25] text-left"
                    delay={50}
                    duration={1.45}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="left"
                    onLetterAnimationComplete={handleAnimationComplete}
                    showCallback
                />

                <SplitText
                    text="Your business isn't."
                    className="font-geologica font-thin text-[#CC5050] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.25] text-left"
                    delay={190}
                    duration={1.05}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="left"
                    onLetterAnimationComplete={handleAnimationComplete}
                    showCallback
                />
            </div>
        </div>
    );
}

export default Home;
