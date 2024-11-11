import plant1 from '../../assets/plant1.webp';
import plant2 from '../../assets/plant2.webp';
import Footer from '../../componets/Home/Footer';
import Header from '../../componets/Home/Header';
import PlantCard from '../../componets/Home/PLantCard';

const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <h2>Welcome to the Plant Care Companion!</h2>
        <p>Explore plants, get care tips, and much more...</p>
        <div className="main-content">
          <PlantCard
            imageSrc={plant1}
            name="Fiddle Leaf Fig"
            description="A beautiful indoor plant that requires moderate light."
          />
          <PlantCard
            imageSrc={plant2}
            name="Aloe Vera"
            description="A hardy, low-maintenance plant known for its healing properties."
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
