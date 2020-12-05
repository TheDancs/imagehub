using System.Threading.Tasks;
using ImageHubService.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ImageHubService.V2.Controllers
{
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ImageController : Controller
    {
        private readonly IPictureRepo pictureRepo;

        public ImageController(IPictureRepo pictureRepo)
        {
            this.pictureRepo = pictureRepo;
        }

        /// <summary>
        /// Returns post image
        /// </summary>
        /// <param name="id">Image id</param>
        /// <returns>Image file</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Get([FromRoute]string id)
        {
            var result =  await pictureRepo.RetrieveImage(id);
            if (result.iamgeStream != null)
            {
                return File(result.iamgeStream, result.contentType, id);
            }

            return NotFound();
        }
    }
}
