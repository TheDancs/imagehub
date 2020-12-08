function const name = new type(arguments);() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += msg + '\r\n';
    });
}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);

var config = {
    authority: "https://localhost:44342",
    client_id: "image_hub_client",
    redirect_uri: "http://localhost:3000/callback.html",
    response_type: "code",
    scope:"openid profile",
    post_logout_redirect_uri : "http://localhost:3000/index.html",
    //acr_values: "idp:aad.oidc"
};
var mgr = new Oidc.UserManager(config);
mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user);
    }
    else {
        log("User not logged in");
    }
});

function login() {
    mgr.signinRedirect();
}

function api() {
    mgr.getUser().then(function (user) {
        console.log(user);
    });
}

function logout() {
    mgr.signoutRedirect();
}