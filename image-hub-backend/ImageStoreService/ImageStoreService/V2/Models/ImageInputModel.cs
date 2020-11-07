using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
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
