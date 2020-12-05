using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ImageHubService.V2.Models
{
    public class ImageInputModel
    {
        [Required]
        public IFormFile File { get; set; }
        public string Description { get; set; }
    }
}
