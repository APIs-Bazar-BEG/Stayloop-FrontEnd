import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const heroImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBaaonlsYY08CfjypIQMGf_3SZhGYkSAGOuXC0XuWXgRKtLTXXi3pjaRMvCVSJ3u8vIaJ_rO9bYrHvs718WHpEtAKup1rkvAHB8zPjHDv6FVKWdiRkraRsucWAxm9MbkCNRSa5SQREUCTF5bQf6PX3paBvg4WAq_WXiKmhw6fBSf3XVmAGKxbpZMzJm-jQ9xSEfIZb8rTmhYnlnlngNMvjGn5WH0l_znjATUEEDXRnsukhbIjIa57ZjqFLo4ad3WEnCb7liNcs";

  const destinoUrls = {
    zonte:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcP2Bedd41ji_XkIhI_cwmcHdz-VYFPmyEC_3gdgOizlQRrXnEC07rnLIGAE4TT8r1JBmqe66_ZRFTGLdCMDJ50t5QRmvn4TQrnzsv9Caz9GfJQtgkINbgrrvbaajQjC1uwZvfXNeoHfWWb1bibUV6CsHb0o9iJtpSaBMsmEto4bxZ0bYGJ1DA7gSDCYazbWp4BUScBygQ58DjuCMNgh00O77kS7RBmUiz6m-bReeyYB_gHK7MVlMzob5s55Ej1fh5EPoAO9Y",
    pital:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtxk5ydWbFz6QHJ2d4Qb7biR0YawPOW-IpM90wrvbA3R0VxUBmO1lh4ZjBK83q8cx_4OqxdcJi2el66eI3jmRLP_RdoqEGh_vQ3Sssm4gPXp2t8_yjfagryPw8VgCJoLk0D8xEM6msTDyIUToEWtV8ZDPUoohsW6TDr4BbbW_t8x8c_iH_U5VtyyV7V0-NCwwTllrjbqitTQ4v4sBkh0i7EgmKxnF0otPOfyFQTqkOvMd8gMUpegPqJiiGJbcOsQuaCkgAo7k",
    union:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfx0TXmT1y0DOScpKHDlEGzC9oBR9s5wvzIIsgcsGzmmxzyLumXDyKGHAQNP7UNhWz3slAOiqlnBcl795BWZfVGgITfFihwUftpjes3x71e8GV13n4hDQj3uSytrfsA2bfbmgw88znxhvIz3G5cCq1THrWOuEluPPSC0EqufLd-SfLY7asxKkm6pxxdGRVlsdveXxakwNrlm5k2nb6WK7ydVFhJYj8o-tJgASfGrKMrAUHGKj7cBM9vvycYGAba7uSk09ziCs",
  };

  return (
    <>
      <section className="relative w-full h-[70vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroImageUrl}")` }}
        ></div>

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 text-center text-white h-full flex flex-col justify-center items-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Encuentra el lugar de tus sueños
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl">
            Explora hoteles de alta calidad, en lugares que ofrecen experiencias
            inolvidables.
          </p>

          <div className="mt-10 max-w-2xl mx-auto w-full px-4">
            <form
              action="/hoteles"
              method="get"
              className="flex items-center bg-white rounded-full shadow-lg p-2"
            >
              <input
                className="w-full min-w-0 flex-1 resize-none border-none bg-transparent text-gray-900 focus:outline-none focus:ring-0 text-lg placeholder:text-gray-500 py-2 px-4"
                placeholder="A dónde vamos?"
                id="nombre"
                name="nombre"
                type="text"
              />

              <button
                type="submit"
                className="flex-shrink-0 ml-2 min-w-[100px] cursor-pointer rounded-full h-12 px-6 bg-blue-600 text-white text-base font-bold tracking-[0.015em] hover:bg-green-500 transition-colors flex items-center justify-center"
              >
                <div className="p-0 text-white">
                  <svg
                    fill="currentColor"
                    height="24"
                    viewBox="0 0 256 256"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
            Destinos Populares
          </h2>

          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/hoteles?nombre=El Zonte"
              className="group cursor-pointer"
            >
              <div className="w-full overflow-hidden rounded-lg shadow-lg">
                <img
                  alt="El Zonte Beach"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  src={destinoUrls.zonte}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  El Zonte Beach
                </h3>
                <p className="mt-1 text-gray-600">
                  Explora la vibrante playa El Zonte.
                </p>
              </div>
            </Link>

            <Link
              to="/hoteles?nombre=Cerro El Pital"
              className="group cursor-pointer"
            >
              <div className="w-full overflow-hidden rounded-lg shadow-lg">
                <img
                  alt="Cerro El Pital"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  src={destinoUrls.pital}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  Cerro El Pital
                </h3>
                <p className="mt-1 text-gray-600">
                  Relájate con el ambiente tranquilo de El Pital.
                </p>
              </div>
            </Link>

            <Link
              to="/hoteles?nombre=La Unión"
              className="group cursor-pointer"
            >
              <div className="w-full overflow-hidden rounded-lg shadow-lg">
                <img
                  alt="La Unión"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  src={destinoUrls.union}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  La Unión
                </h3>
                <p className="mt-1 text-gray-600">
                  Descubre la belleza de las playas de La Unión.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;