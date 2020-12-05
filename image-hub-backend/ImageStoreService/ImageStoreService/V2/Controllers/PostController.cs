using System.Threading.Tasks;
using ImageHubService.Application.Post.Commands.UploadPost;
using ImageHubService.Common;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
        /// Upload image
        /// </summary>
        /// <param name="image"></param>
        /// <returns>OK</returns>
        //[Authorize]
        [HttpPost]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(UploadResultModel), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UploadImage([FromForm] ImageInputModel image)
        {
            var user = this.GetUserId();

            var uploadResult = await mediator.Send(new UploadPostCommand(image.File, image.Description, user));

            if (uploadResult.success)
            {
                return Ok(new UploadResultModel() {ImageId = uploadResult.id});
            }

            return BadRequest();
        }
    }
}
