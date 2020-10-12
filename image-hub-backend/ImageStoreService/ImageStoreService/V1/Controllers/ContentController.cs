using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImageStoreService.Application;
using Microsoft.AspNetCore.Mvc;

namespace ImageStoreService.V1.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ContentController : ControllerBase
    {
        private readonly IImageStoreService imageStoreService;

        public ContentController(IImageStoreService imageStoreService)
        {
            this.imageStoreService = imageStoreService ?? throw new ArgumentNullException(nameof(imageStoreService));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Get(string id)
        {
            var result = await imageStoreService.GetImageContent(id);
            if (result.result)
            {
                return File(result.bytes, result.contentType, result.fileName);
            }

            return NotFound();
        }
    }
}
