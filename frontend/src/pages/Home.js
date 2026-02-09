import React, { useEffect, useState } from "react";
import SplitText from "../components/SplitText";
import Footer from "../components/Footer";

const handleAnimationComplete = () => {
    console.log('All letters have animated!');
};


const Home = () => {
    const [headerFade, setHeaderFade] = useState(0);
    const [showScrollHint, setShowScrollHint] = useState(true);

    useEffect(() => {
        let raf = 0;
        const update = () => {
            const y = typeof window === "undefined" ? 0 : window.scrollY || 0;
            // Start appearing immediately after scroll begins.
            const next = Math.max(0, Math.min(1, y / 80));
            setHeaderFade(next);
            setShowScrollHint(y < 4);
        };

        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                update();
            });
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) window.cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div>
            <header className="fixed top-0 left-0 right-0 z-40">
                <div
                    aria-hidden="true"
                    className="pointer-events-none"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 140,
                        opacity: headerFade,
                        transition: "opacity 160ms ease",
                        background:
                            "linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(255,255,255,0.0))",
                    }}
                />

                <div className="relative px-6 pt-6">
                    <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-geologica font-thin text-[#CC5050] text-3xl tracking-wide">
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
                    </div>
                </div>
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

                    <div
                        className={
                            "mt-14 flex items-center gap-1 text-[#CC5050] text-lg font-geologica font-thin transition-opacity duration-200 " +
                            (showScrollHint ? "opacity-100" : "opacity-0")
                        }
                        aria-hidden={!showScrollHint}
                    >
                        <span>Scroll</span>
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="w-[26px] h-[26px] text-[#CC5050]"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="0.7"
                                d="M12 19V5m0 14-4-4m4 4 4-4"
                            />
                        </svg>
                    </div>
                </div>

            </section>

            <section id="about" className="min-h-screen flex items-center scroll-mt-24">
                <div className="w-full px-6 sm:px-10 md:px-16 lg:px-20">
                    <h2 className="font-geologica font-thin text-[#CC5050] text-4xl sm:text-5xl">
                        Templates are easy. Standing out isn't.
                    </h2>
                    <h2 className="font-geologica font-thin text-[#CC5050] text-4xl sm:text-5xl">
                        Arroww is a South African web development studio creating custom websites that help businesses move forward.
                    </h2>
                </div>
            </section>

            <section>
                Work done
            </section>

            <Footer />
        </div>
    );
}

export default Home;
