import React from "react";

const Steps = () => {
    return (
        <section className="max-w-[85%] mx-auto my-16 relative border border-[color:var(--color-divider)] rounded-2xl p-8 bg-[color:var(--color-bgc)] overflow-visible">
            <div className="relative z-10 py-13 pl-15">
                <ul className="steps steps-vertical lg:steps-horizontal text-[color:var(--color-txt)]">
                    <li className="step step-info">Post a Task</li>
                    <li className="step step-info">Browse Other Tasks</li>
                    <li className="step step-info">Place Bids</li>
                    <li className="step step-success">Get it Done</li>
                </ul>
            </div>

            <img
                src="/steps.png"
                alt="How It Works"
                className="hidden lg:block absolute top-[-2.1rem] right-[6rem] w-[250px] z-0"
            />

        </section>
    );
};

export default Steps;
