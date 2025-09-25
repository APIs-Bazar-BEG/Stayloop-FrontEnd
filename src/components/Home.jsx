import React from "react";

const Home = () => {
  return (
    <div className="relative w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaaonlsYY08CfjypIQMGf_3SZhGYkSAGOuXC0XuWXgRKtLTXXi3pjaRMvCVSJ3u8vIaJ_rO9bYrHvs718WHpEtAKup1rkvAHB8zPjHDv6FVKWdiRkraRsucWAxm9MbkCNRSa5SQREUCTF5bQf6PX3paBvg4WAq_WXiKmhw6fBSf3XVmAGKxbpZMzJm-jQ9xSEfIZb8rTmhYnlnlngNMvjGn5WH0l_znjATUEEDXRnsukhbIjIa57ZjqFLo4ad3WEnCb7liNcs')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 text-center text-white">
        <h1 className="text-5xl font-extrabold sm:text-6xl lg:text-7xl">
          Encuentra el lugar de tus sueños
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl">
          Explora hoteles de alta calidad, en lugares que ofrecen experiencias
          inolvidables.
        </p>
        <div className="mt-10 max-w-2xl mx-auto">
          <form className="flex items-center bg-white rounded-full shadow-lg p-2">
            <input
              type="text"
              placeholder="¿A dónde vamos?"
              className="flex-1 bg-transparent text-black placeholder-gray-500 p-2 rounded-l-full"
            />
            <button className="ml-2 bg-green-500 text-white px-6 py-2 rounded-r-full hover:bg-green-600">
              Buscar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
