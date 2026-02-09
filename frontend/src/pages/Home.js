import React from "react";
import SplitText from "../components/SplitText";

const handleAnimationComplete = () => {
    console.log('All letters have animated!');
};


const Home = () => {
    return (
        <div>
            <header className="fixed top-6 left-6 right-6 z-40 flex items-center justify-between">
                <div className="flex items-center gap-3 font-geologica font-thin text-[#CC5050] text-2xl tracking-wide">
                    <img alt="logo" src="/assets/images/Logo-transparent.png" width="44" />
                    <span>Arroww</span>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        const el = document.getElementById("contact");
                        el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="flex items-center gap-2 rounded-full border border-[#CC5050] bg-white px-5 py-2 font-geologica font-thin text-[#CC5050]"
                    aria-label="Scroll to contact"
                >
                    <span>Contact</span>
                    <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-[18px] h-[18px] text-[#CC5050]"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="0.7"
                            d="M19 12H5m14 0-4 4m4-4-4-4"
                        />
                    </svg>
                </button>
            </header>

            <section id="home" className="min-h-screen flex items-center scroll-mt-24">
                <div className="w-full px-6 sm:px-10 md:px-16 lg:px-20">
                    <SplitText
                        text="Templates are boring."
                        className="font-geologica font-light text-[#F35a5a] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.25] text-left"
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
                        className="font-geologica font-thin text-[#FF8181] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.25] text-left"
                        delay={130}
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
            </section>

            <section id="about" className="min-h-screen flex items-center scroll-mt-24">
                <div className="w-full px-6 sm:px-10 md:px-16 lg:px-20">
                    <h2 className="font-geologica font-thin text-[#CC5050] text-4xl sm:text-5xl">
                        About
                    </h2>
                </div>
            </section>

            <section id="services" className="min-h-screen flex items-center scroll-mt-24">
                <div className="w-full px-6 sm:px-10 md:px-16 lg:px-20">
                    <h2 className="font-geologica font-thin text-[#CC5050] text-4xl sm:text-5xl">
                        Services
                    </h2>
                </div>
            </section>

            <section id="contact" className="min-h-screen flex items-center scroll-mt-24">
                <div className="w-full px-6 sm:px-10 md:px-16 lg:px-20">
                    <h2 className="font-geologica font-thin text-[#CC5050] text-4xl sm:text-5xl">
                        Contact
                    </h2>
                </div>
            </section>
        </div>
    );
}

export default Home;
