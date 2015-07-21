
// For Aliyun ACE.
if (process.env.NODE_ACE !== undefined) {

  console.log('api.js exports ACE env. ACE!!')
  module.exports = {
    baseApi: "",
    imageApi: ""
  }
// Local environment.
} else {

  console.log('api.js exports local env. LOCAL!!');
  module.exports = {
    baseApi: "",
    imageApi: ""
  }
}
