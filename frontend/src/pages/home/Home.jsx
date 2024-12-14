import React from 'react';
import { Button } from 'primereact/button';

const HomePage = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="grid grid-nogutter surface-0 text-800">
                <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center">
                    <section>
                        <span className="block text-6xl font-bold mb-1">Learn Programming</span>
                        <div className="text-6xl text-primary font-bold mb-3">The Open-Source Way</div>
                        <p className="mt-0 mb-4 text-700 line-height-3">
                            Master programming concepts with structured roadmaps, problem sets, contests, and a workspace to practice and submit solutions.
                            All hosted securely on your server.
                        </p>
                        <Button label="Get Started" type="button" className="mr-3 p-button-raised" />
                        <Button label="Live Demo" type="button" className="p-button-outlined" />
                    </section>
                </div>
                <div className="col-12 md:col-6 overflow-hidden">
                    <img
                        src="/demo/images/blocks/hero/hero-1.png"
                        alt="hero"
                        className="md:ml-auto block md:h-full"
                        style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }}
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className="surface-0 text-center">
                <div className="mb-3 font-bold text-3xl">
                    <span className="text-900">One Platform, </span>
                    <span className="text-blue-600">Endless Opportunities</span>
                </div>
                <div className="text-700 mb-6">
                    A comprehensive learning platform tailored for programmers, designed to make coding easy, fun, and accessible to everyone.
                </div>
                <div className="grid">
                    <div className="col-12 md:col-4 mb-4 px-5">
                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                            <i className="pi pi-calendar text-4xl text-blue-500"></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">Interactive Roadmaps</div>
                        <span className="text-700 line-height-3">
                            Step-by-step guides to help you navigate through programming concepts, tailored for beginners and advanced learners.
                        </span>
                    </div>
                    <div className="col-12 md:col-4 mb-4 px-5">
                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                            <i className="pi pi-pencil text-4xl text-blue-500"></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">Problem Sets</div>
                        <span className="text-700 line-height-3">
                            Solve curated coding problems with test cases to enhance your programming skills and logical thinking.
                        </span>
                    </div>
                    <div className="col-12 md:col-4 mb-4 px-5">
                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                            <i className="pi pi-users text-4xl text-blue-500"></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">Contests</div>
                        <span className="text-700 line-height-3">
                            Participate in coding contests to challenge your skills and compete with programmers globally.
                        </span>
                    </div>
                    <div className="col-12 md:col-4 mb-4 px-5">
                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                            <i className="pi pi-code text-4xl text-blue-500"></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">Integrated Workspace</div>
                        <span className="text-700 line-height-3">
                            Write, execute, and debug your code directly on the platform with language-specific features.
                        </span>
                    </div>
                    <div className="col-12 md:col-4 mb-4 px-5">
                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                            <i className="pi pi-github text-4xl text-blue-500"></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">Open Source</div>
                        <span className="text-700 line-height-3">
                            Fully transparent and customizable. Hosted on your server, you control the data and the experience.
                        </span>
                    </div>
                    <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
                        <span className="p-3 shadow-2 mb-3 inline-block" style={{ borderRadius: '10px' }}>
                            <i className="pi pi-lock text-4xl text-blue-500"></i>
                        </span>
                        <div className="text-900 text-xl mb-3 font-medium">Secure</div>
                        <span className="text-700 line-height-3">
                            Keep your learning environment private and secure with robust data encryption.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
