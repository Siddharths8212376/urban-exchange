let apiUrl = ''
let type = '';
switch (window.location.hostname) {
    case "localhost":
        apiUrl = "http://localhost:5000/api"
        type = "local"
        break;
    case "urban-exchange.netlify.app":
        // apiUrl = "https://urban-exchange-backend.onrender.com/api"
        // apiUrl = "https://uex-backend.onrender.com/api"
        apiUrl = "https://lime-friendly-calf.cyclic.app/api"
        type = "prod"
        break;
}
export const env = {
    apiUrl,
    type
}