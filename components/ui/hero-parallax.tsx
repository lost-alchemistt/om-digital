"use client";
import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 8);
  const secondRow = products.slice(8, 16);
  const thirdRow = products.slice(16, 24);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 400, damping: 40, bounce: 0 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [-700, 300]),
    springConfig
  );

  React.useEffect(() => {
    const animationFrames: { [key: string]: number } = {};
    const scrollPositions: { [key: string]: number } = {
      row1: 0,
      row2: 0,
      row3: 0,
    };

    const startAutoScroll = () => {
      setTimeout(() => {
        const animate = () => {
          ["row1", "row2", "row3"].forEach((rowId) => {
            const row = document.getElementById(rowId);
            if (row) {
              const maxScroll = row.scrollWidth - row.clientWidth;
              if (maxScroll <= 0) return; // Skip if no scrollable content

              const speed = 0.5;
              const isReverse = rowId === "row1" || rowId === "row3";

              if (isReverse) {
                scrollPositions[rowId] = (scrollPositions[rowId] - speed) % maxScroll;
                // Handle negative values
                if (scrollPositions[rowId] < 0) {
                  scrollPositions[rowId] = maxScroll + scrollPositions[rowId];
                }
              } else {
                scrollPositions[rowId] = (scrollPositions[rowId] + speed) % maxScroll;
              }

              row.scrollLeft = scrollPositions[rowId];
            }
          });
          animationFrames["main"] = requestAnimationFrame(animate);
        };

        animate();
      }, 2000); // Start after initial animation
    };

    // Initialize scroll positions to ensure immediate visibility
    ["row1", "row2", "row3"].forEach((rowId) => {
      const row = document.getElementById(rowId);
      if (row) {
        // Allow manual scrolling too
        row.addEventListener("mouseenter", () => {
          if (animationFrames["main"]) {
            cancelAnimationFrame(animationFrames["main"]);
          }
        });

        row.addEventListener("mouseleave", () => {
          // Use the global animate function, not the local one
          if (!animationFrames["main"]) {
            const animate = () => {
              ["row1", "row2", "row3"].forEach((id) => {
                const r = document.getElementById(id);
                if (r) {
                  const maxScroll = r.scrollWidth - r.clientWidth;
                  if (maxScroll <= 0) return;

                  const speed = 0.5;
                  const isRev = id === "row1" || id === "row3";

                  if (isRev) {
                    scrollPositions[id] = (scrollPositions[id] - speed) % maxScroll;
                    if (scrollPositions[id] < 0) {
                      scrollPositions[id] = maxScroll + scrollPositions[id];
                    }
                  } else {
                    scrollPositions[id] = (scrollPositions[id] + speed) % maxScroll;
                  }

                  r.scrollLeft = scrollPositions[id];
                }
              });
              animationFrames["main"] = requestAnimationFrame(animate);
            };
            animate();
          }
        });
      }
    });

    startAutoScroll();

    return () => {
      if (animationFrames["main"]) {
        cancelAnimationFrame(animationFrames["main"]);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="h-[350vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" id="row1">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" id="row2">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" id="row3">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        The Ultimate <br /> development studio
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        We build beautiful products with the latest technologies and frameworks.
        We are a team of passionate developers and designers that love to build
        amazing products.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <div className="absolute inset-0 p-4">
          <Image
            src={product.thumbnail}
            height={600}
            width={600}
            className="object-cover object-left-top h-full w-full border border-neutral-200 dark:border-neutral-800 rounded-lg"
            alt={product.title}
            priority={false}
          />
        </div>
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
        