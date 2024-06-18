let apiUrl = '';
let apiHostName = '';
let type = '';
switch (window.location.hostname) {
    case "localhost":
        apiUrl = "http://localhost:5000/api"
        apiHostName = "http://localhost:5000"
        type = "local"
        break;
    case "urban-exchange.netlify.app":
        // apiUrl = "https://urban-exchange-backend.onrender.com/api"
        apiUrl = "https://uex-backend.onrender.com/api"
        apiHostName = "https://uex-backend.onrender.com"
        // apiUrl = "https://lime-friendly-calf.cyclic.app/api"
        type = "prod"
        break;
}
export const env = {
    apiUrl,
    apiHostName,
    type,
}