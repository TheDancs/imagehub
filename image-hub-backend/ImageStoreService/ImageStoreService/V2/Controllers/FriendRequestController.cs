using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImageHubService.Application.Relationship.Commands.AcceptFriendRequest;
using ImageHubService.Application.Relationship.Commands.RejectFriendRequest;
using ImageHubService.Application.Relationship.Commands.SendFriendRequest;
using ImageHubService.Application.Relationship.Requests.GetFriendRequests;
using ImageHubService.Common;
using ImageHubService.Domain.Entities;
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
    public class FriendRequestController : Controller
    {
        private readonly IMediator mediator;

        public FriendRequestController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        /// <summary>
        /// Return friend requests
        /// </summary>
        /// <returns>List of friend requests</returns>
        /// <response code="200">List of friend requests</response>
        [HttpGet("list")]
        [ProducesResponseType(typeof(IEnumerable<FriendRequest>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetFriendRequests()
        {
            var user = this.GetUserId();

            return Ok(await mediator.Send(new GetFriendRequests(user)));
        }

        /// <summary>
        /// Accepts friend request
        /// </summary>
        /// <param name="id"></param>
        /// <returns>OK</returns>
        /// <response code="200">Done</response>
        /// <response code="400">Already accepted/or not found</response>   
        [HttpPost("accept/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AcceptFriendRequest([FromRoute] string id)
        {
            var user = this.GetUserId();

            var result = await mediator.Send(new AcceptFriendRequestCommand(id, user));
            if (result)
            {

                return Ok();
            }

            return BadRequest();
        }

        /// <summary>
        /// Rejects friend request
        /// </summary>
        /// <param name="id"></param>
        /// <returns>OK</returns>
        /// <response code="200">Done</response>
        /// <response code="400">Already rejected/or not found</response>   
        [HttpPost("reject/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RejectFriendRequest([FromRoute] string id)
        {
            var user = this.GetUserId();

            var result = await mediator.Send(new RejectFriendRequestCommand(id, user));
            if (result)
            {

                return Ok();
            }

            return BadRequest();
        }

        /// <summary>
        /// Sends friend request
        /// </summary>
        /// <param name="toUserId"></param>
        /// <returns>OK</returns>
        /// <response code="200">Done</response>
        /// <response code="400">Something happened</response>   
        [HttpPost("send/{toUserId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SendFriendRequest([FromRoute] string toUserId)
        {
            var user = this.GetUserId();

            var result = await mediator.Send(new SendFriendRequestCommand(user, toUserId));
            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

    }
}
