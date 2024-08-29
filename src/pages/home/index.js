import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <div className="w-full flex flex-row justify-center items-center mt-[50px] mb-[70px]">
            <div className="w-full flex justify-center items-center">
              <img
                src={"/assets/images/logo.jpeg"}
                alt="Rivanoo Logo"
                width={100}
                className="radius-20-img"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-3"></div>
        <div className="col-span-12 lg:col-span-3">
          <Link to={"/germany-app"}>
            <div className="bg-[#f0f4ff] color-[#007bff] border-2 border-[#007bff] rounded-[10px] p-8 m-5 cursor-pointer lg:transition-all lg:duration-[0.3s] lg:ease lg:hover:mt-[-2px]">
              <div className="flex flex-col justify-center items-center">
                <img
                  width={50}
                  src={"/assets/images/Flag_of_Germany.svg"}
                  alt="Germany Flag"
                  className="mb-[15px]"
                />
                <h2 className="text-[1.5rem] text-[#007bff] font-semibold m-0 mb-2">
                  Germany Apps
                </h2>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <Link to={"/sweden-app"}>
            <div className="bg-[#f0f4ff] color-[#007bff] border-2 border-[#007bff] rounded-[10px] p-8 m-5 cursor-pointer lg:transition-all lg:duration-[0.3s] lg:ease lg:hover:mt-[-2px]">
              <div className="flex flex-col justify-center items-center">
                <img
                  width={50}
                  src={"/assets/images/Flag_of_Sweden.svg"}
                  alt="Sweden Falg"
                  className="mb-[15px]"
                />
                <h2 className="text-[1.5rem] text-[#007bff] font-semibold m-0 mb-2">
                  Sweden Apps
                </h2>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-span-12 lg:col-span-3"></div>
      </div>
    </div>
  );
};

export default HomePage;
