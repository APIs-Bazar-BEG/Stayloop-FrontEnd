import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login/Login";
import { login } from "../services/stayloopService";
import { BrowserRouter } from "react-router-dom";

// Simulamos (mockeamos) la función "login" para no llamar a la API real
jest.mock("../services/stayloopService", () => ({
  login: jest.fn(),
}));

describe("Login Component", () => {
  test("muestra los campos de correo y contraseña", () => {
    render(
      <BrowserRouter>
        <Login onLoginSuccess={() => {}} />
      </BrowserRouter>
    );

    // Verifica que existan los inputs
    expect(
      screen.getByPlaceholderText("Ingresa tu correo")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingresa tu contraseña")
    ).toBeInTheDocument();
  });

  test("llama a login() al enviar el formulario", async () => {
    login.mockResolvedValueOnce({ user: { idRol: 1 } }); // simulamos respuesta exitosa

    render(
      <BrowserRouter>
        <Login onLoginSuccess={() => {}} />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("Ingresa tu correo");
    const passwordInput = screen.getByPlaceholderText("Ingresa tu contraseña");
    const submitButton = screen.getByRole("button", {
      name: /Iniciar Sesión/i,
    });

    // Simulamos llenar el formulario
    fireEvent.change(emailInput, { target: { value: "test@correo.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    // Espera que login haya sido llamado una vez
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@correo.com", "123456");
    });
  });
});
