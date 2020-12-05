using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ImageHubService.Domain.Entities
{
    public class User
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Email { get; set; }
        public string ProfilePictureUrl { get; set; }

        public ICollection<Post> Posts { get; set; }
    }
}
