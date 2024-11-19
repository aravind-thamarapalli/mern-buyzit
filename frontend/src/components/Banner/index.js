import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import "./banner.css"

const banners = [
  {
    id: 1,
    imageSrc: "./banner-1.avif",
    altText: "Banner 1",
  },
  {
    id: 2,
    imageSrc: "./banner-2.jpg",
    altText: "Banner 2",
  },
  {
    id: 3,
    imageSrc: "./banner-3.avif",
    altText: "Banner 3",
  },
];

const BannerSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768, // Tablets
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480, // Mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="banner-slider">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className="banner-slide">
            <img 
              src={banner.imageSrc} 
              alt={banner.altText} 
              className="w-full h-auto object-cover" 
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
