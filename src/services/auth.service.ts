import axios from "axios";

const API_URL_USERS = "https://6edeayi7ch.execute-api.us-east-1.amazonaws.com/v1/examen/employees/:tu_nombre";
const API_URL_USER = "https://6edeayi7ch.execute-api.us-east-1.amazonaws.com/v1/examen/employees/:tu_nombre";

class AuthService {
  login(username: string, password: string) {
    localStorage.setItem("user", username);
    return Promise.resolve({
      username,
      password,
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string) {
    
    return Promise.resolve({
      username,
      email,
      password,
      message: 'usuario registrado con  exito'
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return userStr;

    return null;
  }

  getPeople() {
    return axios
      .get(API_URL_USERS)
      .then(response => {
        return response.data;
      });
  }

  postEdit(row: any) {
    return axios
      .post(API_URL_USER, {
          name: row.name,
          last_name: row.last_name,
          birthday: "1992/11/20",
      })
      .then(response => {
        return response.data;
      });
  }
}

export default new AuthService();