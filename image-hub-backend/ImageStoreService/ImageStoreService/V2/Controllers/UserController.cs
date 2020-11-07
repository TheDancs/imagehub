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
    public class UserController : Controller
    {
        /// <summary>
        /// Returns the specified user
        /// </summary>
        /// <param name="userId">Facebook user id or "me"</param>
        /// <returns>Returns the specified user</returns>
        /// <response code="200">Returns user</response>
        /// <response code="400">If the user is not friend</response>   
        [HttpGet("{userId}")]
        [ProducesResponseType(typeof(UserModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUser([FromRoute]string userId)
        {
            var user = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; //fb user id
            return Ok();
        }

        /// <summary>
        /// Return friend requests
        /// </summary>
        /// <returns>List of friend requests</returns>
        /// <response code="200">List of friend requests</response>
        [HttpGet("friendrequests")]
        [ProducesResponseType(typeof(IEnumerable<FriendRequest>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetFriendRequests()
        {
            var user = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; //fb user id
            return Ok();
        }

        /// <summary>
        /// Accepts friend request
        /// </summary>
        /// <param name="id"></param>
        /// <returns>OK</returns>
        /// <response code="200">Done</response>
        /// <response code="400">Already accepted/or not found</response>   
        [HttpPost("friendrequests/{id}/accept")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AcceptFriendRequest([FromRoute]string id)
        {
            var user = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; //fb user id
            return Ok();
        }

        /// <summary>
        /// Rejects friend request
        /// </summary>
        /// <param name="id"></param>
        /// <returns>OK</returns>
        /// <response code="200">Done</response>
        /// <response code="400">Already rejected/or not found</response>   
        [HttpPost("friendrequests/{id}/reject")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RejectFriendRequest([FromRoute] string id)
        {
            var user = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; //fb user id
            return Ok();
        }

        /// <summary>
        /// Sends friend request
        /// </summary>
        /// <param name="id"></param>
        /// <returns>OK</returns>
        /// <response code="200">Done</response>
        /// <response code="400">Something happened</response>   
        [HttpPost("{id}/add")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SendFriendRequest([FromRoute] string userId)
        {
            var user = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; //fb user id
            return Ok();
        }

    }
}
