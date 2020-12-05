using System.Collections.Generic;
using System.Threading.Tasks;
using ImageHubService.Application.Like.Commands.LikePost;
using ImageHubService.Application.Like.Commands.UnlikePost;
using ImageHubService.Application.Like.Requests.GetLikes;
using ImageHubService.Application.Post.Commands.UploadPost;
using ImageHubService.Common;
using ImageHubService.Domain.Entities;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace ImageHubService.V2.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class PostController : Controller
    {
        private readonly IMediator mediator;

        public PostController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        /// <summary>
        /// Upload post
        /// </summary>
        /// <param name="image"></param>
        /// <returns>OK</returns>
        //[Authorize]
        [HttpPost]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(UploadResultModel), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UploadPost([FromForm] ImageInputModel image)
        {
            var user = this.GetUserId();

            var uploadResult = await mediator.Send(new UploadPostCommand(image.File, image.Description, user));

            if (uploadResult.success)
            {
                return Ok(new UploadResultModel() { ImageId = uploadResult.id });
            }

            return BadRequest();
        }

        /// <summary>
        /// Like post
        /// </summary>
        /// <param name="image"></param>
        /// <param name="postId"></param>
        /// <returns>OK</returns>
        //[Authorize]
        [HttpPost("{postId}/like")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> LikePost([FromRoute] string postId)
        {
            var user = this.GetUserId();

            var uploadResult = await mediator.Send(new LikePostCommand(user, postId));

            if (uploadResult)
            {
                return Ok();
            }

            return BadRequest();
        }

        /// <summary>
        /// Unlike post
        /// </summary>
        /// <param name="image"></param>
        /// <param name="postId"></param>
        /// <returns>OK</returns>
        //[Authorize]
        [HttpPost("{postId}/unlike")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UnlikePost([FromRoute] string postId)
        {
            var user = this.GetUserId();

            var uploadResult = await mediator.Send(new UnlikePostCommand(user, postId));

            if (uploadResult)
            {
                return Ok();
            }

            return BadRequest();
        }

        /// <summary>
        /// Get likes 
        /// </summary>
        /// <param name="image"></param>
        /// <param name="postId"></param>
        /// <returns>OK</returns>
        //[Authorize]
        [HttpGet("{postId}/likes")]
        [ProducesResponseType(typeof(IEnumerable<LikeModel>), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetLikes([FromRoute] string postId)
        {
            var uploadResult = await mediator.Send(new GetLikesRequest(postId));

            if (uploadResult != null)
            {
                return Ok(uploadResult);
            }

            return BadRequest();
        }
    }
}
