import {Link} from '@shopify/hydrogen';
import {Image} from '@shopify/hydrogen';

import { Button } from "../app/components/ui/Button";

export function CTA({
  title = "Elevate Your Space with Head Art Works",
  description = "Discover our handcrafted pieces that blend tradition with modern aesthetics.",
  buttonText = "Shop Collection",
  buttonUrl = "/collections/all",
  backgroundImage = null,
  imageAlignment = "right", // 'right', 'left', or 'none'
  backgroundColor = "#f8f8f8",
  textColor = "#333",
  buttonColor = "#000",
  buttonTextColor = "#fff"
}) {
  return (
    <section 
      className="cta-section"
      style={{
        backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
        color: textColor,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {backgroundImage && (
        <div className="cta-background-image">
          <Image 
            data={backgroundImage} 
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className={`flex flex-col ${imageAlignment === 'none' ? 'items-center text-center' : 'md:flex-row'} gap-8 relative z-10`}>
          
          {imageAlignment === 'left' && (
            <div className="md:w-1/2">
              <div className="cta-image-container rounded-lg overflow-hidden shadow-xl">
                <Image 
                  data={backgroundImage} 
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          )}
          
          <div className={`${imageAlignment !== 'none' ? 'md:w-1/2' : 'max-w-2xl mx-auto'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg mb-8">{description}</p>
            <Link to={buttonUrl}>
              <Button
                variant="default"
                size="lg"
                className="cta-button"
                style={{
                  backgroundColor: buttonColor,
                  color: buttonTextColor
                }}
              >
                {buttonText}
              </Button>
            </Link>
          </div>
          
          {imageAlignment === 'right' && (
            <div className="md:w-1/2">
              <div className="cta-image-container rounded-lg overflow-hidden shadow-xl">
                <Image 
                  data={backgroundImage} 
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}