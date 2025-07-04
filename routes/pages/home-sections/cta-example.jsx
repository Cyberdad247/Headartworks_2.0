import {CTA} from '../../../components/CTA';

export default function CTAExample() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 px-4">CTA Section Examples</h1>
      
      {/* Example 1: Basic CTA with right image */}
      <CTA 
        title="Discover Our Premium Collection"
        description="Handcrafted with care and attention to detail, our products bring elegance to any space."
        buttonText="Shop Now"
        buttonUrl="/collections/featured"
        backgroundImage={{
          url: '/images/cta-image-1.jpg',
          altText: 'Elegant handcrafted product display'
        }}
        imageAlignment="right"
      />
      
      {/* Example 2: CTA with left image */}
      <CTA 
        title="Limited Edition Pieces"
        description="Our seasonal collection is available for a limited time. Don't miss the opportunity to own these unique pieces."
        buttonText="View Collection"
        buttonUrl="/collections/limited"
        backgroundImage={{
          url: '/images/cta-image-2.jpg',
          altText: 'Limited edition art pieces'
        }}
        imageAlignment="left"
        backgroundColor="#f0f0f0"
        buttonColor="#d85a1a"
      />
      
      {/* Example 3: Full-width background CTA */}
      <CTA 
        title="Join Our Community"
        description="Subscribe to our newsletter and be the first to know about new releases, special offers, and exclusive events."
        buttonText="Subscribe"
        buttonUrl="/pages/newsletter"
        backgroundImage={{
          url: '/images/cta-background.jpg',
          altText: 'Art studio background'
        }}
        imageAlignment="none"
        textColor="#ffffff"
        buttonColor="#ffffff"
        buttonTextColor="#000000"
      />
    </div>
  );
}