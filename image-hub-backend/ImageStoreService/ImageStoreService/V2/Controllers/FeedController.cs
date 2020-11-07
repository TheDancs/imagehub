using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ImageHubService.V2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ImageHubService.V2.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    //TODO: implement in image hub service, create db schema 
    public class FeedController : Controller
    {
        /// <summary>
        /// Return user private feed, including own posts and posts from friend.
        /// </summary>
        /// <returns>List of posts</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PostModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetPrivateFeed()
        {
            var user = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; //fb user id
            return Ok();
        }

        /// <summary>
        /// Return user private feed, including own posts and posts from friend.
        /// </summary>
        /// <returns>List of posts</returns>
        [HttpGet("profile/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<PostModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUserProfileFeed(string userId)
        {
            var user = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; //fb user id
            return Ok();
        }
    }
}
