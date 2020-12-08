using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ImageHubService.Application.Relationship.Commands.AcceptFriendRequest;
using ImageHubService.Application.Relationship.Commands.RejectFriendRequest;
using ImageHubService.Application.Relationship.Commands.RemoveFriend;
using ImageHubService.Application.Relationship.Commands.SendFriendRequest;
using ImageHubService.Application.Relationship.Requests.GetFriendRequests;
using ImageHubService.Application.Relationship.Requests.GetFriends;
using ImageHubService.Application.User.Commands.AddUser;
using ImageHubService.Application.User.Queries.GetUser;
using ImageHubService.Application.User.Queries.SearchUsersByName;
using ImageHubService.Common;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ImageHubService.V2.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class UserController : Controller
    {
        private readonly IMediator mediator;

        public UserController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        /// <summary>
        /// Returns the specified user
        /// </summary>
        /// <param name="userId">Facebook user id or "me"</param>
        /// <returns>Returns the specified user</returns>
        /// <response code="200">Returns user</response>
        /// <response code="400">If the user is not friend</response>   
        [HttpGet("{userId}")]
        [ProducesResponseType(typeof(UserSummaryModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUser([FromRoute] string userId)
        {
            var user = this.GetUserId();

            var result = await mediator.Send(new GetUserByIdQuery(userId == "me" ? user : userId, user));
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(UserSummaryModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddUser([FromBody] UserInputModel user)
        {
            var userId = this.GetUserId();

            if (user.Id != userId)
            {
                return BadRequest();
            }

            await mediator.Send(new AddUserCommand(user.Id, user.Name, user.Email, user.ProfilePictureUrl));

            return Ok();
        }

        /// <summary>
        /// Returns user friends
        /// </summary>
        /// <returns>Returns list of friends</returns>
        /// <response code="200">Returns list of users</response>
        [HttpGet("search/{name}")]
        [ProducesResponseType(typeof(IEnumerable<UserSearchResult>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SearchUsersByName([FromRoute] string name)
        {
            var user = this.GetUserId();

            var result = await mediator.Send(new SearchByNameRequest(name, user));
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        /// <summary>
        /// Returns user friends
        /// </summary>
        /// <returns>Returns list of friends</returns>
        /// <response code="200">Returns list of users</response>
        [HttpGet("friends")]
        [ProducesResponseType(typeof(UserSummaryModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFriends()
        {
            var user = this.GetUserId();

            var result = await mediator.Send(new GetFriendsQuery(user));
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        /// <summary>
        /// Rejects friend request
        /// </summary>
        /// <param name="id"></param>
        /// <returns>OK</returns>
        /// <response code="200">Done</response>
        /// <response code="400">Already rejected/or not found</response>   
        [HttpPost("{id}/unfriend")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Unfriend([FromRoute] string id)
        {
            var user = this.GetUserId();

            var result = await mediator.Send(new RemoveFriendCommand(user, id));
            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
