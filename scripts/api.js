// -- DEPENDS ON AXIOS

var APIService = {
  apiurl: "http://localhost:1234" // Replace with your API
}
APIService.startSessionUrl = APIService.apiurl + "/startSession";
APIService.getUrl = (s) => APIService.apiurl + "/db/" + s;


let handlers = [
  "getUser",
  "getUsers",
  "getSession",
  "getSessions",
  "getDegree",
  "getDegrees",
  "getRegistrationSeason",
  "getRegistrationSeasons",
  "getMembership",
  "getMemberships",
  "createAdmin",
  "createDegree",
  "createMember",
  "createRegistration",
  "deleteMember",
  "closeRegistration"
];

APIService.startSession = async (username) => {
  return await axios.post(APIService.startSessionUrl, {username});
}

for (let handler of handlers){
  APIService[handler] = async (params) => {
    try {
      return await axios.post(APIService.getUrl(handler), params);
    } catch (e) {
      return {error: "errore!"}
    }
  }
}

APIService.getLatestYear = async() => {
  let seasons;
  try {
    seasons = await APIService.getRegistrationSeasons({});
    let years = seasons.data.map(x => x.year);
    let latest = Math.max.apply(null, years);
    return latest;
  } catch (e) {
    return -1;
  }
};
