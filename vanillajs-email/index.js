require("isomorphic-fetch");

const tenantId = "9ddaaca1-389f-4cb1-a113-081be6cc25fc";
const clientId = "845c4ada-9fa5-4af6-8c93-ea2275f5ac92";
const clientSecret = "KiJ7Q~3O1MZrUbOTUyLP0fcvPzic3WeCH-q9m";
const scopes = ["user.read", "mail.send", "mail.readwrite", "offline_access"];
const authorizationURL = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
const tokenURL = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const callbackURL = "http://localhost:3000";
const token =
  "eyJ0eXAiOiJKV1QiLCJub25jZSI6IndNeUJReTJEX2Q5VWgtX2U1cDY3cVFmenVTMndDVlpGNW13R3hudFAzaXciLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85ZGRhYWNhMS0zODlmLTRjYjEtYTExMy0wODFiZTZjYzI1ZmMvIiwiaWF0IjoxNjUzMjU0NzU3LCJuYmYiOjE2NTMyNTQ3NTcsImV4cCI6MTY1MzI2MDA0OCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkUyWmdZREQ1WEh3NHc5STN6cnM0NDExKzNTY0owOWN6VDRhdGV1L1hyWEpqM2xIZHFUa0EiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkRvcm5zaWZlLUJDSS1DcmVhdGl2ZU1pbmRzTGFiIiwiYXBwaWQiOiI4NDVjNGFkYS05ZmE1LTRhZjYtOGM5My1lYTIyNzVmNWFjOTIiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6Ik1pbmRzIExhYiIsImdpdmVuX25hbWUiOiJDcmVhdGl2ZSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEwNC4xNC40OS4xNDkiLCJuYW1lIjoiQ3JlYXRpdmUgTWluZHMgTGFiIiwib2lkIjoiMDUxMDRhODAtOTIyOC00ODJjLTgzMzItYmIyZjBiYTk0ODUzIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTEyOTg0MzQwNzItMzA5MjY0NzE5NC0yNzAxMTM3NTY1LTM1Mzc0NiIsInBsYXRmIjoiNSIsInB1aWQiOiIxMDAzMjAwMTE1NDI3MzgyIiwicmgiOiIwLkFWc0FvYXphblo4NHNVeWhFd2diNXN3bF9BTUFBQUFBQUFBQXdBQUFBQUFBQUFCYkFJdy4iLCJzY3AiOiJNYWlsLlJlYWRXcml0ZSBNYWlsLlNlbmQgVXNlci5SZWFkIHByb2ZpbGUgb3BlbmlkIGVtYWlsIiwic3ViIjoiZVgtdHhZR1BwV1Q4LVhMRGVVQVpNVVpLYVBhdGxVRno3WHJXdjh4M1RQbyIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6IjlkZGFhY2ExLTM4OWYtNGNiMS1hMTEzLTA4MWJlNmNjMjVmYyIsInVuaXF1ZV9uYW1lIjoiZC1jbWluZHNAdXNjLmVkdSIsInVwbiI6ImQtY21pbmRzQHVzYy5lZHUiLCJ1dGkiOiIxZC1kSXZSenJraXpkX1o0SXhDTUFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6ImY0ay1vWDhjbjhzWnN4eERlZEVSRmVCclJvS3RwMGtNd0dPWjd1SWVxVVEifSwieG1zX3RjZHQiOjEzMDQwMjk2ODl9.epQS0aw_Q0CcRLkXqlCPVS61qTz5ntQkMN5tDrapYxLGitX80RvxgnVgD5DGMKVfNitI47Q7wgJYT6eGl9Ekx44U4hGsbBLURlKTsZWIFEqD-9V72L8xIHL2x5SAX0zKcDpkhtfJavARVdiuWa8oIKSk9zXL5DU_V_Pimveq-Ob0fUE-Iv2yDWWFPl9z9YJKNvBe9hgZ-OhH-7JSIVEN7WjTLRsLCharU5mSJxod35P8JrejdCp0EtYHfKkR_kYvlnIL_gh2OBzU2eENw4r1EfGlNvfb5tXjGRrq9Q3t576eVg2sUvLhERHsrWThiUWOtP5wsDlX-KGcu7vvQlcp9w";
