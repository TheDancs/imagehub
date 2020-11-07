using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ImageHubService.V2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ImageHubService.V2.Controllers
{
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ImageController : Controller
    {
        /// <summary>
        /// Returns post image
        /// </summary>
        /// <param name="id">Image id</param>
        /// <returns>Image file</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Get(string id)
        {
            return NotFound();
        }

        /// <summary>
        /// Upload image
        /// </summary>
        /// <param name="image"></param>
        /// <returns>OK</returns>
        [Authorize]
        [HttpPost]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(UploadResultModel), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UploadImage([FromForm] ImageInputModel image)
        {
            var user = this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value; //fb user id

            return Ok();
        }
    }
}
