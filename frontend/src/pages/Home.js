import React, { useEffect, useState } from "react";
import SplitText from "../components/SplitText";
import Footer from "../components/Footer";
import Contact, { openContactModal } from "../components/Contact";

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
                            "linear-gradient(to bottom, rgba(0, 0, 0, 0.98), rgba(255,255,255,0.0))",
                    }}
                />

                <div className="relative px-6 pt-6">
                    <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-geologica font-thin text-[#fc9898] text-3xl tracking-wide">
                    <img alt="logo" src="/assets/images/Logo-transparent.png" width="44" />
                    <span>Arroww</span>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        openContactModal();
                    }}
                    className="flex items-center gap-2 rounded-[12px] border border-[#ffcaca] bg-[#ff8e8e75] px-5 py-2 font-geologica font-thin text-[#ffcaca]"
                    aria-label="Open contact form"
                >
                    <span>Contact Us</span>
                    <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-[18px] h-[18px] text-[#ffcaca]"
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
                        className="font-geologica font-light text-[#FF8181] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.25] text-left"
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
                        className="font-geologica font-thin text-[#f9a0a0] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.25] text-left"
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
                            "mt-14 flex items-center gap-1 text-[#f9a0a0] text-lg font-geologica font-thin transition-opacity duration-200 " +
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
                            className="w-[26px] h-[26px] text-[#f9a0a0]"
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

            <section id="about" className="min-h-screen flex items-center scroll-mt-24 bg-black">
                <div className="w-full px-6 sm:px-10 md:px-16 lg:px-20">
                    <div className="mx-auto max-w-6xl">
                        <div className="inline-flex items-center gap-3 rounded-full border border-[#ffcaca]/25 bg-black px-4 py-2">
                            <span className="font-geologica font-thin tracking-[0.25em] uppercase text-xs text-[#ffcaca]">
                                About
                            </span>
                            <span className="h-1 w-1 rounded-full bg-[#FF8181]" aria-hidden="true" />
                            <span className="font-geologica font-thin text-xs text-[#f9a0a0]">Arroww Studio</span>
                        </div>

                        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
                            <div className="lg:col-span-7">
                                <div className="flex items-start gap-5">
                                    <div className="mt-3 hidden sm:block h-16 w-px bg-[#FF8181]/35" aria-hidden="true" />
                                    <div>
                                        <h2 className="font-geologica font-light text-[#FF8181] text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
                                            Templates are easy.
                                            <span className="block font-thin text-[#f9a0a0]">Standing out isn't.</span>
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <p className="font-geologica font-thin text-[#ffcaca] text-lg sm:text-xl leading-relaxed mt-1">
                                    Arroww is a South African web development studio creating custom websites that help businesses move forward.
                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-[#FF8181]/20 bg-black px-4 py-4">
                                        <div className="font-geologica font-thin text-[#f9a0a0] text-xs tracking-[0.2em] uppercase">Build</div>
                                        <div className="mt-2 font-geologica font-light text-[#ffcaca]">Custom-first</div>
                                    </div>
                                    <div className="rounded-2xl border border-[#FF8181]/20 bg-black px-4 py-4">
                                        <div className="font-geologica font-thin text-[#f9a0a0] text-xs tracking-[0.2em] uppercase">Design</div>
                                        <div className="mt-2 font-geologica font-light text-[#ffcaca]">Brand-led</div>
                                    </div>
                                    {/* <div className="rounded-2xl border border-[#FF8181]/20 bg-black px-4 py-4">
                                        <div className="font-geologica font-thin text-[#f9a0a0] text-xs tracking-[0.2em] uppercase">Speed</div>
                                        <div className="mt-2 font-geologica font-light text-[#ffcaca]">Performance-minded</div>
                                    </div>
                                    <div className="rounded-2xl border border-[#FF8181]/20 bg-black px-4 py-4">
                                        <div className="font-geologica font-thin text-[#f9a0a0] text-xs tracking-[0.2em] uppercase">Support</div>
                                        <div className="mt-2 font-geologica font-light text-[#ffcaca]">Clear + responsive</div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="work" className="min-h-screen flex items-center scroll-mt-24 bg-black">
                <div className="w-full px-6 sm:px-10 md:px-16 lg:px-20">
                    <div className="mx-auto max-w-6xl">
                        <div className="inline-flex items-center gap-3 rounded-full border border-[#ffcaca]/25 bg-black px-4 py-2">
                            <span className="font-geologica font-thin tracking-[0.25em] uppercase text-xs text-[#ffcaca]">
                                Work
                            </span>
                            <span className="h-1 w-1 rounded-full bg-[#FF8181]" aria-hidden="true" />
                            <span className="font-geologica font-thin text-xs text-[#f9a0a0]">Previous Project</span>
                        </div>

                        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
                            <div className="lg:col-span-5">
                                <h2 className="font-geologica font-light text-[#FF8181] text-4xl sm:text-5xl leading-[1.1]">
                                    Schön Photography
                                    <span className="block font-thin text-[#f9a0a0]">Portfolio website</span>
                                </h2>

                                <p className="mt-6 font-geologica font-thin text-[#ffcaca] text-lg sm:text-xl leading-relaxed">
                                    A clean photography website that doesn't shout — because it doesn't need to.
                                </p>

                                <a
                                    href="https://www.schon-photography.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-8 inline-flex items-center gap-2 rounded-[12px] border border-[#FF8181]/30 bg-black px-5 py-3 font-geologica font-thin text-[#ffcaca]"
                                    aria-label="Visit Schon Photography website"
                                >
                                    <span>Visit website</span>
                                    <svg
                                        className="w-4 h-4 text-[#ffcaca]"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1"
                                            d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
                                        />
                                    </svg>

                                </a>
                            </div>

                            <div className="lg:col-span-6 flex justify-center lg:justify-end">
                                <a
                                    href="https://www.schon-photography.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full max-w-xs sm:max-w-md mt-2 rounded-[17px] border border-[#ffcaca]/80 overflow-hidden bg-[#ff8e8e75] flex items-center justify-center p-6 sm:p-6 bg:hover-[#ff8e8e75]"
                                    aria-label="Open Schon Photography website"
                                >
                                    <img
                                        src="/assets/images/White-Brand-Name.png"
                                        alt="Schön Photography logo"
                                        className="h-36 sm:h-44 md:h-52 w-auto max-w-[90%] opacity-90"
                                        loading="lazy"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Contact hideButton />
            <Footer />
        </div>
    );
}

export default Home;
