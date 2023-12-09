import axios from "axios";

const API = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/users",
  headers: {
    "Content-Type": "application/json",
  },
});

const UserService = {
  getAll: API.get,
  create: (user) => API.post("", user),
  update: (user) => API.put(`/${user.id}`, user),
  delete: (id) => API.delete(`/${id}`),
};

export default UserService;
