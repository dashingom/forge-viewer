function getAccessToken() {
  return fetch(
    "https://apis.cctech.co.in/forge-apis-dev/get-token?app=drone-fleet-optimization"
  )
    .then(response => response.json())
    .then(res => {
      return res;
    })
    .catch(function(error) {
      console.log(error);
    });
}

const client = { getAccessToken };
export default client;
