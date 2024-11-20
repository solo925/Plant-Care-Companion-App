import React from "react";

const TailoredForYou: React.FC = () => {
  const items = [
    { title: "Plant Care Basics", subtitle: "Gardening Enthusiast" },
    { title: "Plant Care", subtitle: "Plant Doctor" },
    { title: "Plant Care 101", subtitle: "Plant Care Newbie" },
    { title: "Mastering Plant", subtitle: "Plant Care Guru" },
  ];

  return (
    <section className="tailored-for-you">
      <h2>Tailored for You</h2>
      <div className="cards">
        {items.map((item, index) => (
          <div key={index} className="card">
            <img src="https://via.placeholder.com/150" alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TailoredForYou;
