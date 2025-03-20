import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import { IProduct } from '@/models/Product.model';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface Props {
  product: IProduct;
}

const CarouselComponent = ({ product }: Props) => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  return (
    <Carousel responsive={responsive}>
      <Box height={'30vh'} width={'100%'} position='relative'>
        <Image
          src={product.mainPic}
          alt={product.name}
          fill
          objectFit='contain'
        />
      </Box>
      {product.otherImages.map((img, i) => (
        <Box key={i} height={'30vh'} width={'100%'} position='relative'>
          <Image src={img} alt={product.name} fill objectFit='contain' />
        </Box>
      ))}
    </Carousel>
  );
};


export default CarouselComponent;
