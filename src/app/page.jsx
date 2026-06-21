import Header from "./components/Header/Header";
import { QuickSearch } from "./components/QuickSearch/QuickSearch";
import { HowItWorks } from "./components/HowItWorks/HowItWorks";
import { FeaturedProfiles } from "./components/FeaturedProfiles/FeaturedProfiles";
import { WhyChooseUs } from "./components/WhyChooseUs/WhyChooseUs";
import { Testimonials } from "./components/Testimonials/Testimonials";
import FAQs from "./components/FAQs/FAQs";
import CTABanner from "./components/CTABanner/CTABanner";
import Footer from "./components/Footer/Footer";


export default function Home() {
  return (
    <>
      <Header />
      <QuickSearch />
      <HowItWorks/>
      <FeaturedProfiles />
      <WhyChooseUs />
      <Testimonials />
      <FAQs />
      <CTABanner/>
     <Footer/>
    </>
  );
}
