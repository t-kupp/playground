"use client";

import { useEffect, useState, useRef } from "react";

export default function LineDiv() {
  const [horLine, setHorLine] = useState(0);
  const [verLine, setVerLine] = useState(0);
  const [touchedProduct, setTouchedProduct] = useState({});
  const [products, setProducts] = useState([]);
  const productRefs = useRef([]);

  // Fetch product data
  useEffect(() => {
    async function getData() {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      console.log(data);
      setProducts(data);
    }
    getData();
  }, []);

  // Update mouse and lines positions
  useEffect(() => {
    let currentMouseX = 0;
    let currentMouseY = 0;

    const updateIntersection = () => {
      const newHorLine = (currentMouseY / window.innerHeight) * 100;
      const newVerLine = (currentMouseX / window.innerWidth) * 100;

      setHorLine(newHorLine);
      setVerLine(newVerLine);

      // Calculate the actual pixel position of the horizontal line
      const clampedTop = Math.max(
        200,
        Math.min(currentMouseY, window.innerHeight - 100),
      );

      checkIntersection(clampedTop);
    };

    const handleMouse = (e) => {
      currentMouseX = e.clientX;
      currentMouseY = e.clientY;
      updateIntersection();
    };

    const handleScroll = () => {
      updateIntersection();
    };

    const checkIntersection = (lineY) => {
      for (let i = 0; i < productRefs.current.length; i++) {
        const product = productRefs.current[i];
        if (product) {
          const rect = product.getBoundingClientRect();
          // Check if the horizontal line intersects with this product
          if (lineY >= rect.top && lineY <= rect.bottom) {
            console.log("intersected");

            setTouchedProduct(products[i]);
            product.classList.add("isActive");
          } else {
            product.classList.remove("isActive");
          }
        }
      }
      return null;
    };
    updateIntersection();

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [products]);

  return (
    <div className="flex min-h-screen w-screen justify-end bg-neutral-300">
      <div className="fixed top-0 left-0 h-screen w-screen">
        <div className="relative flex h-full w-full">
          {/* Horizontal line  */}
          <div
            className={`absolute h-[1px] w-full bg-neutral-500`}
            style={{ top: `clamp(200px, ${horLine}%, (100vh - 100px))` }}
          >
            {touchedProduct.title && (
              <>
                <p className="absolute bottom-0 left-1/3 ml-2 max-w-2/5 text-3xl font-semibold">
                  {touchedProduct.title}
                </p>
                <p className="absolute top-0 left-1/3 mt-1 ml-2 text-sm font-semibold">
                  {touchedProduct.price}€
                </p>
              </>
            )}
          </div>
          {/* Vertical line  */}
          <div
            className={`absolute left-1/3 h-full w-[1px] bg-neutral-500`}
          ></div>
        </div>

        {/* Nav list  */}
        <nav className="absolute top-0 right-[330px]">
          <ul className="text-right">
            <li>
              <a
                className="font-extrabold transition-colors hover:text-white"
                href="/"
              >
                Home
              </a>
            </li>
            <li>
              <a
                className="font-extrabold transition-colors hover:text-white"
                href="/"
              >
                Profile
              </a>
            </li>
            <li>
              <a
                className="font-extrabold transition-colors hover:text-white"
                href="/"
              >
                Cart
              </a>
            </li>
            <li>
              <a
                className="font-extrabold transition-colors hover:text-white"
                href="/"
              >
                Help
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Products list  */}

      <ul className="mr-16 flex flex-col">
        <div className="h-[200px] w-[1px] bg-neutral-500"></div>
        <div className="flex flex-col gap-12">
          {products.map((product, index) => (
            <li
              key={index}
              ref={(el) => (productRefs.current[index] = el)}
              className={`flex h-64 w-64 items-center justify-center border border-white bg-white p-4 grayscale`}
            >
              <img
                src={product.image}
                className="h-full object-contain"
                alt=""
              />
            </li>
          ))}
        </div>
        <div className="h-[100px] w-[1px] bg-neutral-500"></div>
      </ul>
    </div>
  );
}
