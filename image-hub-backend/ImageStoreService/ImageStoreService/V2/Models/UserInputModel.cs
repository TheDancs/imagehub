using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHubService.V2.Models
{
    public class UserInputModel
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Email { get; set; }
        public string ProfilePictureUrl { get; set; }
    }
}
