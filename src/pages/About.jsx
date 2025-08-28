import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Create Your Profile",
      description:
        "Sign up and tell us about your learning goals, subjects of interest, and preferred learning style.",
    },
    {
      number: "2",
      title: "Find Your Tutor",
      description:
        "Browse through verified tutors, read reviews, and choose the perfect match for your needs.",
    },
    {
      number: "3",
      title: "Start Learning",
      description:
        "Book your first session and begin your personalized learning journey with expert guidance.",
    },
  ];

  return (
    <section className="bg-[#F5F5F5] py-16 px-5">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          How it <span className="text-purple-600">Works</span>
        </h2>
        <p className="text-gray-500 mb-12">
          Get started in just three simple steps and begin your personalized learning journey today
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Number Circle */}
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-2xl font-bold shadow-lg">
                {step.number}
              </div>

              {/* Line Connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[33%] w-[34%] h-[2px] bg-gray-300"></div>
              )}

              {/* Content */}
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
