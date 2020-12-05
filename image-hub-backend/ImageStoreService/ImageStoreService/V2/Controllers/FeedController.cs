using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ImageHubService.Application.Feed.Requests.GetPrivateFeed;
using ImageHubService.Application.Feed.Requests.GetUserFeed;
using ImageHubService.Common;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;

namespace ImageHubService.V2.Controllers
{
    [Authorize("ImageHubIDP")]
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    //TODO: implement in image hub service, create db schema 
    public class FeedController : Controller
    {
        private readonly IMediator mediator;

        public FeedController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        /// <summary>
        /// Return user private feed, including own posts and posts from friend.
        /// </summary>
        /// <returns>List of posts</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PostModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetPrivateFeed()
        {
            var userId = this.GetUserId();

            return Ok(await mediator.Send(new GetPrivateFeedRequest(userId)));
        }

        /// <summary>
        /// Return user feed. Pass user id
        /// </summary>
        /// <returns>List of posts</returns>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<PostModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUserProfileFeed([FromRoute] string userId)
        {
            var user = this.GetUserId();

            return Ok(await mediator.Send(new GetUserFeedRequest(userId == "me" ? user : userId)));
        }
    }
}
