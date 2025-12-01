// import axios from "../axios.js"
export function login(email, password) {
    return axios.post("URL",{
        email: email,
        password: password,
    })

}