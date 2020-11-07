using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ImageHubService.V2.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class UserController : Controller
    {
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            var user = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; //fb user id
            return Ok();
        }



    }
}