const refresh_token =
  "0.AVsAoazanZ84sUyhEwgb5swl_NpKXISln_ZKjJPqInX1rJJbAIw.AgABAAEAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P-y5ME_r8armu_c19zVmUIG8z4lZDjbx4U8jNU5CPAJ-NtdrTTu02Siz0OJ3e2c_89hBB4xzcl9XKkjSCtuln67pEK_y0a1t9QqgI2v6yjyLiiYZf-0JJGK16Ma-lYEj7OZoFquUpJYTkrjk0dE4CRm1wwW8LM17O49FyJrDT63idG9aLigPvST_oyq0UNuuVietPEr8CUCklnwOhtVwdrnxRE2WYdz8ijg6pkJ6uiSg9gDB_CCas-djh0fWgEVNZMlQe5DC22IMgT-O9amAGovSsxRhQQwXOEYR1J8eE1r5zk4urVLWaMRipo_KY1laNlTv_S_EeUSI-tuKHDvt3ZIfbgIXdcqlS2E4szQKTFlEKBg2LFvy5PxegNcPhsvwJlHef6qQNhjtCFIztTd3qQidvix-qnh38G4XayoDwTBLASn2EcCE0nC1K-548-P-tEgWUoQU06-3JWcwaPSYSwIDntIQkTi3Y9Bk_lM-l-8p3M0CeKPmmu-lvE5QfxL3KROo8G4g3obfzL-e4rGhcCKhngsump_ckMsv8-HFCJCssI73x__RTEcRECqDxUkoYOomWF5lSIxA1Q_Bo-me7b9IpSSYiRzCthr5mg920vboR3hpgjhwtuV6SpbKOPv_CF3Kav2Hb0mRFx342DxPGXq5yI65A6C_iLgHWecX8YqRnXF8H9_ShZI-jc3MFLw8SwNILHgNFVEu_jeWXOiXrTascCYKNP70OHbZnmzYtQw9N67UamcbG2nauQDZIUA2ltDjnCdgYCo0FV2OFvTv1QqjB1OmezrZxrvPfdgSUmgOcU43kRRj_m8V1DouCT2bJBfLEMcok2bw9jNWthqtCbJ";
const hostURL = "https://graph.microsoft.com";

// Example POST method implementation:
async function post(
  url = "",
  data = "",
  headers = { "Content-Type": "application/x-www-form-urlencoded" }
) {
  // Default options are marked with *
  console.log(data);
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: headers,
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data, // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

function get(endpoint, token) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  console.log("Calling Web API...");

  fetch(endpoint, options)
    .then((response) => response.json())
    .then((response) => {
      if (response) {
        console.log("Web API responded: Hello " + response["name"] + "!");
      }

      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

const mailContent = {
  message: {
    subject: "Meet for lunch?",
    body: {
      contentType: "Text",
      content: "The new cafeteria is open.",
    },
    toRecipients: [
      {
        emailAddress: {
          address: "cqian550@usc.edu",
        },
      },
    ],
  },
  saveToSentItems: "false",
};

get(`${hostURL}/v1.0/me/`, token);
// post(`${hostURL}/v1.0/me/sendMail`, JSON.stringify(mailContent), {
//   "Content-Type": "application/json",
//   // "Content-Type": "application/x-www-form-urlencoded",
//   Authorization: `Bearer ${token}`,
// }).then((res) => console.log(res));

// post(
//   tokenURL,
//   `client_id=${clientId}
// &scope=${scopes.join("+")}
// &refresh_token=${refresh_token}
// &redirect_uri=${callbackURL}
// &grant_type=refresh_token`
// ).then((data) => {
//   console.log(data);
// });

// post(
//   tokenURL,
//   `client_id=${clientId}
// &scope=${scopes.join("+")}
// &code=${code}
// &redirect_uri=${callbackURL}
// &grant_type=authorization_code`
// ).then((data) => console.log(data));

// fetch(
//   `${authorizationURL}?client_id=${clientId}&response_type=code&redirect_uri=${callbackURL}&response_mode=query&https://graph.microsoft.com/&scope=${scopes.join(
//     "+"
//   )}&state=12345`
// ).then((response) => console.log(response.url));
