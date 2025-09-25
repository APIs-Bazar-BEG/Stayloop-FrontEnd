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