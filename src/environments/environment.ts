let apiUrl = ''
switch (window.location.hostname) {
    case "localhost":
        apiUrl = "http://localhost:5000/api"
        break;
    case "urban-exchange.onrender.com":
        apiUrl = "https://urban-exchange.onrender.com/api"
        break;
}
export const env = {
    apiUrl
}