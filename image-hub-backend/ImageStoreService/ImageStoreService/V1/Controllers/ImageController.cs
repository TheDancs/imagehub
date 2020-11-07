using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ImageHubService.Application;
using ImageHubService.V1.Models;
using Microsoft.AspNetCore.Mvc;

namespace ImageHubService.V1.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ImageController : Controller
    {
        private readonly IImageStoreService imageStoreService;

        public ImageController(IImageStoreService imageStoreService)
        {
            this.imageStoreService = imageStoreService ?? throw new ArgumentNullException(nameof(imageStoreService));
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(UploadResultModel), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UploadImage([FromForm] ImageInputModel Image)
        {
            var result = await imageStoreService.UploadImage(Image);
            if (result.success)
            {
                return StatusCode(201, new UploadResultModel() {ImageId = result.id});
            }

            return BadRequest();
        }

        [HttpGet("list")]
        [ProducesResponseType(typeof(IEnumerable<ImageMetaModel>), 200)]
        public async Task<IActionResult> ListImage()
        {
            return Ok(await imageStoreService.ListImages());
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ImageMetaModel), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetImage([FromRoute] string id)
        {
            var result = await imageStoreService.GetImage(id);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteImage([FromRoute] string id)
        {
            var result = await imageStoreService.Delete(id);
            if (result)
            {

                return Ok();
            }

            return NotFound();
        }

        [HttpPut("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateImage([FromRoute] string id, [FromBody] ImageUpdateModel updateModel)
        {
            var result = await imageStoreService.UpdateImage(id, updateModel);
            if (result)
            {
                Ok();
            }

            return NotFound();
        }
    }
}
