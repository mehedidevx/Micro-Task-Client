import React from 'react';

const HowItWorks = () => {
  const steps = [
    { title: "1. Create an Account", desc: "Sign up as a client or freelancer." },
    { title: "2. Post or Browse Tasks", desc: "Clients post jobs, freelancers apply." },
    { title: "3. Complete & Get Paid", desc: "Submit task and receive payment securely." },
  ];

  return (
    <div className="py-16 px-4 text-center ">
      <h2 className="text-3xl font-bold mb-8">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {steps.map((step, idx) => (
          <div key={idx} className=" p-6 shadow rounded-xl">
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;