import ip_servidor from '../../server/ip_servidor.json'

const API_BASE_URL = `http://${ip_servidor.ip_servidor}:4000`;
export default API_BASE_URL;