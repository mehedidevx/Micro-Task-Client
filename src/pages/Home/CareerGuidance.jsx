import React from "react";

const guidance = [
  {
    step: 1,
    title: "Identify Your Skills",
    detail: "Understand what you are good at and want to pursue.",
  },
  {
    step: 2,
    title: "Build a Portfolio",
    detail: "Showcase your best work to attract clients or employers.",
  },
  {
    step: 3,
    title: "Keep Learning",
    detail: "Stay updated with new tools and technologies relevant to your field.",
  },
];

const CareerGuidance = () => {
  return (
    <section className="container mx-auto py-12 ">
      <h2 className="text-3xl font-bold mb-8 text-center">Career Guidance</h2>
      <div className="space-y-8">
        {guidance.map(({ step, title, detail }) => (
          <div key={step} className="p-6 bg-base-200 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Step {step}: {title}</h3>
            <p className="text-gray-700 dark:text-gray-400">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CareerGuidance;
