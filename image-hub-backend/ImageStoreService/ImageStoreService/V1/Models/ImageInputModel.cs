using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ImageHubService.V1.Models
{
    public class ImageInputModel
    {
        [Required]
        public IFormFile File { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [Required]
        public string UploaderId { get; set; }
    }
}
