using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ImageStoreService.V1.Models
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
