// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4;
using IdentityServer4.Models;
using System.Collections.Generic;

namespace ImageHub.IDP
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> IdentityResources =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };

        public static IEnumerable<ApiResource> ApiResources => new ApiResource[]
        {
            new ApiResource(
                "imagehubapi",
                "Image HUB API",
                new List<string>() { "role" })
            {
                ApiSecrets = { new Secret("475529d53f0b4fd4a3e920e6b70adbbe".Sha256()) },
                Scopes = { "imagehubapi.all" }
            }
        };

        public static IEnumerable<ApiScope> ApiScopes =>
            new ApiScope[]
            {
                new ApiScope()
                {
                    Name = "imagehubapi.all",
                    DisplayName = "Read/Write/Delete images"
                }, 
            };

        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                new Client()
                {
                    ClientName = "Image Hub",
                    ClientId = "image_hub_client",
                    AllowedGrantTypes = GrantTypes.Code,
                    UpdateAccessTokenClaimsOnRefresh = true,
                    RedirectUris = new List<string>()
                    {
                        "https://localhost:44389/signin-oidc",
                        "https://localhost:3000/signin-oidc",
                        "http://localhost:3000/signin-oidc",
                        "https://imagehubdev.z28.web.core.windows.net/signin-oidc"
                    },
                    PostLogoutRedirectUris =
                    {
                        "http://localhost:3000/index.html",
                        "https://imagehubdev.z28.web.core.windows.net/logout/callback"
                    },
                    AllowedCorsOrigins = {"http://localhost:3000", "https://imagehubdev.z28.web.core.windows.net/"},
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "imagehubapi"
                    },
                    ClientSecrets =
                    {
                        new Secret("83ac6d60f2d84bcc8420eb0147a0c220".Sha256())
                    },
                    RequirePkce = true,
                    RequireClientSecret = false
                }
            };
    }
}