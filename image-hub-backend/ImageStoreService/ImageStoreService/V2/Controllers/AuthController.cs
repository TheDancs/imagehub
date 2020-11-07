using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace ImageHubService.V2.Controllers
{
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AuthController : Controller
    {
        private UserStore<ApplicationUser> userManager;

        public AuthController(UserStore<ApplicationUser> userManager)
        {
            this.userManager = userManager;
        }

        //TODO: add new url
        [HttpGet]
        [Route("signin")]
        public IActionResult SignInWithFacebook(string ReturnUrl)
        {
            const string redirectUrl = "https://imagehub.azurewebsites.net/api/v2/auth/callback?returnurl=https://imagehub.azurewebsites.net/swagger";

            return Challenge(new AuthenticationProperties { RedirectUri = redirectUrl },
                FacebookDefaults.AuthenticationScheme);
        }

        [HttpGet]
        [Route("callback")]
        public async Task<IActionResult> SignInCallback(string returnUrl)
        {
            var authResult = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);

            if (authResult.Succeeded)
            {
                var userId = authResult.Ticket.Principal.FindFirstValue(ClaimTypes.NameIdentifier);

                var user = await userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    var result = await userManager.CreateAsync(new ApplicationUser()
                    {
                        Id = authResult.Ticket.Principal.FindFirstValue(ClaimTypes.NameIdentifier),
                        Email = authResult.Ticket.Principal.FindFirstValue(ClaimTypes.Email),
                        UserName = authResult.Ticket.Principal.FindFirstValue(ClaimTypes.Name),
                        FacebookUserId = authResult.Ticket.Principal.FindFirstValue(ClaimTypes.NameIdentifier)
                    });

                    if (!result.Succeeded)
                    {
                        return BadRequest();
                    }
                }

                await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme,
                    new ClaimsPrincipal(authResult.Ticket.Principal.Identity));

                return Redirect(returnUrl);
            }

            return BadRequest();
        }
    }
}
